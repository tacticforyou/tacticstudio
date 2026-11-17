# Tactic Studio TODO

## Content and launch

- [ ] Move the landing page's editorial content (services, FAQs, testimonials, and featured projects) to validated Markdown under `content/`. Read it through a server-only adapter that can later use Payload without changing public project URLs.
- [ ] Add a branded Open Graph image and descriptive alt text to the home page. Verify the image is available at an absolute public URL and appears in link previews.
- [ ] Replace or remove the published `sample-project` entry before enabling production indexing. Verify that the public sitemap lists only real, published content.
- [ ] Verify production canonical URLs, robots directives, and sitemap on the deployed domain. Check that `SITE_URL` points to the canonical origin and that previews retain `noindex`.

## When content is ready

- [ ] Add an RSS feed when real articles are published. Link it from page metadata and keep drafts out of the feed.
- [ ] Add JSON-LD when a schema type accurately describes the visible, published content.
