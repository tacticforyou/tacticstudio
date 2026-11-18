<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Checks

- Use npm and keep `package-lock.json` in sync. Run `npm run lint`, `npm run typecheck`, and `npm run format:check` before handoff.
- Review and resolve Prettier warnings as you edit. Run Prettier with `--write` on the affected files and review the result. `prettier-plugin-tailwindcss` sorts classes against `app/globals.css`.

## Tailwind CSS v4

- Prefer built-in utilities for layout and styling. Add shared design tokens via `@theme` in `app/globals.css`, and set shared element defaults in `@layer base`. Use `@theme inline` for tokens that refer to another CSS variable.
- Extract a component when markup or behavior repeats. Use complete utility class names so Tailwind can detect them.
- [Theme variables](https://tailwindcss.com/docs/theme) · [Custom styles and layers](https://tailwindcss.com/docs/adding-custom-styles) · [Source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)

## Next.js

- Default to Server Components. Put `"use client"` at the smallest component that needs browser APIs, event handlers, or client state.
- With Cache Components enabled, use `"use cache"` and an explicit `cacheLife` for shareable data reads. Put request-time reads and dynamic params inside a meaningful Suspense boundary. Keep request-specific data out of shared caches. Markdown ships with the app, so publish changes with a fresh deployment and restart the dev server if an edit is cached.
- When a CMS adds runtime mutations, tag cached reads by collection and slug. Use `revalidateTag(tag, "max")` for stale-while-revalidate updates. For immediate expiry after an unpublish, invalidate both the item and list tags with `updateTag` in a Server Action or `revalidateTag(tag, { expire: 0 })` in a Route Handler.
- Use `next/image` with meaningful alt text, intrinsic dimensions, and responsive `sizes`. Use empty alt text for decorative images. When a typeface is selected, use `next/font/local` or `next/font/google` in the root layout and expose the font variable to Tailwind via `@theme inline`.
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [Caching](https://nextjs.org/docs/app/getting-started/caching) · [Revalidation](https://nextjs.org/docs/app/getting-started/revalidating) · [Image](https://nextjs.org/docs/app/api-reference/components/image) · [Font](https://nextjs.org/docs/app/api-reference/components/font)

## Content

- Put projects in `content/projects/<slug>.md`. Use YAML front matter with `title`, `slug`, `description`, `status`, and `coverImage` (`src`, `alt`, `width`, and `height`). Slugs are lowercase, hyphen-separated, and match the filename. Store cover images under `public/images/projects/`. Use plain Markdown and start body headings at level 2.
- Fetch content through `lib/content/projects.ts`. Both the list and slug lookup expose published projects only. Keep `/projects/<slug>` stable.
- For Payload in the same Next.js app, map the fields to a `projects` collection with a unique slug and a relationship to a Media upload for the cover. Map publication status to Payload drafts and normalize media and body fields in the server-only adapter. Keep the page-facing content interface and URLs when changing storage. Check Next.js compatibility before adding Payload, its admin routes, or PostgreSQL. [Payload installation](https://payloadcms.com/docs/getting-started/installation)

## SEO and accessibility

- Use a descriptive per-page title and description with the Metadata API. Use `SITE_URL` for canonical URLs and Open Graph URLs. Give shareable pages suitable social images and alt text. The project cover supplies the project share image. Add branded site imagery and icons when assets are approved.
- Keep robots and the sitemap consistent. Set `SITE_URL` to the canonical production origin at build time. Leave it unset on previews for `noindex` and an empty sitemap. Allow crawlers to read the `noindex` directive through `robots.txt`. Exclude drafts from public routes, lists, sitemaps, social metadata, and feeds.
- Add RSS once there are published articles. Serve only published articles with stable absolute URLs and dates, and link the feed via metadata. Add JSON-LD when a schema type accurately describes visible published content.
- Use semantic landmarks and headings, keyboard-accessible controls, visible focus, and descriptive link text. Verify these alongside the rendered metadata.
- [Metadata and social images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) · [Robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) · [Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) · [JSON-LD](https://nextjs.org/docs/app/guides/json-ld) · [Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

## Graphify

- Start codebase questions with `graphify query "<question>"` when `graphify-out/graph.json` exists. Verify implementation details in the referenced source files.
- Run `graphify update .` to create or refresh the local index, report, and interactive graph. The update covers code and Markdown structure.
