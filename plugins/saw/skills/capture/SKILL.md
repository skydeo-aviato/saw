---
name: capture
description: Capture a raw idea into Linear Triage.
---

# Capture

**Done when a triager can act on the issue without coming back to you.**

This is self-intake: you are the requester, and the session's MCP files as you, so `createdBy`
already names the right human. A request from someone outside the team belongs in the Linear Asks
lane in Slack — send them there.

## 1. Resolve the product

**The registry is the Platform team's `Product` label group, read live.** List the Platform team's
labels and take the `Product` group — the group is team-scoped, not workspace-scoped, and it changes
without a plugin release, so never resolve against a memorised list.
Match what was said against the group; `../../references/linear.md` §2 carries the *called* aliases.

**Done when** you can name one label from the live group. If you cannot, ask which product is meant.
Never map to the nearest one: nothing validates a wrong product, and it mis-files the work.

## 2. Search before you file

Search Linear before writing anything, **workspace-wide** — a duplicate filed under another product is
still a duplicate. Match on the same *request*, not the same words: "CSV export times out" and "large
supplier files fail to download" are one issue.

| What you find | What to do |
| --- | --- |
| open, and the same thing | point at the existing issue instead of filing |
| open, and similar | show it and ask: skip, or file anyway? |
| `Done` | likely a regression rather than a duplicate — file it, link the old one, say so in the body |
| `Canceled` | we declined this before. Say when and why, and ask whether that has changed |
| nothing like it | carry on |

**Filing anyway costs one sentence: how is this different from the one we have?** Put that sentence in
the body and link the two issues as related. Without it the triager arrives at the question you just
asked, with less context than you had.

**Done when** you can say what you found, including "nothing like it". A search you did not run reads
the same as a search that found nothing.

## 3. Write the issue

| Field | Value |
| --- | --- |
| status | **`Triage`, explicitly** — never rely on the default |
| team | Platform, always |
| Product label | exactly one |
| body | the idea, in the capturer's own words |
| acceptance criteria | in the body — how we would know it works |

**Write the acceptance criteria yourself.** You are at peak context; the triager next week is not.

**Leave priority, the Act or Change label, and assignee empty.** The triager sets priority and the
Act or Change label at accept; assignee lands at pickup, and estimates do not exist on this team.
When the capturer calls it urgent, record **that they said so** in the body — evidence, not a field
value.

---

**Ask at most one question before filing.** Which surface, or how they will know it works — and only
when it is genuinely open. A thin issue beats an interrogation; the rest is settled at triage.

**Derived work goes elsewhere.** Decision tickets, implementation issues and anything belonging to an
existing map are already classified. `/shape` and `/slice` write those.
