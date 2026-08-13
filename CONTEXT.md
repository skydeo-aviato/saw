# Skydeo Engineering Operating Model

The vocabulary Skydeo engineering uses to describe its own work on Linear — how a
piece of work is named, what stage it is at, and who is answerable for moving it.
Glossary only: rituals live beside their drafting skills (the commitment
charter: `plugins/saw/skills/cycle/commitment.md`), decisions in `docs/adr/`.

## Phases

**Planning phase**:
The first of two serial phases for any effort: figuring out what the work is.
Produces decisions, never production code. Ends when the destination is reached.
_Avoid_: Discovery, spike phase, pre-work

**Execution phase**:
The second phase: turning a settled plan into production code. Begins at the
handoff, when the planning phase has nothing left to decide.
_Avoid_: Delivery, build phase, implementation phase (as a synonym for the whole)

**Handoff**:
The moment a map reaches its destination and its plan is converted into build
work. The only event that licenses decomposition. Two acts, not one: write the
spec, then slice it.
_Not_: `/saw:handoff`, an inherited upstream skill that hands the current session
to the next agent. This Handoff passes a finished map's spec into the execution
phase; that one passes a conversation to a successor agent.
_Avoid_: Kickoff, grooming, sprint prep

## Levels

**Effort**:
One bounded piece of work with a destination, from its first open question to
production. Carried by a single Linear **project** across both phases.
_Avoid_: Epic, workstream, stream

**Project**:
The Linear primitive that holds an effort. Its description is the map, its
summary the one-line destination, its documents the spec, its issues the
decision tickets and implementation issues. Cut fresh, one dated outcome at a
time, only when its work is actually scheduled.
_Avoid_: Epic, milestone, sprint

