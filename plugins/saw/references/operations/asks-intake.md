# Asks intake — the external lane's Linear-side configuration

The record of how the Linear Asks lane is configured, so it can be rebuilt or audited without
archaeology. The lane itself: a Skydeo teammate outside Platform mentions `@Linear Asks` in the
product's ask-channel (today `proj-curate` only), and the request lands in PLAT `Triage` as
`No priority`, with the requester as the real `createdBy` and thread sync mirroring progress
back. What receives it is the triage model:
Triage Intelligence auto-applies the Product label (below); the acts that empty the queue are
the triager's — accept/decline, priority at accept (`CONTEXT.md`, Priority) — and the commitment
charter's candidate pool takes only accepted work.

## The admin configuration

1. The PLAT team is the destination for the Slack integration's public-channels bucket
   (Business tier: all public channels share one Asks config; channel-per-product is a social
   convention, free with one team connected).
2. The default Ask template is the form below — acceptance criteria required.
3. `@Linear Asks` mention is the gesture — the only one. Emoji triggers stay disabled: an
   emoji trigger fires the default template blind, and the glyph itself renders unreliably
   across platforms — a gesture people can't recognize can't be taught.
4. `proj-curate` is the only connected ask-channel; the pattern repeats per product if another
   is ever exposed.
5. No per-channel label or team override — the Product label is applied by Triage
   Intelligence and confirmed at accept (per-channel config is Enterprise-only anyway).

## Triage Intelligence

Team settings → Triage: labels auto-apply, filtered to the `Product` group — everything else
suggest-only. Custom guidance, extended reactively one sentence per wrong suggestion theme that
persists:

```
Labels: apply exactly one label from the Product group; when no product is clear,
apply none and leave it to the triager.
```

## The Ask template — "Platform Ask"

Description: *Report a bug or request work from the Platform team. The more specific your
answers, the faster triage moves.*

The form speaks capability, never tooling — no internal system names in requester-facing
copy. Error monitoring captures repro and environment, so the form asks only for what a human
uniquely knows: context, expectation, impact.

| # | Type | Name | Required | Description |
| --- | --- | --- | --- | --- |
| 1 | instructions | Before you start | — | You'll get updates in this Slack thread as the work moves — no chasing. If something broke, don't worry about technical detail — our monitoring already captures it. Just tell us what you were doing when it happened. |
| 2 | issue title | Summary | yes | One line: what's broken or what you need. |
| 3 | dropdown | Type of request | yes | Bug — something is broken / Feature or improvement / Question or support |
| 4 | long text | What's going on? | yes | Bug: what you were doing and what you saw — plain words, no technical detail needed. Request: how you handle this today and where it hurts. |
| 5 | long text | What should happen instead? | yes | The outcome you expect — what you'd check to confirm it's fixed or working. |
| 6 | long text | Impact — who's affected? | no | How many people, how often, is there a workaround, what's blocked. This is what we prioritize on. |
| 7 | due date | Hard deadline, if any | no | Only if a real date exists. |
| 8 | uploadfile | Screenshots or files | no | Anything that shows the problem — a screenshot of what you saw is plenty. |

Field 5 is the required acceptance-criteria value the lane depends on. Deliberately absent:
a priority field (no machine and no requester writes priority — the triager sets it at
accept), a label-group field (the Product label is machine-applied and confirmed at accept),
and environment/repro-steps fields (monitoring's job — never ask a human for what a machine
already recorded).
