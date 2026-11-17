# Tactic Studio

Start the Next.js development server with npm.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000) for the landing page or visit [the sample project](http://localhost:3000/projects/sample-project) to see the Markdown-backed route. [The sample file](content/projects/sample-project.md) shows the front matter and body format. Entries with `status: draft` stay out of public pages and the sitemap.

Before building for production, replace the sample content and set `SITE_URL` to the canonical origin, with no path, query, or fragment. Without it, the app requests no indexing and publishes an empty sitemap.

```bash
npm run lint
npm run typecheck
npm run format:check
```

See [AGENTS.md](AGENTS.md) for project conventions and the planned Payload field mapping.