**Spec**:
The synthesis of what to build, written at the handoff and attached to the
project as a Linear document. One per project. Rewritten in place, never
versioned — it is the current instruction to whoever implements. Contrast Map,
which records how the route was found.
_Avoid_: PRD (the skill's own alias, but not our word), design doc, plan

**Initiative**:
A goal too big for one map — several efforts in sequence, each with its own
destination. Holds projects, never issues. Most projects have no initiative; the
bar to create one is being able to name the second map.
_Avoid_: Epic, theme, program

**Promotion**:
Moving an accepted issue into its fresh project — inside the cycle owner's
shape session, at the create-the-map step, once charting has settled the
destination and fog survives. The issue never closes; an issue that fits one
session skips promotion. Sizing is an output of shaping, so promotion can
never happen at triage.
_Avoid_: Escalation, conversion, breakdown

_Retired levels_: **project milestone** (a project is already one dated outcome)
and **parent / sub-issue** (Linear recommends them for work too big for an issue
and too small for a project — a set that is empty when a project costs thirty
seconds).

## Work items

**Work item**:
Anything tracked as a Linear issue, in either phase.
_Avoid_: Ticket (ambiguous — see Decision ticket), task (a specific Act), story

**Path**:
The route an individual work item takes through the shared state set. A property
of the item; contrast Phase, which is a property of the effort.
_Avoid_: Track, flow, pipeline, workflow

**Map**:
The durable artifact of one effort: its destination, the decisions made so far,
its fog, and what it has ruled out of scope. An index, not a store — it gists
each decision and points at the ticket holding the detail. Lives as the project
description, and never closes: the project completes, the map stays as the record
of how the route was found.
_Avoid_: Plan, epic, brief, PRD

**Destination**:
What reaching the end of a map looks like. Fixes the map's scope, so anything
beyond it is out of scope rather than fog.
_Avoid_: Goal, outcome, definition of done (which is per work item)

**Fog**:
In-scope questions a map can tell are coming but cannot yet state sharply. Held as
prose on the map, deliberately never as work items. Graduates into decision
tickets as the frontier advances.
_Avoid_: Backlog, icebox, later, TBD

**Decision ticket**:
A work item in the planning phase: a question whose resolution is a decision,
sized to a single agent session. Produces an answer, never a branch or a pull
request.
_Avoid_: Spike, investigation, research task

**Implementation issue**:
A work item in the execution phase: a vertical slice of behaviour that becomes
production code. One planned feature normally yields several, and they need not
share a Change class.
_Avoid_: Story, dev ticket, build task

**Intake**:
How untracked work enters Triage, in two lanes that both name the requester as a
real user. An **Ask** — a request from outside the team — arrives through the
product's Slack ask-channel and is filed by Linear Asks, requester attributed
natively, thread kept in sync. The team's own ideas arrive by `/capture` from a
session, which files as the engineer running it. No agent ever files on a
requester's behalf — that masks who asked.
_Avoid_: Capture (one lane, not the whole), front door, request funnel

## Ownership

**Owner**:
The one human answerable for an effort landing. Set at pickup by whoever plans
the cycle, and unchanged when work is handed out. Expressed as the project lead,
or as the assignee of a bare issue when there is no project — never its own
field.
_Avoid_: Assignee (a different thing — see below), responsible, DRI

**Assignee**:
Who is holding a single work item right now — the owner or a teammate they
pulled in. Always a human: firing a subagent does not hand the item over. A
baton, not a nameplate: it changes freely and says nothing about accountability,
which lives in the gates instead.
_Avoid_: Owner, responsible party

**Baton**:
The handing of one work item to whoever will move it next. Passing a baton never
moves ownership. The pass carries no artifact of its own: the holder writes the
findings so far and the help wanted onto the item before the assignee changes, and
a helper hands the item back the same way.
_Avoid_: Handover, delegation (which in Linear means the unused `delegate` field)

**AFK**:
Nobody is in the session. **Unmarked everywhere, deliberately.** The agent has no
identity of record: a session's Linear writes carry the human driving it, and
every issue names the human on the hook for it, whether or not they watched the
work happen. One agent seat exists — **klawdeo** (full name `Claude Opus`; one
account, two renderings) — live only as Claude Tag's read-only instrument. It was
retired from the assignee convention because an assignee that holds nothing is
not a baton, and it files nothing since intake moved to Asks. The GitHub
`klawdeo` was a separate identity, removed from the org.
_Avoid_: Autonomous, unattended, headless, agentic; Claude Opus (same seat —
say klawdeo)

## Classification

Every work item carries exactly one label from either Act or Change — never both —
plus exactly one Product. Which of Act or Change it comes from determines its path.

**Act**:
The label group for planning-phase work, naming what happens in the session:
`research` · `grilling` · `prototype` · `task`. Taken verbatim from the wayfinder
skill.
_Avoid_: Type, kind, ticket type

**Change**:
The label group for execution-phase work, naming what the work does to the
product: `feat` · `fix` · `refactor` · `chore`.
_Avoid_: Issue class, subject, category

**Product**:
The label group naming the actual software a work item relates to or aims to
serve. The only axis that applies in both phases. **Single-select** — a Linear
label group is mutually exclusive per issue, accepted deliberately: work
spanning two products is two work items. The `Product` group on the Platform
team, read live, is the registry — it grows without a plugin release. Anyone
may tag any product; the label says where the work lands, never who did it.
Five values today:

| value | software |
| --- | --- |
| `api` | the backend every surface consumes over HTTP |
| `curate` | internal data-operations app |
| `console` | internal admin panel |
| `tooling` | the team's own development platform |
| `legacy` | the old Curate app, dies at cutover |

_Retired_: `sam`, `website`, `suppliers` (left with the Product team's opt-out,
2026-08-10), `graasp`, `brand-manager` (removed until Platform takes them
over), `accounts` (no longer a product), `mcp` (a way to consume a product,
not a product — MCP-server work carries the product it exposes),
`design-system` (named a shared component library that does not exist), `ui`
(never a value)
_Avoid_: Domain (the old name), area, component, module, surface; the Product
*team* (opted out 2026-08-10 — this term names software only)

**Surface owner**:
_Retired_ (2026-08-10, Product opt-out). Named the team answerable for a
domain's health when two teams shared the registry; with one team, domain →
team went constant and the concept says nothing. Its one surviving rule —
owning is not applying — moved into **Product**.
_Avoid_: Maintainer, code owner, responsible team

**Design language**:
The colors, tokens, logos and Figma library each codebase implements
independently. Authored company-wide by one person outside Linear — the model's
only inbound dependency. Deliberately not a Product label; work implementing
tokens carries the product of the codebase it lands in.
_Avoid_: Design system (there is no shared package), brand, theme

**Priority**:
The single-select field answering one question — **who is waiting on this?** Not
importance, and never a number of days: the same word converts to different
durations depending on where the cycle is and what else is live.

| value | meaning | on arriving work | on derived work |
| --- | --- | --- | --- |
| `Urgent` | someone is blocked **right now** | breaks into the running cycle, owner-gated | everything in the effort stops until this moves |
| `High` | it blocks work **already committed to** | planning cannot close without it | do it before your other issues |
| `Medium` | wanted, **nothing waiting behind it** | inside the two-cycle accept horizon | normal cycle work, any order |
| `Low` | **nobody is waiting** | never wins a slot of its own | ships when someone is already in that code |

Written by whoever knows what is waiting: the triager at accept, on exit from
Triage, the creator on derived work, and `Urgent` by the queue owner or deputy
only — the same person who may add to a running cycle. Humans only — a machine,
intake agent or Triage Intelligence, cannot know who is waiting; a requester's
"this is urgent" is evidence in the body, not a field value. `No priority`
exists only inside Triage and never persists past it.
_Avoid_: Severity, importance, P0/P1/P2, ranking

**Ride-along work**:
`Low`-priority work that is real, cheap, and coupled to a place in the code. It
never earns a cycle slot of its own and ships when someone is already there.
Mostly what arrives through a Slack channel. Distinct from work that is declined into a
map's fog, which is a deferral rather than an accept.
_Avoid_: Nice-to-have, backlog filler, tech debt

**Alarm**:
An instrument that fires at a named person in the moment — an SLA escalating on
an issue, a view posting to Slack. Distinct from a **measure**, a number read
after the fact. Alarms are foundation and ship in v1; measures are the
intelligence layer and wait until the foundation has run. A number may set an
alarm's sensitivity; it may never carry a definition's meaning.
_Avoid_: Metric, report, dashboard (those are measures)

## Commitment

**Commitment ritual**:
The one judgement moment per cycle boundary, ~30 minutes: rollover audit → candidate
pool → capacity check → selection → commitment note. An agent drafts the mechanical
steps (pool, capacity, and the audit's and note's drafts); a human vetoes the audit
item by item and owns selection entirely. Fired by an alarm, never by memory — the
draft is waiting when the human arrives. The ritual's product is the planned cycle
in Linear; the commitment note is its record, not its deliverable.
_Avoid_: Sprint planning, betting table, cycle kickoff, grooming

**Cycle goal**:
One sentence naming what a cycle is for, set at selection. The commitment is to the
goal, not to the issue list.
_Avoid_: Sprint goal, theme, OKR

**Break-in**:
Work that enters a running cycle instead of waiting for a boundary. Entry is governed
by the Priority table (`Urgent` through the owner-held gate; `High` derived work,
ungated); the ritual's audit lists every break-in and what it displaced, so a cycle
that keeps getting pierced is seen rather than silently absorbed.
_Avoid_: Interrupt, injection, scope creep

**Circuit breaker**:
Work that overruns its cycle is never auto-extended — it re-enters selection and must
win its slot again. Guards against Linear's automatic rollover quietly re-committing
stale work forever (Kanban's "proto-replenishment"); nothing survives a boundary
without a fresh human yes.
_Avoid_: Rollover (the default it interrupts), extension, carry-over

## Plugin composition

How saw consumes the upstream skills it is built on. Three buckets, and the rules
that decide which one a skill sits in.

**Curated vendor**:
The relationship between saw and the plugin it is built on: upstream's skills are
copied into saw by the sync script, at a pinned version, whitelisted skill by
skill. The copy is read-only — the script, never a hand edit, owns it — and
upgrading upstream means rerunning the sync. The team installs one plugin and
sees one namespace.
_Avoid_: Dependency, subtree pull, fork, bundling

**Whitelist**:
The list of upstream skills the sync copies, split by placement: `registered`
names land in `skills/` as commands (inherited), `vendored` names land in
`vendor/` file-only. It is also the kill mechanism: a skill left off the
whitelist is never copied, so it never exists for the team — no routing
discipline, no per-repo or per-machine configuration. Un-killing is a
one-line edit.
_Avoid_: Allowlist config, deny rules, skill overrides

**Vendor manifest**:
The one file the sync script reads: the upstream repo, the pinned ref, the
whitelist, and the accept-list its reference validator consults. Editing it is
the only way the vendored copy changes — the sync delete-and-recreates
everything it owns from it (the vendor path, plus the inherited copies in the
registered directory) and touches nothing else.
_Avoid_: Lockfile, sync config, pin file

**Overlay**:
A saw skill fronting **exactly one** vendored skill it never restates: our name,
our extension-point values, and resolution lines telling the body where its
dependencies live. Skydeo procedure may wrap around the one skill, but an overlay
never re-owns a composition upstream already ships — `grill` fronts
`grill-with-docs`; it does not recompose grilling and domain-modeling itself.
**saw's customization mechanism** — how Skydeo changes the way upstream's flow
behaves, feels, and is called.
_Avoid_: Wrapper, shim, patch, fork

**Registration**:
What makes a skill exist to the harness — placement in `skills/`, auto-discovered.
The directory is the table: `skills/` holds the commands the team sees; `vendor/`
holds bodies only overlays reach, by path, invisible everywhere. Hand-picked,
never rule-derived.
_Avoid_: Exposure, manifest entry, publishing

**Router**:
The front-door skill (`/saw:help`): a static decision-tree that orients a teammate
in the flow — names the sanctioned command for their situation and stops. Never
invokes the target skill; invocation stays the human's act. Wholly ours; upstream's
`ask-matt` maps Matt's flows, not Skydeo's.
_Avoid_: Dispatcher, launcher, menu, ask-matt

**Extension point**:
A place an upstream skill leaves deliberately open for its consumer to fill —
wayfinder asking for a tracker doc rather than naming a tracker. Upstream's
tool-agnosticism is what creates them. Skydeo's values for them are **constants**,
not settings, so they are carried by the overlay rather than configured per repo.
_Avoid_: Hook, config, slot, override

**Graduation**:
An overlay becoming a skill wholly ours, body and all. Requires both conditions:
we want to change the behaviour, and no extension point exists on the axis we
need, so the change has nowhere to go but the body. Using an upstream skill
unmodified is never grounds — that is an inherited skill.
_Avoid_: Forking, taking over, vendoring in

**Inherited skill**:
An upstream skill the team receives copied unchanged, because the whitelist names
it. No overlay and no saw body; it moves only when the sync reruns. Choosing not
to whitelist one is a decision; it is not an absence of one.
_Not_: a vendored body an overlay points into — `grilling` and `domain-modeling`
are copied unchanged yet never registered; only a registered copy is inherited.
_Avoid_: As-is skill (retired), passthrough, re-export, alias

_Retired_: **Vendor body** (subsumed by Curated vendor) and **Upstream
dependency** — amended away before it ever shipped: a plugin dependency installs
upstream wholly and cannot mask a killed skill.
