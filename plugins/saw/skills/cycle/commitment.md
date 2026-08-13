# Commitment charter

The commitment ritual, defined once, for every reader — the human performing it and the two
drafting surfaces working for them: `/saw:cycle` from a Claude Code session, and the Claude Tag
routine from the alarm. Both draft to this charter's contract. `/saw:cycle` reads it live and
inlines nothing; the routine's host cannot read this repo, so the **pasted routine carries the
contract as a declared cache** — its prompt text is derived from this charter at install time
(a paste-once file, kept outside the repo), and an edit to the contract here means re-derive
and re-paste. Doctrine cannot drift silently, and the ritual stays valid with every agent down.

This document lives beside `/saw:cycle`, its session drafting surface, so doctrine travels
wherever the skill installs. Vocabulary: `CONTEXT.md` (Commitment section). Priority semantics:
`../../references/linear.md` §4.

## The ritual

One judgement moment per cycle boundary, ~30 minutes. Fired by an alarm, never by memory — the
draft is already waiting when the human arrives. Five steps, in order:

| # | Step | Who drafts | Who decides |
| --- | --- | --- | --- |
| 1 | Rollover audit | agent | human — vetoes item by item |
| 2 | Candidate pool | agent, mechanical | nobody — the Priority model applied as written |
| 3 | Capacity check | Linear renders it | nobody estimates |
| 4 | Selection + cycle goal + owners | **nobody — no agent touches it** | human, alone |
| 5 | Commitment note | agent | human — signs and posts |

### 1. Rollover audit

The agent drafts the list (contract, item 1); the human vetoes item by item. Nothing survives a
boundary without a fresh human yes.

### 2. Candidate pool

Mechanical: open issues **accepted out of Triage** and eligible under the Priority model
(`../../references/linear.md` §4). The triager's accept is what admits work to this pool — whatever labels or
priority the machine applied while an issue sat in `Triage`, it stays out until that accept. The
agent assembles (contract, item 2); there is nothing to decide. This step costs the human
reading, not archaeology.

### 3. Capacity check

Linear's 3-cycle velocity rendering, read as-is. Nobody estimates, and nobody argues about the
number — it is an instrument, not a judgement. Estimates are disabled team-wide (agents do the
work; nobody prices human effort), so velocity renders as issue count per cycle — which makes
ticket sizing discipline, not estimation, what keeps the number meaningful.

### 4. Selection + cycle goal + owners

**Irreducibly human; no agent touches it.** The human drags issues into the cycle — the drag *is*
the selection — writes the one-sentence cycle goal onto the Linear cycle, and names owners. The
draft arrives with no suggested selection and no proposed goal, so the commitment is a human act
and stays one.

### 5. Commitment note

The agent drafts from the skeleton (contract below); the human edits, signs, and posts it to the
team Slack channel. Posting is the human's act, like every shared-record write.

## The alarm

One Claude Tag routine in Seif's Slack DM with Claude — the **only** alarm rail; a second rail
(a recurring "Plan cycle N" issue) can only disagree with the first. Schedule: `every 2 weeks on
Friday at 9:00, starting Friday 2026-08-28` — the Friday before each boundary Monday (Platform
cycles run two weeks, no cooldown, from Monday 2026-08-17), with a **4-day** boundary window in
the prompt so the draft lands three days fresh and still covers a fire that slips a day.
Late-firing is forbidden by policy: a boundary ritual two days late is worse than absent — and
failure is self-revealing, because the human arrives at the boundary regardless and a missing
draft costs minutes. If the cadence is reconfigured in Linear, re-derive the schedule and
re-paste the routine.

## The circuit breaker

Work that overruns its cycle re-enters selection and must win its slot again — it is never
auto-extended. Linear's automatic rollover would otherwise re-commit stale work silently, forever;
the audit (step 1) is where each overrun faces its fresh yes.

## The break-in rule

Mid-cycle entry stays the Priority table's (`CONTEXT.md`, Priority entry): `Urgent` enters through
the owner-held gate; `High` derived work enters ungated. The rule lives in that table alone — the
ritual audits its consequences at the next boundary (step 1 lists every break-in and what it
displaced), and never restates it.

## The two end artifacts

| Artifact | Job |
| --- | --- |
| the planned cycle in Linear, goal sentence on the cycle | the **product** |
| the commitment note, posted by the human to the team Slack channel | the **record** |

Two artifacts, two jobs, no sync. The cycle is what the team works from; the note is what a future
reader finds.

## The draft content contract

Both drafting surfaces produce the same draft: **one artifact, four sections, in ritual order.**

1. **Rollover audit** — every issue in the closing cycle not `Done`: title, owner, why it did not
   land, and a veto checkbox. Every break-in that entered mid-cycle: what it was, its Priority
   justification, and what it displaced.
2. **Candidate pool** — open issues accepted out of `Triage`, in no cycle, carrying a priority;
   grouped by priority, each with title, product, owner-if-any, and staleness.
3. **Capacity** — Linear's 3-cycle velocity figure, stated, with the closing cycle's actual beside
   it. No derived recommendation.
4. **Commitment note skeleton** — goal: *blank, the human's*; committed: *filled at selection*;
   broke in / rolled / killed: *pre-filled from the audit*.

The draft never selects, never ranks beyond the Priority grouping, and never proposes a goal.
Drafting reads Linear and writes nothing to shared records — the human moves the issues, and the
agent writes no issue field.
