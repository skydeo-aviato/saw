# SAW does not manage git worktrees

SAW used to put every work item in its own git worktree: `/implement` created one at entry, a
`SessionStart` hook scanned for reapable trees at startup, and a reference file carried the naming
convention, the git-ignored-file seeding, and the teardown rules. All of it is removed — the
reference, the hook, and the step.

Worktree management is a preference about how one developer arranges one machine, not something a
skills plugin should decide for everybody who installs it. It also carried real cost: a
`SessionStart` hook ran git commands and touched the network on every single session start,
whatever the session was for, and the seeding step copied `.env*` files between trees. Anyone who
wants worktrees has git, and their own habits for it.

## Consequences

`/saw:implement` now builds in the current checkout, which is what a delegated one-shot session
gives it anyway. Nothing in the plugin registers hooks, so `plugins/saw/hooks/` is gone entirely.
`SAW_WORKTREE_ROOT` no longer does anything.
