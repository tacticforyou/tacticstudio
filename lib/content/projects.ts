import "server-only";

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { VFile } from "vfile";
import { matter } from "vfile-matter";
import { z } from "zod";

const projectsDirectory = join(process.cwd(), "content", "projects");
const projectSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Use lowercase letters and numbers separated by single hyphens.",
});
const requiredText = z.string().trim().min(1);

const projectFrontMatter = z.strictObject({
  title: requiredText,
  slug: projectSlug,
  description: requiredText,
  status: z.enum(["draft", "published"]),
  coverImage: z.strictObject({
    src: z
      .string()
      .regex(/^\/images\/projects\/[a-z0-9-]+\.(?:avif|jpe?g|png|webp)$/, {
        message: "Use a local raster image under /images/projects/.",
      }),
    alt: requiredText,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
});

export type Project = Omit<z.infer<typeof projectFrontMatter>, "status"> & {
  body: string;
};

function isMissingFile(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

async function readProject(filename: string): Promise<Project | null> {
  const path = join(projectsDirectory, filename);
  let source: string;

  try {
    source = await readFile(path, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }

  const file = new VFile({ path, value: source });
  try {
    matter(file, { strip: true });
  } catch (cause) {
    throw new Error(`Invalid YAML in content/projects/${filename}`, { cause });
  }

  const frontMatter = projectFrontMatter.safeParse(file.data.matter);
  if (!frontMatter.success) {
    throw new Error(
      `Invalid front matter in content/projects/${filename}\n${z.prettifyError(frontMatter.error)}`,
    );
  }

  const { status, ...project } = frontMatter.data;
  if (`${project.slug}.md` !== filename) {
    throw new Error(
      `The slug must match the filename in content/projects/${filename}`,
    );
  }

  return status === "published"
    ? { ...project, body: file.toString().trim() }
    : null;
}

export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");

  let entries;
  try {
    entries = await readdir(projectsDirectory, { withFileTypes: true });
  } catch (error) {
    if (isMissingFile(error)) return [];
    throw error;
  }

  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  const projects = await Promise.all(filenames.map(readProject));

  return projects.filter((project) => project !== null);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("max");

  if (!projectSlug.safeParse(slug).success) return null;
  return readProject(`${slug}.md`);
}
