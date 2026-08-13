# Worktree lifecycle

One worktree per work item. `/implement` runs **Creation** at entry; the `SessionStart` hook triggers **Teardown**. Naming is fixed convention; the only per-user knob is the location.

## Derived values

- `key` — the work item's Linear key, **read from the issue**. 
- Fetch the work item from the tracker by `key`; read its title.
- `desc` — the title, lowercased, every run of non-alphanumerics → `-`, trimmed.
- `repo` — `basename "$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"` (worktree-stable).
- `root` — `${SAW_WORKTREE_ROOT:-$HOME/worktrees}`.
- `base` — default branch: `git symbolic-ref --quiet --short refs/remotes/origin/HEAD | sed 's#^origin/##'`, else `master`.
- `branch` = `<key>-<desc>` · `dir` = `<key lowercased>-<desc>` · `path` = `$root/$repo/$dir`.

Example: branch `PLAT-42-add-list-view`, tree at `~/worktrees/curate/plat-42-add-list-view`.

**The key lives in the branch and nowhere else.** It is what makes the pull request link itself to the
issue when one is opened.

## Creation (agent-run, idempotent)

Run before any implementation. Never `--force`; never clobber. A dirty main tree is fine.

1. **Already here** — current toplevel (`git rev-parse --show-toplevel`) equals `$path`: no-op, proceed.
2. **Registered elsewhere** — `$path` is in `git worktree list --porcelain`: print `/cd $path` and stop (switch, re-invoke).
3. **Path occupied, not a worktree** — `$path` exists on disk but isn't registered: halt, ask.
4. **Branch exists, no tree** — `git show-ref --verify --quiet "refs/heads/$branch"`: attach with `git worktree add "$path" "$branch"` (no `-b`).
5. **Fresh** — `git worktree add -b "$branch" "$path" "$base"`.
6. **Not a git repo / no base branch** — halt with a clear message.

Then seed git-ignored files (worktrees don't inherit them) into a newly-created tree only:

- Fallback allowlist, copy each if present at repo root: `.mise.toml`, `.env*`, `.claude/settings.local.json`.
- Plus any paths listed under `.claude/rules/worktree.md` (read it only now, if it exists).
- Recreate parent dirs; copy silently — never print contents (secrets).

Report the resulting `$path` and whether it was created / attached / already existed. If the session cwd isn't inside it, print the `/cd $path` line.

## Teardown (SessionStart hook → agent-driven)

`hooks/worktree-reap.sh` runs on session start (it prunes stale remote-tracking refs and contacts the network, but never removes a worktree or branch). When it prints a reapable block:

1. Present an `AskUserQuestion` multi-select — one option per listed worktree, labelled `<dir> — <status>` and carrying the worktree's **absolute path** (`@ <path>`, from the scan line) in the option description. Never offer a tree to delete by name alone — the path is what the user needs to see before confirming a removal.
2. For each selected worktree:
   - `git worktree remove "<path>"` — never `--force`, so a dirty tree fails instead of being clobbered.
   - `git branch -d "<branch>"` — the *safe* delete. It refuses any branch that isn't an ancestor of the base, which includes every squash-merge; if it refuses, keep the branch and say so. **Never `git branch -D` automatically** — git can't tell a squash-merge from an abandoned branch, so a force-delete could destroy unmerged work. Force-delete only a specific branch the user explicitly confirms was merged.
3. Never offer the main checkout. A selected tree tagged `(current …)` can't be removed from within — print `/cd <main>` and stop; the user re-runs teardown from main.
4. `git worktree prune` after removals to clear stale entries.

**Reapable** = upstream `[gone]` after prune AND the tree is clean: the branch was pushed and its remote branch no longer exists — normally a squash-merge with auto-delete-head, occasionally a closed/abandoned PR. Git alone can't distinguish the two, so the **tree** is removable but the **branch** is only ever safe-deleted (`-d`). Everything else — dirty, ahead/unpushed, never-pushed, detached, prunable — is surfaced for awareness only, never offered. Ancestry-to-base is deliberately *not* a signal: squash-merges are never ancestors of the base, and it would false-positive on freshly-created, un-started branches.
