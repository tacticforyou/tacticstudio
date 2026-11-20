export type WaterScenePainter = (
  background: HTMLDivElement,
) => HTMLCanvasElement | null;

type WaterLighting = {
  refractionScale: number;
  highlightOpacity: number;
  shadowOpacity: number;
  waterLight: { x: number; y: number; z: number };
};

const vertexSource = `#version 300 es
in vec2 position;
out vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const mapSource = `#version 300 es
precision highp float;
uniform highp sampler2D heights;
uniform vec3 lightDirection;
uniform float lightingStrength;
out vec4 color;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  ivec2 size = textureSize(heights, 0);
  float edge = float(min(min(p.x, p.y), min(size.x - 1 - p.x, size.y - 1 - p.y)));
  if (edge < 1.0) { color = vec4(vec3(128.0 / 255.0), 1.0); return; }
  float dx = texelFetch(heights, p - ivec2(1, 0), 0).r - texelFetch(heights, p + ivec2(1, 0), 0).r;
  float dy = texelFetch(heights, p - ivec2(0, 1), 0).r - texelFetch(heights, p + ivec2(0, 1), 0).r;
  float fade = smoothstep(0.0, 8.0, edge);
  vec3 normal = normalize(vec3(dx * 0.9, dy * 0.9, 1.0));
  float diffuse = dot(normal, lightDirection) - lightDirection.z;
  float heightLight = 0.2 * tanh(texelFetch(heights, p, 0).r * 0.7);
  float light = tanh(diffuse * 2.0 + heightLight);
  // Match the existing RGBA8 map, including its neutral value and quantization.
  color = vec4((vec3(128.0) + 110.0 * fade * vec3(tanh(dx * 1.6), tanh(dy * 1.6), light * lightingStrength)) / 255.0, 1.0);
}`;

const sceneSource = `#version 300 es
precision highp float;
in vec2 uv;
uniform sampler2D scene;
uniform sampler2D displacement;
uniform vec2 cssSize;
uniform float scale;
uniform float highlightOpacity;
uniform float shadowOpacity;
out vec4 color;
void main() {
  vec2 point = vec2(uv.x, 1.0 - uv.y);
  vec3 wave = texture(displacement, point).rgb;
  vec2 offset = (wave.rg - 0.5) * scale / cssSize;
  vec2 source = point + offset;
  vec4 refracted = texture(scene, source);
  // SVG's source graphic is transparent outside the section bounds.
  if (any(lessThan(source, vec2(0.0))) || any(greaterThan(source, vec2(1.0)))) refracted = vec4(0.0);
  float shadow = clamp((128.0 / 255.0 - wave.b) * shadowOpacity, 0.0, 1.0);
  float highlight = clamp((wave.b - 128.0 / 255.0) * highlightOpacity, 0.0, 1.0);
  vec3 shaded = refracted.rgb * (1.0 - shadow);
  color = vec4(mix(shaded, vec3(1.0), highlight) * refracted.a, refracted.a);
}`;

export function createWaterWebGLRenderer(
  background: HTMLDivElement,
  paintScene: WaterScenePainter,
  lighting: WaterLighting,
) {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;
  const maxTextureSize: number = gl.getParameter(gl.MAX_TEXTURE_SIZE);

  canvas.className =
    "pointer-events-none absolute inset-0 z-2 size-full rounded-[inherit]";
  canvas.dataset.waterWebgl = "";
  canvas.style.visibility = "hidden";
  canvas.dataset.waterState = "idle";
  background.append(canvas);

  let gridWidth = 0;
  let gridHeight = 0;
  let cssWidth = 0;
  let cssHeight = 0;
  let ready = false;
  let active = false;
  let disposed = false;
  let sceneFrame = 0;
  let resources: ReturnType<typeof initialize> | null = null;

  function initialize() {
    const shaders: WebGLShader[] = [];
    const programs: WebGLProgram[] = [];
    const textures: WebGLTexture[] = [];
    const buffers: WebGLBuffer[] = [];
    const framebuffers: WebGLFramebuffer[] = [];
    function disposeResources() {
      shaders.forEach((shader) => gl!.deleteShader(shader));
      programs.forEach((program) => gl!.deleteProgram(program));
      textures.forEach((texture) => gl!.deleteTexture(texture));
      buffers.forEach((buffer) => gl!.deleteBuffer(buffer));
      framebuffers.forEach((framebuffer) => gl!.deleteFramebuffer(framebuffer));
    }
    function shader(type: number, source: string) {
      const result = gl!.createShader(type);
      if (!result) throw new Error("Cannot allocate water shader");
      shaders.push(result);
      gl!.shaderSource(result, source);
      gl!.compileShader(result);
      if (!gl!.getShaderParameter(result, gl!.COMPILE_STATUS)) {
        throw new Error(
          gl!.getShaderInfoLog(result) ?? "Cannot compile water shader",
        );
      }
      return result;
    }
    function program(source: string, names: string[]) {
      const result = gl!.createProgram();
      if (!result) throw new Error("Cannot allocate water program");
      programs.push(result);
      gl!.attachShader(result, shader(gl!.VERTEX_SHADER, vertexSource));
      gl!.attachShader(result, shader(gl!.FRAGMENT_SHADER, source));
      gl!.bindAttribLocation(result, 0, "position");
      gl!.linkProgram(result);
      if (!gl!.getProgramParameter(result, gl!.LINK_STATUS)) {
        throw new Error(
          gl!.getProgramInfoLog(result) ?? "Cannot link water program",
        );
      }
      return {
        program: result,
        uniforms: Object.fromEntries(
          names.map((name) => [name, gl!.getUniformLocation(result, name)]),
        ),
      };
    }
    function texture(filter: number) {
      const result = gl!.createTexture();
      if (!result) throw new Error("Cannot allocate water texture");
      textures.push(result);
      gl!.bindTexture(gl!.TEXTURE_2D, result);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      return result;
    }
    try {
      const map = program(mapSource, [
        "heights",
        "lightDirection",
        "lightingStrength",
      ]);
      const scene = program(sceneSource, [
        "scene",
        "displacement",
        "cssSize",
        "scale",
        "highlightOpacity",
        "shadowOpacity",
      ]);
      gl!.useProgram(map.program);
      gl!.uniform1i(map.uniforms.heights, 0);
      gl!.uniform3f(
        map.uniforms.lightDirection,
        lighting.waterLight.x,
        lighting.waterLight.y,
        lighting.waterLight.z,
      );
      gl!.useProgram(scene.program);
      gl!.uniform1i(scene.uniforms.scene, 0);
      gl!.uniform1i(scene.uniforms.displacement, 1);
      gl!.uniform1f(scene.uniforms.highlightOpacity, lighting.highlightOpacity);
      gl!.uniform1f(scene.uniforms.shadowOpacity, lighting.shadowOpacity);
      const vertices = gl!.createBuffer();
      const framebuffer = gl!.createFramebuffer();
      if (vertices) buffers.push(vertices);
      if (framebuffer) framebuffers.push(framebuffer);
      if (!vertices || !framebuffer)
        throw new Error("Cannot allocate water surface");
      gl!.bindBuffer(gl!.ARRAY_BUFFER, vertices);
      gl!.bufferData(
        gl!.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl!.STATIC_DRAW,
      );
      gl!.enableVertexAttribArray(0);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
      return {
        map,
        scene,
        heights: texture(gl!.NEAREST),
        displacement: texture(gl!.LINEAR),
        image: texture(gl!.LINEAR),
        framebuffer,
        dispose: disposeResources,
      };
    } catch (error) {
      disposeResources();
      console.warn(
        "Water WebGL initialization failed; using the SVG renderer.",
        error,
      );
      return null;
    }
  }

  function hide() {
    if (!active) return;
    active = false;
    canvas.style.visibility = "hidden";
    canvas.dataset.waterState = "idle";
  }

  function rebuildScene() {
    sceneFrame = 0;
    ready = false;
    hide();
    if (!resources || disposed || gl!.isContextLost()) return;
    try {
      const scene = paintScene(background);
      if (
        !scene ||
        scene.width > maxTextureSize ||
        scene.height > maxTextureSize
      )
        return;
      cssWidth = background.getBoundingClientRect().width;
      cssHeight = background.getBoundingClientRect().height;
      canvas.width = scene.width;
      canvas.height = scene.height;
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, resources.image);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        scene,
      );
      gl!.useProgram(resources.scene.program);
      gl!.uniform2f(resources.scene.uniforms.cssSize, cssWidth, cssHeight);
      ready = true;
    } catch (error) {
      console.warn("Water scene upload failed; using the SVG renderer.", error);
    }
  }

  function resize(width: number, height: number) {
    gridWidth = width;
    gridHeight = height;
    if (!resources || gl!.isContextLost()) return;
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, resources.heights);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.R32F,
      width,
      height,
      0,
      gl!.RED,
      gl!.FLOAT,
      null,
    );
    gl!.bindTexture(gl!.TEXTURE_2D, resources.displacement);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA8,
      width,
      height,
      0,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      null,
    );
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, resources.framebuffer);
    gl!.framebufferTexture2D(
      gl!.FRAMEBUFFER,
      gl!.COLOR_ATTACHMENT0,
      gl!.TEXTURE_2D,
      resources.displacement,
      0,
    );
    const complete =
      gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) === gl!.FRAMEBUFFER_COMPLETE;
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    if (!complete) {
      ready = false;
      hide();
      return;
    }
    rebuildScene();
  }

  function imageLoaded() {
    cancelAnimationFrame(sceneFrame);
    sceneFrame = requestAnimationFrame(rebuildScene);
  }
  function lost(event: Event) {
    event.preventDefault();
    ready = false;
    hide();
    resources = null;
  }
  function restored() {
    resources = initialize();
    if (gridWidth && gridHeight) resize(gridWidth, gridHeight);
  }
  const images = [...background.querySelectorAll("img")];
  images.forEach((image) => image.addEventListener("load", imageLoaded));
  window.addEventListener("resize", imageLoaded);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  resources = initialize();

  return {
    get ready() {
      return ready && !gl.isContextLost();
    },
    resize,
    hide,
    render(
      heights: Float32Array<ArrayBuffer>,
      strength: number,
      lightingStrength: number,
    ) {
      if (!resources || !ready) return;
      const { map, scene } = resources;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, resources.heights);
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        0,
        gridWidth,
        gridHeight,
        gl.RED,
        gl.FLOAT,
        heights,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, resources.framebuffer);
      gl.viewport(0, 0, gridWidth, gridHeight);
      gl.useProgram(map.program);
      gl.uniform1f(map.uniforms.lightingStrength, lightingStrength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(scene.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, resources.image);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, resources.displacement);
      gl.uniform1f(scene.uniforms.scale, lighting.refractionScale * strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!active) {
        active = true;
        canvas.style.visibility = "visible";
        canvas.dataset.waterState = "active";
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(sceneFrame);
      images.forEach((image) => image.removeEventListener("load", imageLoaded));
      window.removeEventListener("resize", imageLoaded);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      resources?.dispose();
      canvas.remove();
    },
  };
}
