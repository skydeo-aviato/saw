# SAW, the Skydeo Agentic Workflow

The curated set of Claude Code skills the Skydeo team uses day to day, from a fuzzy idea to merged
code.

**wayfinder → to-spec → to-tickets → implement → ship → babysit**

That is the whole selection rule. A skill is in SAW because we reach for it in real work, not
because it exists upstream. Matt Pocock publishes 35 skills and we carry 22. The 13 we leave out are
good skills that just are not part of how this team works. Nothing here is aspirational, and nothing
is bundled for completeness.

Which makes the caveat obvious. This is our working set, tuned to how Skydeo builds software. It is
not a best-of list. If your team works differently, install the upstreams directly and pick your
own.

## We did not write most of this

23 of SAW's 25 commands are other people's work, redistributed unchanged. We claim authorship of
none of them.

| Whose | What | Licence |
| --- | --- | --- |
| [Matt Pocock](https://github.com/mattpocock) | [`mattpocock/skills`](https://github.com/mattpocock/skills), 22 of the 25 commands and the whole pipeline below | MIT |
| [Lauren Tan](https://github.com/poteto) | [`pstack`](https://github.com/cursor/plugins/tree/main/pstack), which is where `unslop` comes from | MIT |
| Skydeo | `ship`, `babysit`, and the packaging | MIT |

We wrote the text of `ship` and `babysit`, but we did not have the idea. Both exist because of
versions [Theo Browne](https://www.youtube.com/@t3dotgg) demonstrated on the T3 channel. Those were
never published, so there is no repository to link and no licence to comply with. The credit is a
thank-you rather than an obligation, which is exactly why it would have been easy to leave out.

If one of these skills is useful to you, the credit is theirs. If one of them is broken, the
upstream is where to say so. [`ATTRIBUTION.md`](plugins/saw/ATTRIBUTION.md) names the author of
every command and links it to the upstream source it came from.

What SAW adds is packaging. We pin the skills, pick them one at a time, and put them under one
namespace, so a team installs one plugin and gets one coherent menu instead of assembling the set by
hand. Skills keep their upstream names, so upstream's docs and cross-references still describe what
you have installed.

SAW is MIT licensed. See [`LICENSE`](LICENSE).

## Install

```text
/plugin marketplace add skydeo-aviato/saw
/plugin install saw@skydeo
```

You need read access to `skydeo-aviato/saw` and a local `gh auth login`. Without GitHub access,
point the marketplace at a teammate's checkout instead: `/plugin marketplace add
/absolute/path/to/saw`.

## Deploying to the whole team

Nobody has to run the two commands above. Managed settings register the marketplace and install the
plugin the first time each person starts Claude Code:

```json
{
  "extraKnownMarketplaces": {
    "skydeo": { "source": { "source": "github", "repo": "skydeo-aviato/saw" } }
  },
  "enabledPlugins": { "saw@skydeo": true }
}
```

Deliver it from the claude.ai admin console as server-managed settings, which reach the whole
organization with no MDM to run. A `managed-settings.json` deployed by MDM is the alternative. It
allows per-group targeting, but only server-managed settings reach cloud sessions.

Managed settings sit at the top of the precedence order, so these keys are read-only. A teammate
cannot uninstall SAW by editing their own settings. Pair it with
[`strictKnownMarketplaces`](https://code.claude.com/docs/en/settings-reference#strictknownmarketplaces)
to allowlist which marketplaces anyone may install from at all.

One prerequisite. Every member needs read access to this repo or the auto-install fails for them. A
public repo removes that dependency, and the `gh auth login` step above with it.

Two things this does not cover, both easy to assume it does.

Claude.ai Organization Settings, then Skills, is a different system. Skills provisioned there reach
chat on the web, the Chat tab in Claude Desktop, and Cowork. They do not reach Claude Code. This
plugin is the Claude Code path.

Per-repo setup still has to happen. `/saw:setup-matt-pocock-skills` writes `docs/agents/` in each
repo, and managed settings cannot do it for you, because the answers differ per repo.

## Set up each repo, once

```text
/saw:setup-matt-pocock-skills
```

SAW ships no tracker configuration of its own. The skills are tool-agnostic, and this command
answers the questions they leave open. It asks where issues live, what the triage labels are called,
and where `CONTEXT.md` and the ADRs sit, then writes `docs/agents/` in the repo you run it in. That
is what lets one plugin serve a repo tracking work in GitHub Issues, one on Linear, and one keeping
markdown under `.scratch/`.

Run it before first use in a repo. Re-run it only to switch trackers.

## The pipeline

### `/saw:wayfinder`, work out what the thing is

For an effort too big and too foggy to plan in one sitting. Grill the destination, then chart the
route as a map of decision tickets and work them one at a time, each a question whose answer is a
decision. If charting turns up no fog, there was no map to draw. Build the thing as it stands.

Three acts happen inside it:

| | |
| --- | --- |
| `/saw:grill-with-docs` | The default. Interviews you to a decision, then records the terms in `CONTEXT.md` and the decision in `docs/adr/`. |
| `/saw:research` | Reads primary sources unattended and writes up the findings. |
| `/saw:prototype` | Builds something rough to react to, when the question is how something should look or behave. |

Shaping ends when nothing is left to decide.

### `/saw:to-spec`, write it down

Turns everything the map decided into a spec. It does not interview you. If it needs to ask you
something, the map was not finished.

### `/saw:to-tickets`, cut it into work

Turns the spec into tickets. Each one is a vertical slice that cuts end-to-end, can be verified
alone, and fits a single agent session. Anything bigger gets split rather than estimated. It reads a
spec, so with no spec there is nothing to slice. That is the whole decomposition gate.

### `/saw:implement`, build one

Builds one ticket against the spec, using `/saw:tdd` at seams you agreed beforehand, then
`/saw:code-review` on what came out.

### `/saw:ship`, open the PR

Opens the pull request ready rather than draft, so the review bots run. It does not merge. That
stays a human's act.

### `/saw:babysit`, tend it

Works the filed PR through review and CI. It answers every bot and human thread, fixes what is real,
pushes back on what is not, and stops when the checks go green.

## A typical loop

```text
/saw:wayfinder    # too foggy to plan in one go, so chart it and work the decisions
/saw:to-spec      # once nothing is left to decide
/saw:to-tickets   # spec becomes tickets
/saw:implement
/saw:ship
/saw:babysit
```

Small work skips the middle. A bug with nothing to decide goes straight to `/saw:implement`.

## What's in the box

25 commands. Type `/` in Claude Code to see them all with the situation each one is for. Two are
ours, `ship` and `babysit`. Everything else is inherited unchanged from upstream.

## Working on SAW itself

This repo is markdown files and one dependency. There is no build, no sync script, and nothing to
run except changesets. That is deliberate. Copying markdown between repositories is `cp`, and the
script that used to wrap it cost more to maintain than the job it did.

Registration is placement. `plugins/saw/skills/` is auto-discovered, so a directory in `skills/` is
a registered command. There is no `skills` array in the plugin manifest.

### Adding or upgrading a skill

[`ATTRIBUTION.md`](plugins/saw/ATTRIBUTION.md) is the record of what we carry and at which ref.
Nothing else tracks it, so a copy made without editing that file is an untracked copy.

1. Clone the upstream at a ref you pick deliberately. Use a tag where the upstream cuts them and a
   commit SHA where it does not. Never track a branch, because that makes every copy a different
   tree.
2. Copy the skill directory into `plugins/saw/skills/<name>/`, byte for byte. No patches, no
   frontmatter edits, no renames.
3. Copy the upstream's LICENSE into `plugins/saw/vendor/<source>/LICENSE` if the source is new.
4. Update `ATTRIBUTION.md` with the skill, its permalink at that ref, and the ref itself if you
   moved it.

Skills keep their upstream names, and bare names have to stay unique across sources. `pstack` ships
a `tdd` and a `teach` that collide with Matt Pocock's, which is why `unslop` is the only skill we
take from it. `CLAUDE.md` and `CONTEXT.md` carry the rest of the rules.

### Releasing

Every change under `plugins/saw/**` carries a changeset:

```bash
pnpm changeset
```

Nothing enforces that. `implement` and `ship` are upstream bodies that know nothing about
changesets, so it falls to whoever makes the change.

Major means the surface changed, so an invocable command was removed or renamed, or the installed
set was reshaped. Everything else is minor or patch.

The bump is not the release. Cut one from `main`:

```bash
pnpm run version                            # bump package.json, write the CHANGELOG
# then edit plugins/saw/.claude-plugin/plugin.json to the same version, by hand
git commit -am "chore(release): <version>"
git tag v<version> && git push origin v<version>
gh release create v<version> --notes-file <(...)   # notes from CHANGELOG.md
```

Copying the version into `plugin.json` is the step to watch. Claude Code keys the plugin cache on
that file, so a version that lands only in `package.json` reaches nobody, and nothing checks the two
agree any more. Forgetting it fails silently. The tag exists, the CHANGELOG reads correctly, and not
one person gets the update.

Tags are `v<version>`, and release notes come from the matching `## <version>` section of
`CHANGELOG.md`. We do not use `changeset tag`, which writes `@skydeo-aviato/saw@<version>`, an npm
convention that means nothing for a private package that never publishes.

One consequence worth knowing rather than rediscovering. Claude Code resolves version-constrained
plugin dependencies against `saw--v<version>` tags only. We publish `v<version>`, so nobody can pin
a dependency on `saw` by version range. Ordinary marketplace installs track the marketplace entry
rather than tags, so they are unaffected.

`main` requires signed commits. History-rewriting commands drop signatures without saying so, so
check with `git log --show-signature` before opening a pull request.
