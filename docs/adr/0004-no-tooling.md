# The repo is markdown, with no tooling to maintain

SAW had a sync script: a vendor manifest, a multi-source checkout, a bare-name collision check, a
reference validator, and a generator that wrote `ATTRIBUTION.md`. All of it is deleted, along with
the release script. What remains is markdown files and changesets.

The script automated copying markdown between two git repositories. That is `cp`. Around that one
line had grown roughly four hundred lines of validation, plus a manifest to feed it, plus docs
explaining both, and all of it needed maintaining and upgrading. The job it did stayed one `cp`.

The honest trade is that the script enforced four rules nothing enforces now: name parity, unique
bare names, resolvable skill references, and copies staying byte-identical. Those rules did not
stop mattering. They moved from "checked" to "written down", in the README and `CONTEXT.md`.

## Consequences

`ATTRIBUTION.md` was generated and therefore could not drift. It is now hand-written and drifts the
moment somebody copies a skill without editing it. Since it is also the only record of what we
carry and at which ref, updating it is part of copying a skill rather than a follow-up task.

The version now has to be copied into `plugin.json` by hand after `changeset version`, and no drift
check catches a miss. Claude Code keys its plugin cache on that file, so forgetting the copy fails
silently: the tag lands, the CHANGELOG reads correctly, and nobody receives the update.

Nothing validates a copied skill's `/skill-name` references any more, so an upstream skill
referencing a skill we do not carry now ships broken instead of failing the copy.

These are real regressions, accepted deliberately. The wager is that a rule in a README that
somebody reads beats a rule in a script that somebody has to keep working.
