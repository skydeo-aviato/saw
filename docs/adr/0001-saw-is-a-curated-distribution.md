# SAW is a curated distribution, not a workflow layer

SAW began as an overlay layer: our own command names fronting upstream bodies, with Skydeo's Linear
configuration injected as the value for every extension point upstream left open. We have removed
that layer. SAW now carries upstream skills unchanged, under their upstream names, and ships no
tracker configuration and no operating model of its own.

The overlays were paying rent in both directions. A local name (`shape` for `wayfinder`, `slice`
for `to-tickets`) meant upstream's docs and cross-references no longer described what was
installed. Hardcoded Linear meant the plugin worked in exactly one repo, and every upstream skill's
deliberate tool-agnosticism was spent on a constant. Once the tracker values moved out to per-repo
configuration and the names went back to parity, the overlays held nothing but a path reference to
the body they fronted — which registering the body directly makes unnecessary.

## Consequences

- Extension points are answered per repo by `/saw:setup-matt-pocock-skills` writing `docs/agents/`,
  not by the plugin. Running it is now a prerequisite, and a repo that skips it degrades quietly —
  `code-review`'s Spec axis reports "no spec available" rather than failing.
- The Skydeo operating model — Product labels, Triage, cycles, priority, the commitment ritual,
  Asks intake — left the plugin with `capture` and `cycle`. It is not recorded anywhere in this
  repo any more.
- `CONTEXT.md` is now the vocabulary of plugin composition only.
- Only `ship` and `babysit` are ours. Wanting a change in anything else means getting it changed
  upstream.
