---
name: babysit
description: Babysit a filed pull request. Use when the user says "babysit this PR", "tend this PR", "address the review comments", or "get this PR to 5/5".
argument-hint: "<PR link or ID>"
---

# Babysit

Ours — no upstream body, and **the contract is this body**. One invocation loops to a terminal
state: read the verdict, attend every thread, fix CI, push, re-summon the reviewer, wait, read the
new verdict. The PR link or ID is the required argument; without one, stop and ask — never guess
which PR is meant.

Approval belongs to reviewers. Merge runs only on the user's explicit in-session confirmation.

**Every comment you post** — thread replies, 👎 explanations, `@greptileai` triggers — opens with
the attribution banner:

```md
[MODEL_SLUG] RESPONDING ON BEHALF OF [USER]
-----

[actual reply]
```

`[USER]` is the git user (`git config user.name`); `[MODEL_SLUG]` is the model running this
session.

## 1. Read the ledger

The PR is the ledger — no local state. Count the banner-carrying `@greptileai` trigger comments
already in the PR timeline: that is the iterations spent, across every invocation and machine.
A human's own manual summon carries no banner and spends nothing. **Hard limit: 5 per PR** —
the gate sits at step 5, before a summon, so a verdict already earned is always read.

## 2. Read the verdict

Greptile posts a 0–5 confidence score in its summary and **edits it in place** on re-review — take
the freshest `greptile-apps[bot]` artifact by `updated_at`, never `created_at`. Three places it can
live:

```sh
gh pr view N --json body                                                  # if shouldUpdateDescription is set
gh api --paginate "repos/{owner}/{repo}/issues/N/comments?per_page=100"
gh api "repos/{owner}/{repo}/pulls/N/reviews"
```

Filter author `greptile-apps[bot]`, parse the pattern `X/5` (or `Confidence: X/5`). **No score
parses → stop and tell the user** — the repo's `greptile.json` can disable the score section, and
the loop never runs blind on a missing verdict.

Score 5/5, every live thread settled, CI green → Clean.

## 3. Attend every thread

List threads by GraphQL — REST cannot see resolution:

```sh
gh api graphql -f query='{ repository(owner:"O", name:"R") { pullRequest(number:N) {
  reviewThreads(first:100) { nodes { id isResolved isOutdated
    comments(first:50) { nodes { databaseId body path author { login } } } } } } }'
```

Work **every unresolved, non-outdated thread, whatever its age** — GitHub's `isOutdated` flag
decides staleness, never a timestamp. Skip outdated threads quietly. For each live thread,
**verify the finding against the actual source before touching code** — open the file, confirm the
claim holds. Then:

- **Real finding** → fix it, inside the PR's original goal. Feedback that would grow the PR past
  that goal gets a reasoned banner-ed reply declining it, no code. Once the fix is pushed: a
  Greptile thread gets a banner-ed reply naming the fix, then resolved for hygiene; a human thread
  gets the same reply and stays open for its author.
- **Greptile false positive** → the documented training signal, both halves — 👎 reaction plus a
  banner-ed in-thread reply saying *why* it is false, concise and specific:

  ```sh
  gh api -X POST "repos/{owner}/{repo}/pulls/comments/{id}/reactions" -f content='-1'   # inline comment
  gh api -X POST "repos/{owner}/{repo}/issues/comments/{id}/reactions" -f content='-1'  # summary comment
  gh api -X POST "repos/{owner}/{repo}/pulls/N/comments/{id}/replies" -f body='...'     # reply, inline threads
  gh pr comment N --body '...'                                                          # reply to the summary
  ```

  Then resolve the thread for hygiene — the reaction carries the signal, resolution trains
  nothing:

  ```sh
  gh api graphql -f query='mutation { resolveReviewThread(input: {threadId: "ID"}) { thread { isResolved } } }'
  ```

- **Human thread** → banner-ed reply; reasoned pushback is welcome; **the human resolves their own
  thread** — leave resolution to them, always.

## 4. Fix CI

Latest commit only — results from superseded commits are dead. A red check is iteration work when
the repo is at fault. An infra flake is not: report the flake to the user and move on — no rerun,
no code change chasing it.

## 5. Push and re-summon

Changes made → commit and push. **The cap gates here**: 5 iterations already spent → Exhausted, no
summon. Otherwise — Greptile does not re-review on push (`triggerOnUpdates` defaults off) — summon
it, guarded against double-triggering:

```sh
gh pr checks N --json name,state | jq '.[] | select(.name | test("greptile"; "i")) | .state'
# only when nothing is pending or in progress:
gh pr comment N --body "<banner>

@greptileai review"
```

Each summon spends one of the 5. Nothing changed this iteration — no fix, no reply owed → post
nothing (the timeline stays legible); that is Nothing-actionable, done.

## 6. Wait for the new verdict

Poll every 10s, give up at 10 minutes. Done means either:

- the Greptile check-run on the head SHA reaches `completed` (exists only when the repo enables
  `statusCheck`), or
- the `greptile-apps[bot]` summary's `updated_at` is newer than your trigger.

```sh
gh api "repos/{owner}/{repo}/commits/$HEAD_SHA/check-runs" \
  --jq '.check_runs[] | select(.name | test("greptile"; "i")) | .status'
```

Verdict arrives → back to step 1. Timeout → the iteration fails: stop and report to the user —
stale or missing results drive nothing.

## Terminal states

- **Clean** — 5/5, every unresolved non-outdated thread settled, CI green. Report to the user and
  ask whether to merge; run the merge only on their explicit yes, in this session. Approval is
  never yours to give.
- **Exhausted** — 5 iterations spent and the verdict still short of Clean. Stop and report status
  to the user directly — the report is a message, never a PR comment.
- **Nothing actionable** — the verdict is short of 5/5 yet no live thread, no red check, and no
  change to make. Stop and report to the user: nothing is left for the agent to do.
