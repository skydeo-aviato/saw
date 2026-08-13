---
name: help
description: Ask which saw command fits your situation. A router over every registered command — it names the sanctioned one and stops.
disable-model-invocation: true
---

# Help

You don't remember every command, so ask.

**Name-and-stop.** Recognize the user's situation in the tree below, name the sanctioned command,
and stop — never invoke it. Invocation stays the human's act. Answer from this file alone: read no
Linear state and no repo state. `/saw:help` is the navigation backstop — every registered command
appears here exactly once.

An **Effort** is one bounded piece of work with a destination, carried by a single Linear project
across two serial phases: the **planning phase** produces decisions, never production code; the
**execution phase** turns the settled plan into production code. Most work travels the main flow
below, two on-ramps merge onto it, and everything else is standalone or a vocabulary layer running
underneath. The words themselves live in `CONTEXT.md`.

## The main flow: arrival → production

1. **`/saw:capture`** — one of your own ideas — a thought, a bug you hit, work you see coming.
   File it into Linear Triage as yourself, acceptance criteria in the body. A request from someone
   outside the team is the Linear Asks lane in Slack, not a command.
2. **`/saw:triage`** — move what Triage holds through the five triage roles — categorise, verify,
   grill if needed, write agent-ready briefs. Only for work items you didn't create; derived work
   arrives already classified.
3. **Promotion** — no command of its own: it happens inside `/saw:shape`, at create-the-map.
   Fog survived charting, so the fresh project is cut with the settled destination and the
   accepted issue moves in — it never closes. An issue with no fog skips promotion and just
   gets built.
4. **`/saw:shape`** — point it at the accepted issue you own in the cycle: grill the destination,
   size the work, and — when fog earns a map — chart the effort as a Map of decision tickets on
   the project and work them, resolving each with the reasoning rather than the verdict alone,
   until the way to the destination is clear.
5. **The Handoff** — the moment the Map reaches its destination and its plan converts into build
   work. Two acts, not one:
   - **`/saw:spec`** — turn everything the Map decided into the spec: one per project, a Linear
     document, rewritten in place.
   - **`/saw:slice`** — break the spec into tracer-bullet implementation issues on the project,
     each declaring its blocking edges.
6. **`/saw:implement`** — build one implementation issue against the spec, in its own worktree,
   changeset written. It drives two commands each worth reaching for on their own:
   - **`/saw:tdd`** — the red-green loop; alone, when you want one concrete behaviour built
     test-first without a spec above it.
   - **`/saw:code-review`** — two-axis review (Standards + Spec) of the changes since a fixed
     point; alone, for any branch or pull request.
7. **`/saw:ship`** — open the pull request, gate on the changeset, resolve every review thread.
   Linear state belongs to the Git automations, and merging is the human's act.

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **An idea you can hold in one session** → **`/saw:grill`** — a relentless interview that
  sharpens the thinking and records the terms and decisions it settles. What survives enters the
  flow at step 1, or feeds a Map already open. An effort too foggy to hold in one session belongs
  on a Map of its own — enter the flow at step 3 instead.
- **Something's broken** → **`/saw:diagnosing-bugs`** — the discipline for hard bugs: build a
  tight feedback loop that already goes red on this bug, then fix with a regression test.

## Codebase health

Not feature work — upkeep.

- **`/saw:improve-codebase-architecture`** — survey the codebase for deepening opportunities;
  picking one generates an idea to take into the flow.

## The cycle boundary

Not feature work — the operating rhythm.

- **`/saw:cycle`** — plan the cycle: at a cycle boundary, the agent drafts the commitment
  ritual's mechanical steps into one reviewable artifact and stops where the ritual does —
  selection and the cycle goal are yours alone. The same draft the Claude Tag routine delivers
  by alarm.

## Standalone

Off the main flow entirely.

- **`/saw:research`** — delegate reading legwork to a background agent working a decision ticket:
  it investigates against primary sources, and the findings publish as a Linear document on the
  issue. The branch is transport and dies.
- **`/saw:prototype`** — a small throwaway program answering one design question a decision
  ticket holds — does this state model feel right, what should this UI look like. The capture
  document publishes to the issue on resolve.
- **`/saw:handoff`** — compact the current conversation into a document a fresh agent continues
  from. Not the operating model's Handoff (step 5): this one passes a session to a successor
  agent; that one passes a finished Map's plan into the execution phase.
- **`/saw:resolving-merge-conflicts`** — already mid merge or rebase conflict: resolve hunk by
  hunk by intent, traced to each side's primary source. Never abort.
- **`/saw:wait-what`** — the last message didn't land: re-pitch it in plain English, using the
  `CONTEXT.md` vocabulary.
- **`/saw:wizard`** — generate an interactive bash script for the steps only a human can take:
  credentials, third-party dashboards, one-off migrations.
- **`/saw:teach`** — learn a concept over multiple sessions, with the current directory as the
  stateful workspace.

## Vocabulary underneath

Reference layers the other commands speak. Reach for one when the words, not the process, are the
problem.

- **`/saw:codebase-design`** — the deep-module vocabulary for designing a module's shape: module,
  interface, depth, seam, leverage, locality.
- **`/saw:writing-for-agents`** — how to write anything an agent consumes: skills, `AGENTS.md`,
  pointed-at docs.
