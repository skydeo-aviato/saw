---
name: ship
description: Open a pull request for finished work and resolve every review thread on it.
disable-model-invocation: true
---

# Ship

Ours — there is no upstream body, and **the contract is this body**. The tracker doc adds only the
stop-and-ask rules that bind it: `../../references/linear.md` §7.

## 1. Tick the acceptance criteria

Go through the boxes on the Linear issue and tick what is genuinely done. **If one cannot honestly be
ticked, stop and name it.**

This is the whole spec check. The only other one is the author verifying in production, and merge
deploys to production.

## 2. Check the changeset

If the work touched `plugins/saw/**`, there must be a changeset in `.changeset/`. **No changeset, stop
and say so** — `pnpm changeset` writes one.

**Never hand-edit a version.** `package.json` and `plugin.json` are both changesets'; a human cuts the
release from `master` with `pnpm run version`. `pnpm run sync version --check` reports drift.

## 3. Open it

**Ready for review**, so the automation reads it as reviewable — a draft moves the issue back to
`In Progress`.

**One GitHub label: the Change class, read from the Linear issue.** The issue already carries exactly
one of `feat` / `fix` / `refactor` / `chore`; copy it. Area labels stay free and human.

Title and body are plain descriptions. The branch already carries the key.

## 4. Resolve the threads

Reply on every open review thread with proper feedback (+1, -1), whoever left it.

## Where this stops

**Linear state belongs to the Git automations**, review is **the author's call** to request, and
**merging is the human's act**. Leave all three alone.

Nothing enforces that last one — no ruleset, no required approval. It is a contract, which is why it
is written down rather than assumed.
