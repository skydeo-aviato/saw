# Linear write contract

Vocabulary: `CONTEXT.md`. Decisions: `docs/adr/`.

## 1. API

| Fact | Consequence |
| --- | --- |
| `labels` **replaces** the whole set | read current, write the union, or you drop existing labels |
| `blockedBy` is writable | use it for every edge; never a body convention |
| `templateId` is not writable | set every field explicitly |
| `state` default is unreliable | always pass `state` |
| due date **xor** SLA | setting one clears the other |

## 2. Product

**The registry is the `Product` label group on the Platform team, read live.** Valid values are
exactly the group's current labels — it grows without a plugin release, so never resolve against a
memorised list. Resolve from what a person said: match against the *called* column below.

**No match in the live group → stop and ask.** Never map to the nearest one. Nothing validates a
wrong product, and it mis-files the work.

| label | what it is | called |
| --- | --- | --- |
| `api` | the Skydeo API — the backend every surface consumes over HTTP | the API, the backend, shared business layer |
| `curate` | internal data-operations app — Data Engineering's tooling for onboarding data and maintaining the segment catalog | Curate |
| `legacy` | the **old** Curate app, in production until cutover | old Curate, legacy Curate |
| `console` | the internal admin panel — operational views and controls for the team | the console, the admin panel, the app |
| `tooling` | the team's own development platform — CI, builds, deploy config, agent skills, SAW | CI, the build, deploys, SAW |

Team is never derived and never asked: everything files to the Platform team. The table is a
snapshot for aliases — the live group is the registry. A label in the live group that this table
has not caught up with is still valid.

**Three that get mixed up:**

- **`curate` is the current app; `legacy` is the old one.** Different codebases. Anything about
  cutover is `legacy`. If you cannot tell, ask.
- **`tooling` is how we build and ship**, never a thing users touch.
- **The MCP server is not a product** — it is a way to consume one. Work on it carries the product
  it exposes (usually `curate` or `api`).

## 3. Labels

Exactly one from Act **or** Change, plus exactly one Product.

| Group | Values | Phase |
| --- | --- | --- |
| Act | `research` `grilling` `prototype` `task` | planning |
| Change | `feat` `fix` `refactor` `chore` | execution |

Product is single-select — the Linear group enforces it — and applies in both phases.

## 4. Priority

| Value | Who is waiting |
| --- | --- |
| `Urgent` | someone is blocked right now |
| `High` | blocks work already committed to |
| `Medium` | wanted, nothing waiting |
| `Low` | nobody waiting |

Only `/slice` writes priority among the saw commands; the triager sets it at accept, on exit
from Triage — and the accept, not the priority, is what admits work past Triage. `No priority`
exists only in `Triage`.

## 5. Titles

Issue titles are plain descriptions. No formula — classification lives in the labels.

---

## 6.1 `/shape`

| wayfinder | Linear |
| --- | --- |
| map | project **description** |
| destination | project **summary** |
| Notes · Decisions so far · Not yet specified · Out of scope | sections of the description |
| decision ticket | issue in the project |
| ticket type | Act label |
| map marker | none — a project with decision tickets is a map |
| blocking | `blockedBy` |
| claiming | assignee |
| frontier | project issues `Todo`, unassigned, unblocked |
| asset | document on the issue (§6.5); anything already living elsewhere, a `links` entry |

Ticket fields: Act label, one Product, team (Platform), project, `Todo`. Assignee on claim.
Titles are the questions themselves.
Uncharted effort enters a cycle as one issue, *chart the map*, Act `grilling`.
Three acts: `/grill`, `/research`, `/prototype`.

**Resolve:** publish the asset, for the Acts that have one (§6.5) → comment the answer → close →
append gist to the map. Link assets, never inline.

### Promotion

An accepted issue gets its owner at the cycle boundary — selection and owners are one act.
Promotion happens later, **inside the owner's `/shape` session, at the "create the map" step**,
and only when charting surfaces fog: sizing is an output of shaping. An issue that fits one
session skips promotion and gets built as it stands. When fog survives, five writes, in order:

1. **Create the project** — name from the issue title; summary = **the settled destination the
   charting just produced**; description = the map skeleton (Destination · Notes · Decisions so
   far · Not yet specified · Out of scope) already carrying the grilling's decisions; lead = the
   issue's cycle owner; team from the issue.
2. **Set the issue's `project` field** to it — **the issue never closes**: for an Ask it is what
   the requester's thread syncs to, and the loop stays open to the end.
3. **State stays where the cycle put it** (`Todo`/`In Progress`) — `Triage` ended at accept.
4. **Nothing else moves** — title, labels, priority, assignee, Slack-thread link travel natively.
5. **Charting continues on the project** — the moved issue is the chart-the-map decision ticket.

One rule for both labels: an Act-labelled issue enters as the chart-the-map decision ticket; a
Change-labelled issue big enough to promote passes the same sizing gate, then exits shape early
to the execution path as the first implementation issue. Bare issues (one slice, nothing to
decide) are never promoted.

### Picking the next ticket

Several people work one map at once, so `first open ticket in order` is the wrong rule.

**The Act label says what kind of session a ticket needs. The assignee says which human holds it.**
Nothing is assigned to `klawdeo`. Firing a subagent does not hand the ticket over — whoever fires
it still holds it and still accepts the findings.

At session start, partition the project's open issues and take the first non-empty bucket:

