# Issue tracker: Linear

Issues live in Linear, on the **Platform (PLAT)** team. The write contract — fields, labels,
priority, per-skill tables, and when to stop and ask — is `plugins/saw/references/linear.md`;
this file only maps the generic tracker operations onto it.

## When a skill says "publish to the issue tracker"

Create a Linear issue per the write contract. Derived work (decision tickets, implementation
issues) lands on its effort's project; raw intake lands in the `Triage` status via `/capture`.

## When a skill says "fetch the relevant ticket"

Fetch the issue by key (`PLAT-42`) or URL via the Linear MCP tools. Issue references in commit
messages and branch names are Linear keys (`PLAT-42`).

## Wayfinding operations

Used by `/shape`. The full mapping — map, destination, decision tickets, blocking, claiming,
frontier, resolve — is `plugins/saw/references/linear.md` §6.1.
