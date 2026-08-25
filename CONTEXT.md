# SAW, plugin composition

The vocabulary for what SAW is and how it is put together. Glossary only. Decisions live in
`docs/adr/`.

SAW has no tracker vocabulary and no operating model of its own. Words like *map*, *destination*,
*fog*, *spec* and *decision ticket* belong to the upstream skills that define them, and are not
redefined here.

## Terms

**Working set**:
The selection rule. A skill is here because this team reaches for it in real work, not because
upstream ships it. Matt Pocock publishes 35 skills and SAW carries 22. The omissions are not
judgements about quality, they are skills outside how Skydeo builds software. That makes the
curation descriptive rather than editorial: the test for adding a skill is that somebody already
wanted it on real work, and the test for keeping one is that somebody still uses it. A skill nobody
reaches for should leave, however good it is.
_Avoid_: Best-of, recommended set, our picks, blessed list

**Inherited skill**:
An upstream skill copied in unchanged, which is 23 of the 25. It has no SAW body of its own and
moves only when somebody recopies it. Treat copies as read-only: a change wanted in one goes
upstream, because a local edit is invisible to upstream and the next copy silently reverts it.
Nothing enforces this now.
_Avoid_: Passthrough, re-export, alias, fork

**Name parity**:
An inherited skill keeps the name its upstream gave it. Renaming buys a nicer word and costs the
ability to read upstream's docs, follow its cross-references, or match a bug report against it.

This is also why bare names have to stay unique across upstreams. A skill's directory name is the
command namespace, so two upstreams shipping the same name collide with nowhere to go. `pstack`
ships a `tdd` and a `teach` that Matt Pocock already claims, and since resolving that would need a
rename, `unslop` is the only skill we take from it.
_Avoid_: Aliasing, our name, branded name

**Pinned ref**:
The exact upstream commit a copy was taken from. A tag where the upstream cuts them, a commit SHA
where it does not. Never a bare branch, which makes every copy a different tree and leaves "which
version do we have" with no answer.
_Avoid_: Version, latest, HEAD

**Record**:
`plugins/saw/ATTRIBUTION.md`, the one file naming what SAW carries, from whom, at which ref, under
which licence. It replaced a machine-read manifest and the difference matters. A manifest that
disagreed with the tree produced a wrong copy; a record that disagrees with the tree just lies.
Updating it is part of copying a skill, not a follow-up.
_Avoid_: Manifest, lockfile, pin file

**Packager**:
What SAW is to the skills it carries. It pins them, picks them, namespaces them and distributes
them, and it writes almost none of them. Never describe SAW as the author of anything but `ship`
and `babysit`, in a manifest, a README or a skill. Both upstreams are MIT, so their copyright
notices travel with the copies.
_Avoid_: Author, maintainer, creator

**Courtesy credit**:
Naming an influence that carries no licence obligation, where an idea came from work that was
demonstrated rather than published. `ship` and `babysit` are ours by authorship and Theo Browne's
by idea. Nothing breaks if such a credit disappears, which is exactly why it is written down.
_Avoid_: Inspiration note, shout-out

**Registration**:
Placement in `skills/` is what makes a skill exist to the harness. The directory listing is the
registry. `vendor/` holds each upstream's licence text and nothing the harness reads.
_Avoid_: Exposure, manifest entry, publishing

**Extension point**:
A place an upstream skill leaves open for its consumer to fill, such as wayfinder asking for a
tracker doc instead of naming a tracker. SAW fills none of them. They are answered per repo by
`/saw:setup-matt-pocock-skills` writing `docs/agents/`, which is what lets one plugin serve repos
that track work in different places.
_Avoid_: Hook, config, slot, override

## What is ours

Two skills, and the bar for a third is high.

| | |
| --- | --- |
| `/saw:ship` | file a pull request |
| `/saw:babysit` | tend a filed pull request through review and CI |

## Retired

**Router** (`/saw:help`), which named the sanctioned command for a situation and stopped. It
restated what each skill's own description says and listed the set by hand, so nothing kept it in
step with `skills/`. A stale router misdirects. Typing `/` does the job.

**Overlay**, a SAW skill fronting one vendored skill under our name. All dissolved. Once tracker
values moved to per-repo configuration and names went back to parity, an overlay held nothing but a
path to the body it fronted.

**Whitelist** and **Vendor manifest**, which described a machine-read list of what to copy. There is
no such list now. The Record is the only thing that names what we carry.

**Graduation**, the path for an inherited skill to become wholly ours. It never happened, and
"the change goes upstream" covers the case without a word for it.
