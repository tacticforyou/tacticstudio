import "server-only";

export const siteName = "Tactic Studio";
export const siteDescription = "Projects from Tactic Studio.";

function readSiteUrl(value: string | undefined) {
  if (!value) return undefined;

  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "SITE_URL must be an HTTP or HTTPS origin, such as https://example.com.",
    );
  }

  return url;
}

export const siteUrl = readSiteUrl(process.env.SITE_URL);

export function projectPath(slug: string) {
  return `/projects/${slug}`;
}