| # | Bucket | Query |
| --- | --- | --- |
| 0 | **Fire** | `Todo`, Act `research`, unassigned, every blocker closed |
| 1 | **Resume** | assignee = me, `In Progress` |
| 2 | **Accept** | `In Review`, assignee = me — findings back, unread |
| 3 | **Claimed** | assignee = me, `Todo` |
| 4 | **Open** | `Todo`, unassigned, every blocker closed |
| 5 | **Blocked** | `Todo`, ≥1 open blocker |

**Bucket 0 is not one ticket — fire them all.** Research subagents run in parallel and do not
interact, which is why research is the one exception to resolving a single ticket per session. Firing
costs the session nothing and the findings may clear blockers before you pick real work. Then
continue to bucket 1.

An unfired research ticket means a shaping session ended before its subagents were fired. It is
nobody's fault and nobody's to chase — it is simply the next thing any session picks up.

**Firing is claiming.** Assign yourself, move it to `In Progress`, then fire. You are on the hook for
the findings whether or not you watched them arrive.

**Nothing watches for a subagent that died.** A fired ticket sitting in `In Progress` with no findings
is yours to notice, because you claimed it. Accepted, not overlooked.

**Bucket 1 outranks everything, including a ticket the user named** — never hold two `In Progress` at
once. Say so and resume instead.

**Bucket 2 is a minute of work and often releases blockers**, so it beats starting anything new.
`klawdeo` cannot accept its own findings, so agent-assigned `In Review` belongs to whoever is in
the session.

**Within bucket 4, rank by what it releases**: count the open tickets each one `blocks`, highest
first; break ties by issue number. A ticket blocking three others is worth more than one blocking
none, whatever order they were created in.

**Claim before any work** — assign yourself and save. An unclaimed ticket is the only thing stopping
two people starting the same question.

### When the frontier is empty

Every remaining ticket is in bucket 5. Report, per ticket, **the blocker and who holds it**:

- **Blocker unassigned** → take it, or fire it if it is `research`. That is the real next ticket.
- **Blocker assigned to me** → it is bucket 1 or 3; go there.
- **Blocker held by someone else** → name them and when they claimed it. State it as fact, with no
  threshold and no judgement — it tells the reader who to go and ask.

If every blocker is held, the map has nothing for this session. Say that plainly
rather than inventing work.

### Handing off

On close, print the next recommendation — bucket, issue key, title, and why it won. That line is the
next session's input: `/shape PLAT-42`.

When a resolution adds or graduates tickets, wire their `blockedBy` edges before recommending, or the
recommendation is computed against a stale graph.

## 6.2 `/spec`

`save_document` with `project`. One per project, rewritten in place.
Sets no labels, no state, no readiness marker.
Synthesise from the map's decision tickets. Reaching for a question means the map is unfinished.
Partial spec is valid — write the decided part, leave the rest as an open map.
Our word is **spec**; upstream says PRD.

## 6.3 `/slice`

| Field | Value |
| --- | --- |
| Change label | exactly one |
| Product | exactly one |
| team | Platform |
| project | the effort |
| state | `Todo` |
| assignee | the engineer driving — never blank |
| `blockedBy` | real edges |
| priority | set, from the spec and the blocking graph |
| acceptance criteria | checkboxes in the body |
| estimate | none |

Reads a spec; no spec, nothing to do.
One agent session per issue. Bigger → split into two.

## 6.4 `/implement`

Set the issue to `In Progress` at session start. **Linear has no branch-level automation** — status is
PR-driven — so nothing else moves it out of `Todo`.
Worktree first, per `worktree.md`.
Write no other field: `In Review` and `Done` are the PR automations'.

**Every plugin change carries a changeset.** `pnpm changeset`, one line a reader outside the session
would understand. Never hand-edit a version — changesets owns `package.json` and `plugin.json` both,
and a human cuts the release from `master` with `pnpm run version`.

## 6.5 Planning assets — the four Acts

One rule, for every Act: **long-form planning output publishes to a Linear-readable home on its
issue.** Linear is the only home — the branch or the repo file is transport, and dies once the
asset is published. The resolution comment stays a gist that links the asset, never a copy of it.

Findings and captures are many-per-project, so an asset attaches to its **issue**, never to the
project. The project document is the spec, one per project.

| Act | Assignment | Asset |
| --- | --- | --- |
| `research` (`/research`) | created unassigned; **whoever fires it claims it** — assign yourself, `In Progress`, then fire. Finishes at `In Review` for you to accept; several may run at once | the claimer publishes the findings as a document on the issue, at accept. The `research/<name>` branch is transport and dies |
| `prototype` (`/prototype`) | assign a human | the capture document — the verdict, what each variant showed, screenshots and recordings — publishes to the issue on resolve. The branch is transport and dies |
| `grilling` (`/grill`) | claim per §6.1 | none. The resolution comment is the whole record, and must carry the reasoning — the alternatives considered and why each fell, not just the verdict |
| `task` | claim per §6.1 | none. The resulting facts go in the resolution comment — where the credentials live, the URL, the row count |

Grilling and task are not exceptions to the rule; they produce no long-form asset. A fifth Act, or
a new kind of asset, is judged by the rule above.

## 7. Stop and ask

- No product match, or a label outside the live `Product` group
- Both an Act and a Change label, or neither
- `/slice` with no spec, or an issue with no assignee
- `/ship` with unticked acceptance criteria
- A change under `plugins/saw/**` with no changeset, or a hand-edited version field
- Anything that would set `Done` from an agent session
- A `labels` write that has not read the existing set

Nothing enforces any of this — no Linear validation, no GitHub ruleset.
