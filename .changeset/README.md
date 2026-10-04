# Versions

Eidolon uses [Changesets](https://github.com/changesets/changesets) on top of the `version` field in `package.json`.

1. `pnpm changeset` records a patch, minor, or major note.
2. `pnpm version-packages` applies those notes and bumps `package.json`.

The header shows the package version. Each workflow also keeps its own revision history inside the editor.
