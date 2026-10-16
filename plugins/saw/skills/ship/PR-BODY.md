# PR body template

Fill every section, in this order. The guidance under each heading is for you, not the reader:
delete it from the posted body. Write short declarative sentences in sentence case, with no long
dashes, no slashes for "or", and no bold label followed by a colon. Under pstack, run
`/technical-writing` and `/unslop` over the result.

```markdown
## Problem

### What's wrong

<who is hurt and how, in product terms> <[what the ticket is (ID)](url)> <[where it was reported](url)>

### Why it matters to us

<one or two sentences on the business or team cost, tied to a real goal>

## Change

### Before

<what the user or caller sees today>

### After

<what they see with this PR>

## Picture

<one small diagram, diff-sketch, or tree>

## Evidence

<before and after from the real system, and what each attached file proves>

## Risk

- <One-way or two-way> door. <why>
- Blast radius. <who or what could break>
- Rollback. <the exact step that undoes it>

## Where to look

<the places a mistake would hide, the decisions you are least sure of, and alternatives you rejected>

## Scope

<what this PR leaves out, each item with [the ticket it went to (ID)](url)>
```

`--attach` adds the screenshots and video after Scope.

## Problem

Write for someone who has never used the feature. "Partners lose their saved segment filter on every
reload", not "fix filter state hydration". With no ticket, say so and link the conversation,
incident, or message the request came from. "Why it matters" names a goal the team actually holds (a
launch, a customer, an SLA, review time), not "improves code quality". No SHAs and no rebase history
here.

## Change

Behaviour only, as the user or caller experiences it. Name both sides of a rename or retarget.
Implementation belongs in Picture.

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
- UI: one line per attached screenshot or video naming what it shows. The files themselves follow
  Scope.
- Perf: one primary number with its unit, `before → after`.

Add the test that failed before and passes now as support, named in one line. Link the PR comment
that holds anything bulky.

## Risk

A two-way door is cheap to walk back (revert the merge). A one-way door is not: data migrations,
deleted data, published API contracts, sent emails, external side effects. For blast radius,
consider every consumer, including other services, layout on mobile, existing data, and scheduled
jobs. If trunk is red, state the cost of leaving it red. Rollback is a concrete step, including
anything a revert alone does not undo.

## Where to look

Point the reviewer at the two or three places where a mistake would hide, the decisions you are
least sure of, and the alternatives a reviewer would otherwise ask about, with why they lost.
"Everything is straightforward" is a valid entry only when it is true.

## Scope

Each thing deliberately left out, linked to the ticket that now owns it. Nothing left out: say so.
