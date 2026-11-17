const vertexSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * vec2(0.5, -0.5) + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;
  varying vec2 v_uv;
  uniform vec2 u_pointer;
  uniform float u_influence;
  uniform float u_aspect;
  uniform int u_mode;

  float band(float distanceToCenter, float width) {
    float distance = distanceToCenter / width;
    return exp2(-distance * distance);
  }

  vec3 silk(vec2 uv, vec2 point) {
    float bend = band(uv.x - u_pointer.x, 0.33) * (u_pointer.y - 0.5) * u_influence;
    float fold = 0.53 - 0.25 * (uv.x - 0.5) + 0.12 * sin(uv.x * 5.4 + u_pointer.x) + bend * 0.78;
    float d = uv.y - fold;
    float glow = band(point.x, 0.64) * 0.50 + 0.50;
    vec3 color = vec3(0.88, 0.90, 0.83);
    color = mix(color, vec3(0.58, 0.64, 0.43), band(d - 0.085, 0.14) * 0.54);
    color = mix(color, vec3(0.69, 0.66, 0.49), band(d - 0.29, 0.11) * 0.42);
    color = mix(color, vec3(0.99, 0.99, 0.94), band(d + 0.012, 0.097) * 0.89 * glow);
    color = mix(color, vec3(0.97, 0.96, 0.83), band(d - 0.22, 0.046) * 0.79 * glow);
    return mix(color, vec3(1.0, 1.0, 0.97), band(d + 0.035, 0.012) * 0.56 * glow);
  }

  vec3 prism(vec2 uv, vec2 point) {
    vec2 lens = vec2(point.x * 0.79 + point.y * 0.54, point.y * 1.24 - point.x * 0.20);
    float radius = length(lens);
    float split = 0.34 + 0.06 * u_influence;
    float arc = band(radius - split, 0.12);
    float light = arc * (0.52 + 0.48 * smoothstep(-0.28, 0.24, lens.x - 0.64 * lens.y));
    vec3 color = mix(vec3(0.91, 0.87, 0.84), vec3(0.84, 0.90, 0.91), smoothstep(0.0, 1.0, uv.x));
    vec3 spectrum = mix(vec3(0.66, 0.80, 0.91), vec3(0.92, 0.70, 0.71), smoothstep(-0.31, 0.22, lens.y));
    spectrum = mix(spectrum, vec3(0.99, 0.87, 0.63), smoothstep(0.0, 0.41, lens.x) * 0.79);
    color = mix(color, spectrum, light * 0.80);
    color = mix(color, vec3(0.98, 0.97, 0.94), band(radius - split + 0.071, 0.021) * 0.69);
    color = mix(color, vec3(0.75, 0.84, 0.88), band(radius - split - 0.13, 0.042) * 0.28);
    return mix(color, vec3(1.0, 0.99, 0.95), band(radius, 0.32) * 0.45);
  }

  vec3 contour(vec2 uv, vec2 point) {
    float radius = length(point);
    float angle = atan(point.y, point.x);
    float f = radius + 0.017 * sin(angle * 3.0 + radius * 5.0)
      + 0.022 * sin(angle * 5.0 - radius * 4.0);
    float contours = 1.0 - smoothstep(0.068, 0.17, abs(sin(f * 60.0)));
    float field = 1.0 - smoothstep(0.13, 0.91, radius);
    vec3 color = mix(vec3(0.84, 0.88, 0.83), vec3(0.94, 0.94, 0.88), uv.y);
    color = mix(color, vec3(0.62, 0.71, 0.60), field * 0.43);
    color = mix(color, vec3(0.32, 0.43, 0.34), contours * field * (0.36 + 0.14 * u_influence));
    return mix(color, vec3(0.98, 0.99, 0.92), band(radius, 0.18) * 0.72);
  }

  vec3 water(vec2 uv, vec2 point) {
    float radius = length(point);
    float ripple = sin(radius * 27.0 - 2.0) * band(radius, 0.63) * (0.22 + 0.36 * u_influence);
    vec2 flow = uv * vec2(u_aspect, 1.0);
    flow += vec2(sin(flow.y * 5.4), cos(flow.x * 3.4)) * 0.17;
    flow += ripple * 0.15;
    float fold = sin(flow.x * 13.0 + sin(flow.y * 9.0)) + cos(flow.y * 15.0 - flow.x * 4.7);
    float caustic = pow(1.0 - smoothstep(0.0, 0.48, abs(fold)), 2.0);
    float focus = band(radius - 0.14, 0.46);
    vec3 color = mix(vec3(0.76, 0.84, 0.80), vec3(0.93, 0.95, 0.87), smoothstep(0.0, 1.0, uv.y));
    color = mix(color, vec3(0.54, 0.70, 0.65), (0.5 + 0.5 * ripple) * focus * 0.44);
    return mix(color, vec3(0.99, 1.0, 0.94), caustic * (0.27 + 0.37 * focus));
  }

  void main() {
    vec2 center = mix(vec2(0.52, 0.47), u_pointer, 0.78 * u_influence);
    vec2 point = (v_uv - center) * vec2(u_aspect, 1.0);
    vec3 color;
    if (u_mode == 0) color = silk(v_uv, point);
    else if (u_mode == 1) color = prism(v_uv, point);
    else if (u_mode == 2) color = contour(v_uv, point);
    else color = water(v_uv, point);
    float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5;
    gl_FragColor = vec4(color + grain * 0.018, 1.0);
  }
`;

type Pointer = { x: number; y: number; influence: number };

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
}

export function createEffectRenderer(canvas: HTMLCanvasElement, mode: number) {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) return;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = vertex && fragment && gl.createProgram();
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
  }
  if (vertex) gl.deleteShader(vertex);
  if (fragment) gl.deleteShader(fragment);
  if (!program) return;

  const triangle = gl.getProgramParameter(program, gl.LINK_STATUS)
    ? gl.createBuffer()
    : null;
  if (!triangle) {
    gl.deleteProgram(program);
    return;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  const pointer = gl.getUniformLocation(program, "u_pointer");
  const influence = gl.getUniformLocation(program, "u_influence");
  const aspect = gl.getUniformLocation(program, "u_aspect");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform1i(gl.getUniformLocation(program, "u_mode"), mode);

  return {
    paint(point: Pointer) {
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;
      const scale = Math.min(1, Math.sqrt(700000 / (width * height)));
      const pixelWidth = Math.max(1, Math.round(width * scale));
      const pixelHeight = Math.max(1, Math.round(height * scale));
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

      gl.viewport(0, 0, pixelWidth, pixelHeight);
      gl.uniform2f(pointer, point.x, point.y);
      gl.uniform1f(influence, point.influence);
      gl.uniform1f(aspect, width / height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(triangle);
      gl.deleteProgram(program);
    },
  };
}
