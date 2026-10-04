# Eidolon

Eidolon is a template for workflow builder editors. It is a Next.js app with an enterprise canvas, reusable Radix and Tailwind components, and sample workflows. The editor places generic steps — triggers, actions, conditions, delays, webhooks, and endings — on a graph.

## Requirements

- Node.js 20 or newer
- [pnpm](https://pnpm.io/) 10

## Run the app

From this folder:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The library lists three sample workflows. Open one to edit the tree, or choose **New workflow** to start from a trigger. Changes stay in memory until you refresh the page.

## Develop

| Task                                 | Command                 |
| ------------------------------------ | ----------------------- |
| Dev server                           | `pnpm dev`              |
| Unit tests                           | `pnpm test`             |
| Tests in watch mode                  | `pnpm test:watch`       |
| Format, lint, and typecheck together | `pnpm check`            |
| Format files                         | `pnpm format`           |
| Lint                                 | `pnpm lint`             |
| Typecheck                            | `pnpm typecheck`        |
| Production build                     | `pnpm build`            |
| Conventional commit prompt           | `pnpm commit`           |
| Record a version note                | `pnpm changeset`        |
| Apply version notes                  | `pnpm version-packages` |

`pnpm check` runs Prettier, ESLint, and `tsc` at the same time.

### Editor

- Click a step to edit its settings on the canvas and in the side panel. Steps can include text, menus, option lists, checkboxes, and condition rules shown with operator symbols.
- The palette groups steps into events and actions. Click an action to add it under the selection, or drag it until a dotted space shows where it can land.
- End steps close a path and do not accept children.
- The trigger stays at the root.
- **Save revision** stores a new revision in the mock library. **Revisions** can restore an older snapshot into the draft.
- **Discard** reloads the last saved copy. Leaving with unsaved edits asks for confirmation.

### Project layout

Components follow atomic design:

```
src/components/atoms       Buttons, fields, logo, badge
src/components/molecules   Step cards, palette items, workflow cards
src/components/organisms   Canvas, inspector, palette, dialogs
src/components/templates   Library and editor screens
src/lib                    Graph edits, reducer, mock API
src/hooks                  TanStack Query and the editor session
```

Workflow reads and writes go through TanStack Query. The query functions in `src/lib/api/workflows.ts` resolve sample data instead of a server.

### Quality gates

- Husky runs lint-staged on commit and Commitlint on the message.
- Commitizen (`pnpm commit`) writes [Conventional Commits](https://www.conventionalcommits.org/).
- Changesets track releases. The header shows the version from `package.json`. Each workflow also has its own revision list in the editor.

### Agent skills

Official Next.js skills from Vercel are installed for Cursor under `.agents/skills`:

- `next-dev-loop`
- `next-cache-components-adoption`
- `next-partial-prefetching-adoption`

`AGENTS.md` points agents at the Next.js docs that ship with this version.
