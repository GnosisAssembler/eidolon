<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Eidolon

Eidolon is a generic workflow editor template. Keep product copy about editing workflows. Do not add branding or domain language from other products.

- UI components live under `src/components` in atomic folders: `atoms`, `molecules`, `organisms`, `templates`.
- Workflow edits go through `src/lib/graph.ts` and `src/lib/editor-reducer.ts`. Sample data is behind TanStack Query in `src/lib/api/workflows.ts`.
- Run `pnpm check` to format-check, lint, and typecheck together. Run `pnpm test` for unit tests.
- Next.js workflow skills are installed in `.agents/skills`. Use `$next-dev-loop` to verify runtime behavior against a running `next dev`.
