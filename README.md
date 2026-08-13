# SAW — Skydeo Agentic Workflow

The Claude Code plugin `Platform` runs its work through, from a fuzzy idea to merged code.

**capture → shape → spec → slice → implement → ship**


## Install

```text
/plugin marketplace add skydeo-aviato/saw
/plugin install saw@skydeo
```

Needs read access to `skydeo-aviato/saw` and a local `gh auth login`. Without GitHub access, point the
marketplace at a teammate's checkout: `/plugin marketplace add /absolute/path/to/saw`.

## Lost? `/help`

`/help` is the router: describe your situation and it names the sanctioned command, then stops —
invoking it stays your act. It indexes every registered command, so it is the navigation backstop,
not a partial menu.

## The pipeline

### `/capture` — file your own idea

Files one of your own ideas — a thought, a bug you hit, work you see coming — into Linear `Triage`
as yourself, as an issue a triager can act on without coming back to you. Searches for duplicates
first: an open match is pointed at rather than duplicated, a `Done` match is probably a regression,
a `Canceled` one is a request already declined.

Self-intake only: a request from someone outside the team arrives as a Linear Ask in the product's
Slack ask-channel, not through this command.

### `/shape` — work out what the thing is

Starts on the accepted issue you own in the cycle: grill the destination first, then fan out the
fog. An issue with no fog — the whole journey fits one session — skips the machinery and just gets
built. When fog survives, shape cuts the fresh project with the settled destination and moves the
issue in (that move is **Promotion** — the issue never closes), then charts the **map** and works
its decision tickets one at a time. The project description is the map, its summary is the
destination, and each issue is a question whose answer is a decision.

Bare `/shape` picks the next ticket for you: it resumes anything you left `In Progress`, then accepts
research that came back, then takes from the frontier — ranked by how many other tickets each one
releases. When everything is blocked it names the blocker and who holds it. `/shape PLAT-42` takes a
specific one.

Three acts happen inside shaping:

| | |
| --- | --- |
| `/grill` | The default. Interviews you to a decision, then records the terms in `CONTEXT.md` and the decision in `docs/adr/`. |
| `/research` | Reads primary sources unattended and writes up the findings. Whoever fires it claims it, and accepts the findings at `In Review`. |
| `/prototype` | Builds something rough to react to, when the question is how something should look or behave. |

Shaping ends when nothing is left to decide.

### `/spec` — write it down

Synthesises everything the map decided into a spec, attached to the project as a Linear document. It
does not interview you — if it needs to ask something, the map was not finished.

### `/slice` — cut it into work

Turns the spec into implementation issues: vertical slices that each cut end-to-end and are verifiable
alone, each sized to one agent session. Anything bigger is split rather than estimated.

It reads a spec, so with no spec there is nothing to slice. That is the whole decomposition gate.

### `/implement` — build one

Creates the work item's worktree, sets the issue to `In Progress`, and builds. Uses `/tdd` at seams
you agreed beforehand.

### `/ship` — open the PR

Ticks the acceptance criteria first and stops if one cannot honestly be ticked. Opens the pull request
**ready, not draft**, carrying exactly one class label copied from the Linear issue. Then resolves
every review thread.

It sets no Linear state, requests no review, and does not merge — those are the Git automations', the
author's, and a human's respectively.

## A typical loop

```text
/capture   "CSV export times out on large supplier files"
/shape     # or /shape PLAT-42 — sizes the issue; fog → promote + chart, work one ticket
/spec      # at the handoff, once nothing is left to decide
/slice     # spec → implementation issues
/implement PLAT-47
/ship
```

Small work skips the middle: a bug with nothing to decide goes `capture` → cycle → `implement` →
`ship`.

## Worktrees

`/implement` puts each work item in its own git worktree — `plat-42-add-list-view` on branch
`PLAT-42-add-list-view`, cut from the default branch under `~/worktrees/<repo>`. Set
`SAW_WORKTREE_ROOT` to relocate that root.

Git-ignored config the tree needs to run (`.mise.toml`, `.env*`, `.claude/settings.local.json`, plus
anything listed in `.claude/rules/worktree.md`) is copied in on creation.

On session start, any worktree whose remote branch has been deleted — the squash-merge case — is
offered for cleanup. Never forced, never a dirty or unmerged tree, and a branch is only ever
safe-deleted: git cannot tell a squash-merge from abandoned work.

## Reference

Two files carry every rule, and the skills point at them rather than restating them:

| | |
| --- | --- |
| `plugins/saw/references/linear.md` | The Linear write contract. API facts, the Product registry, labels, priority, per-skill field tables, and when to stop and ask. |
| `plugins/saw/references/worktree.md` | The worktree lifecycle — creation, and the teardown the session-start hook drives. |

## Working on SAW itself

**Registration is placement.** `plugins/saw/skills/` is auto-discovered — there is no `skills`
array in the plugin manifest. A directory in `skills/` is a registered command. How the skill tree
is maintained lives in `AGENTS.md`.

**Never hand-edit a version.** Any change under `plugins/saw/**` carries a changeset instead:

```bash
pnpm changeset
```

`/implement` writes it; `/ship` refuses to open a pull request without one.
`pnpm run sync version --check` reports drift between the two version files without writing.

**Major means the surface changed**: an invocable command removed or renamed, or the installed
surface reshaped. Everything else is minor or patch.

**The bump is not the release.** A human cuts a release from `master`, and stopping after the first
step leaves the version untagged and invisible:

```bash
pnpm run version                            # bump both files, write the CHANGELOG
git commit -am "chore(release): <version>"  # the release commit
pnpm run release                            # tag v<version>, push it, cut the GitHub release
```

Done when the tag and the GitHub release both exist. `pnpm run release` has to follow the commit —
it reads the version out of the committed tree — and it refuses rather than guesses, so `--dry-run`
tells you what it would do.

**Tags are `v<version>`.** Release notes come from the matching `## <version>` section of
`CHANGELOG.md`. `changeset tag` is not used: it writes `@skydeo-aviato/saw@<version>`, an npm
convention that means nothing to a `private` package that never publishes.

One consequence to know rather than rediscover: Claude Code resolves version-constrained plugin
dependencies against `saw--v<version>` tags only. We publish `v<version>`, so nobody can pin a
dependency on `saw` by version range. Ordinary marketplace installs track the marketplace entry rather
than tags, and are unaffected.

`master` requires signed commits. History-rewriting commands silently drop signatures; check with
`git log --show-signature` before opening a pull request.
