---
name: ship
description: File a concise pull request. Use when the user asks to ship, file, open, or create a pull request.
---

# File a Pull Request

Before filling, check whether a PR for this issue already exists. Review the diff locally against `origin/master` to make sure its contents match the goal.

PR titles usually become commit messages, so follow the repository's title conventions. Look at recently merged PRs and Git history for examples. Prefer a concise, human-readable title that explains why the change matters:

BAD:
> perf(server): Negotiate peemessage-deflate on the websocket

GOOD:
> perf(server): Cut websocket frame size by 70%+ with gzipping

Open the description with a simple explanation of the problem based on the user's original prompt, then briefly explain the solution. Do not lead with an implementation inventory.

BAD:
> Removed implicit workspace
carry-over from every "new thread" entry point (cmd
cmd+shift+o, sidebar v1/v2 buttons, command palette). New threads inherit only the project from context; branch, worktree, and env mode always come from the configured defaults. Deleted buildContextualThreadOptions,
startNewThreadInProjectFromContext, and the v1 sidebar's seed-context machinery.

GOOD:
> My "new worktree" default was ignored when starting new threads on existing
worktrees. Super unintuitive. Now your preferences always apply.

Open real PRs instead of draft ones so the review bots run. If the user also asks to babysit it , continue with the `babysit` skill.

Make sure PRs have all required metadata filled out
