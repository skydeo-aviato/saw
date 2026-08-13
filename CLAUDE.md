## Versioning

Changesets owns the version in `package.json` and `plugins/saw/.claude-plugin/plugin.json`. Never
hand-edit either.

Every change under `plugins/saw/**` carries a changeset — `pnpm changeset`, one line a reader outside
this session would understand. `/implement` writes it; `/ship` refuses a pull request without one.

**Major** means an invocable command removed or renamed, or the installed surface reshaped.
Everything else is minor or patch.

Claude Code keys the plugin cache on `plugin.json`, so a version landing only in `package.json` reaches
nobody. `pnpm run check-plugin-version` reports that **drift**.

**Cutting a release** — the tag format, the GitHub release, and why the bump alone ships nothing:
README, "Working on SAW itself".

## Vendored upstream

`pnpm run sync-vendor` regenerates the vendored upstream from `plugins/saw/vendor-manifest.json`
(upstream repo, pinned ref, whitelist) — the manifest is the only input, and the sync
delete-and-recreates everything it owns: `plugins/saw/vendor/` wholly, plus the inherited skill
directories in `plugins/saw/skills/` named by the manifest's `registered` list. Never hand-edit
any of those paths; edit the manifest and rerun the sync. Upgrade = edit `upstream.ref`, rerun,
review the diff. Un-kill = one-line whitelist edit, rerun.

**Registration is placement.** `plugins/saw/skills/` is auto-discovered — every directory there
is a registered command, and the directory listing is the registry; `plugins/saw/vendor/` is
never scanned, its bodies reached only by path from overlays. There is no `skills` array in the
plugin manifest.

### Domain docs

Single-context — one `CONTEXT.md` (the glossary) and one `docs/adr/` (the decisions) at the root.
Read both before exploring: the glossary's terms are the vocabulary for anything you write (issue
titles, hypotheses, test names — never the synonyms it avoids), and ADRs touching your area bind.
Output that contradicts an ADR surfaces the conflict explicitly rather than silently overriding.
