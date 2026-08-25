Read `CONTEXT.md` for the vocabulary and `docs/adr/` for the decisions that bind. Output that
contradicts an ADR says so rather than quietly overriding it.

## Five rules

**Almost nothing here is ours.** 23 of the 25 skills in `plugins/saw/skills/` are copies of other
people's work. Only `ship` and `babysit` may be edited. A change wanted in any other skill
goes upstream, because a local edit is invisible and the next copy reverts it.

**Never claim authorship**, in a manifest, a README, or a skill. `plugins/saw/ATTRIBUTION.md` is the
record of who wrote what and where it came from. Copying a skill without updating it makes that
record a lie.

**Every change under `plugins/saw/**` carries a changeset.** `pnpm changeset`, one line a reader
outside this session would understand. Nothing enforces this. Major means a command was removed or
renamed, or the installed set was reshaped.

**Never hand-edit a version**, apart from the one release step that needs it. See the README.

**No tracker config in the plugin.** No tracker, team, label registry, or workflow hardcoded into
`plugins/saw/**`. Upstream's skills are tool-agnostic and `/saw:setup-matt-pocock-skills` answers
those questions per repo. Hardcoding one makes the plugin work in exactly one repo.

## Procedures

Both live in the README so they load only when needed: "Adding or upgrading a skill", and
"Releasing".

There is no build and no sync script. Copying markdown between repositories is `cp`.
