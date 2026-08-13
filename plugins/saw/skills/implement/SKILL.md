---
name: implement
description: Build one work item against its spec, in its own worktree.
disable-model-invocation: true
---

1. Create the work item's worktree per `../../references/worktree.md`, and work inside it.
2. Follow `../../vendor/mattpocock/skills/engineering/implement/SKILL.md`.
3. Write the changeset if the work touched `plugins/saw/**` — `pnpm changeset`, one line a reader
   outside this session would understand. **Never hand-edit a version.**
4. `/ship` when it is done.

Issue status is yours to set at start — `../../references/linear.md` §6.4.
