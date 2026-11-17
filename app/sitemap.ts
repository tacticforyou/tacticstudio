import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content/projects";
import { projectPath, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteUrl) return [];

  const projects = await getPublishedProjects();
  return [
    { url: siteUrl.origin },
    ...projects.map(({ slug }) => ({
      url: new URL(projectPath(slug), siteUrl).href,
    })),
  ];
}
