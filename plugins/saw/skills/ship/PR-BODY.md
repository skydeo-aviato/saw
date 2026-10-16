# PR body template

Fill every section, in this order. Keep prose short and plain; skip preambles. The guidance under
each heading is for you, not the reader: delete it from the posted body.

```markdown
## Problem

**What's wrong:** <who is hurt and how, in product terms> Ticket: <[what it is (ID)](url)>. Source: <[where it was reported](url)>.

**Why it matters to us:** <one or two sentences on the business or team cost, tied to a real goal>

## Change

**Before:** <what the user or caller sees today>
**After:** <what they see with this PR>

## Picture

<one small diagram, diff-sketch, or tree>

## Evidence

<before and after from the real system>

## Risk

**Door:** <one-way or two-way>, <why>
**Blast radius:** <who or what could break>
**Rollback:** <the exact step that undoes it>

## Where to look

<the files, functions, or decisions that deserve the reviewer's attention, and why>

## Scope

<what this PR leaves out, each item with [the ticket it went to (ID)](url)>
```

## Problem

Write for someone who has never used the feature. "Partners lose their saved segment filter on every
reload", not "fix filter state hydration". No ticket: say so and link the conversation, incident, or
message the request came from. "Why it matters" names a goal the team actually holds (a launch, a
customer, an SLA, review time), not "improves code quality".

## Change

Behaviour only, as the user or caller experiences it. Implementation belongs in Picture.

## Picture

Pick the smallest view that makes the key point clear. Usually one; rarely more than two.

- Logic or an algorithm: pseudocode.
- Runtime control flow: an indented call tree.
- UI structure: a component tree, with the state and module boundaries that matter.
- File responsibilities or a broad refactor: a shallow file tree with one comment per entry.
- Interaction or data flow between components: a Mermaid `sequenceDiagram` or `flowchart`.
- What changes inside a shape that already exists: a `diff` block of any of the above.

```diff
 submitForm
   createSession
     persistPrompt
+    expandSkillMention
     launchAgent
```

Keep only the calls, files, props, and states needed to understand this change.

## Evidence

From the real system, before on the base and after on this branch. "Tests pass" alone is not
evidence.

- Backend, API, CLI: fenced `console` captures of the real request and response, before and after.
- UI: screenshots or video in which the change is visibly working, each looked at before posting.
  Put before and after side by side in a table when they are screenshots of the same screen.

Add the test that failed before and passes now as support, named in one line.

## Risk

A **two-way door** is cheap to walk back (revert the merge); a **one-way door** is not (data
migrations, deleted data, published API contracts, sent emails, external side effects). Blast
radius: consider every consumer: other services, layout on mobile, existing data, scheduled jobs.
Rollback is a concrete step, including anything a revert alone does not undo.

## Where to look

Point the reviewer at the two or three places where a mistake would hide, and the decisions you are
least sure of. "Everything is straightforward" is a valid entry only when it is true.

## Scope

Each thing deliberately left out, linked to the ticket that now owns it. Nothing left out: say so.
