# SAW, the Skydeo Agentic Workflow

The curated set of Claude Code skills the Skydeo team uses day to day, packaged as one plugin.

**wayfinder → to-spec → to-tickets → implement → ship → babysit**

## We did not write most of this

23 of SAW's 25 commands are other people's work, redistributed unchanged and under their upstream
names. We claim authorship of none of them.

| Whose | What | Licence |
| --- | --- | --- |
| [Matt Pocock](https://github.com/mattpocock) | [`mattpocock/skills`](https://github.com/mattpocock/skills), 22 commands and the whole pipeline above | MIT |
| [Lauren Tan](https://github.com/poteto) | [`pstack`](https://github.com/cursor/plugins/tree/main/pstack), where `unslop` comes from | MIT |
| Skydeo | `ship`, `babysit`, and the packaging | MIT |

We wrote the text of `ship` and `babysit` but did not have the idea. Both exist because of versions
[Theo Browne](https://www.youtube.com/@t3dotgg) demonstrated on the T3 channel, which were never
published, so there is no repository to link and no licence to comply with. The credit is a
thank-you rather than an obligation.

If one of these skills is useful to you, the credit is theirs. If one is broken, the upstream is
where to say so. [`ATTRIBUTION.md`](plugins/saw/ATTRIBUTION.md) names the author of every command
and links it to the source it came from.

A skill is in SAW because we reach for it in real work, not because it exists upstream. Matt Pocock
publishes 35 skills and we carry 22. This is our working set, not a best-of list. If your team works
differently, install the upstreams directly and pick your own.

SAW is MIT licensed. See [`LICENSE`](LICENSE).

## Install

```text
/plugin marketplace add skydeo-aviato/saw
/plugin install saw@skydeo
```

You need read access to `skydeo-aviato/saw` and a local `gh auth login`. Without GitHub access,
point the marketplace at a teammate's checkout instead: `/plugin marketplace add
/absolute/path/to/saw`.

### Or push it to everyone

Nobody has to run those two commands. Managed settings register the marketplace and install the
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
organization with no MDM to run. These keys sit at the top of the settings precedence order, so a
teammate cannot turn SAW off locally.

Every member needs read access to this repo or the auto-install fails for them. A public repo
removes that dependency, and the `gh auth login` step with it.

One thing that looks like it covers this and does not: skills provisioned under claude.ai
Organization Settings reach chat on the web, the Chat tab in Claude Desktop, and Cowork. They do not
reach Claude Code. This plugin is the Claude Code path.

## Set up each repo, once

```text
/saw:setup-matt-pocock-skills
```

SAW ships no tracker configuration of its own. The skills are tool-agnostic, and this command
answers the questions they leave open, writing its answers into the repo you run it in. That is what
lets one plugin serve a repo tracking work in GitHub Issues, one on Linear, and one keeping markdown
in a scratch directory.

Run it before first use in a repo. Re-run it only to switch trackers.

## The pipeline

**`/saw:wayfinder`** is for an effort too big and too foggy to plan in one sitting. Grill the
destination, then chart the route as a map of decision tickets and work them one at a time. If
charting turns up no fog, there was no map to draw, so build the thing as it stands. Three commands
do the work inside it: **`/saw:grill-with-docs`** interviews you to a decision, **`/saw:research`**
reads primary sources unattended, and **`/saw:prototype`** builds something rough to react to.

**`/saw:to-spec`** turns everything the map decided into a spec. It does not interview you. If it
needs to ask you something, the map was not finished.

**`/saw:to-tickets`** cuts the spec into tickets, each a vertical slice that can be verified alone
and fits a single agent session. No spec means nothing to slice.

**`/saw:implement`** builds one ticket, using **`/saw:tdd`** at seams you agreed beforehand and
**`/saw:code-review`** on what came out.

**`/saw:ship`** opens the pull request ready rather than draft, so the review bots run. It does not
merge.

**`/saw:babysit`** works that PR through review and CI, answering every bot and human thread and
fixing what is real, until the checks go green.

```text
/saw:wayfinder    # too foggy to plan in one go
/saw:to-spec      # once nothing is left to decide
/saw:to-tickets
/saw:implement
/saw:ship
/saw:babysit
```

Small work skips the middle. A bug with nothing to decide goes straight to `/saw:implement`.

## Everything else

25 commands in total. Type `/` in Claude Code to see them all with the situation each one is for.
