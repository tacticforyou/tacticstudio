import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Markdown from "react-markdown";
import { getProjectBySlug } from "@/lib/content/projects";
import { imageQuality } from "@/lib/image-quality";
import { projectPath, siteName, siteUrl } from "@/lib/site";

type ProjectPageProps = Pick<PageProps<"/projects/[slug]">, "params">;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { title, description, coverImage } = project;
  const path = projectPath(project.slug);
  const { src, alt, width, height } = coverImage;
  const image = { url: src, alt, width, height };

  return {
    title,
    description,
    alternates: siteUrl ? { canonical: path } : undefined,
    openGraph: siteUrl
      ? {
          type: "website",
          siteName,
          title,
          description,
          url: path,
          images: [image],
        }
      : undefined,
    twitter: siteUrl
      ? { card: "summary_large_image", title, description, images: [image] }
      : undefined,
  };
}

async function ProjectDetails({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{project.description}</p>
      </header>
      <Image
        {...project.coverImage}
        className="h-auto w-full rounded-lg"
        loading="eager"
        sizes="(max-width: 768px) calc(100vw - 3rem), 720px"
        quality={imageQuality}
      />
      <div className="markdown mt-8 max-w-prose">
        <Markdown skipHtml>{project.body}</Markdown>
      </div>
    </article>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <main lang="en" className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Link
        className="mb-8 inline-block text-accent underline underline-offset-4"
        href="/"
      >
        All projects
      </Link>
      <Suspense fallback={<output className="block">Loading project…</output>}>
        <ProjectDetails params={params} />
      </Suspense>
    </main>
  );
}
