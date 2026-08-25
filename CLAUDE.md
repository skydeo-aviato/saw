## Five rules

**Almost nothing here is ours.** 23 of the 25 skills in `plugins/saw/skills/` are copies of other
people's work. Only `ship` and `babysit` may be edited. A change wanted in any other skill goes
upstream, because a local edit is invisible there and the next copy reverts it.

**Never claim authorship**, in a manifest, a README, or a skill. `plugins/saw/ATTRIBUTION.md` is the
record of who wrote what and where it came from. Copying a skill without updating it makes that
record a lie.

**Skills keep their upstream names**, and bare names stay unique across upstreams because the name is
the command namespace. `pstack` ships a `tdd` and a `teach` that collide with Matt Pocock's, which is
why `unslop` is the only skill we take from it.

**Every change under `plugins/saw/**` carries a changeset.** `pnpm changeset`, one line a reader
outside this session would understand. Nothing enforces this. Major means a command was removed or
renamed, or the installed set was reshaped.

**No tracker config in the plugin.** No tracker, team, label registry, or workflow hardcoded into
`plugins/saw/**`. Upstream's skills are tool-agnostic and `/saw:setup-matt-pocock-skills` answers
those questions per repo. Hardcoding one makes the plugin work in exactly one repo.

## Adding or upgrading a skill

There is no sync script. Copying markdown between repositories is `cp`.
`plugins/saw/ATTRIBUTION.md` is the only record of what we carry and at which ref, so a copy made
without editing it is untracked.

1. Clone the upstream at a ref picked deliberately. A tag where the upstream cuts them, a commit SHA
   where it does not. Never a branch, which makes every copy a different tree.
2. Copy the skill directory into `plugins/saw/skills/<name>/`, byte for byte. No patches, no
   frontmatter edits, no renames.
3. Copy the upstream's LICENSE into `plugins/saw/vendor/<source>/LICENSE` if the source is new.
4. Update `ATTRIBUTION.md`: the command, its permalink at that ref, and the ref itself if it moved.

Placement is registration. A directory in `plugins/saw/skills/` is a command; there is no `skills`
array in the plugin manifest.

## Releasing

```bash
V=0.2.0                                     # the version being cut

pnpm run version                            # bump package.json, write the CHANGELOG
# then edit plugins/saw/.claude-plugin/plugin.json to $V, by hand
git commit -am "chore(release): $V"

git tag -s "v$V" -m "v$V"
git push origin "v$V"

awk -v v="## $V" '$0==v{f=1;next} /^## /{f=0} f' CHANGELOG.md > /tmp/notes.md
gh release create "v$V" --title "saw $V" --notes-file /tmp/notes.md
```

Copying the version into `plugin.json` is the step to watch. Claude Code keys its plugin cache on
that file, so a version landing only in `package.json` reaches nobody, and nothing checks the two
agree. Forgetting it fails silently: the tag lands, the CHANGELOG reads right, and no one gets the
update.

Four things in that recipe are deliberate, each found by getting it wrong:

- **`git tag -s`, not `git tag`.** Plain `git tag` makes a lightweight tag, which cannot carry a
  signature at all. `tag.gpgsign` does not change that; only annotated tags get signed.
- **Check the notes file is not empty.** `gh release create` accepts an empty `--notes-file` without
  complaining and publishes a blank release. `gh release edit "v$V" --notes-file /tmp/notes.md`
  repairs it.
- **That `awk` is not a `sed` range** because the obvious `sed` form is rejected by BSD `sed` on
  macOS.
- **Do not verify signing with `git log --show-signature`.** With SSH signing it reports
  `No signature` for a correctly signed commit unless `gpg.ssh.allowedSignersFile` is set locally.
  Use `git cat-file commit HEAD | grep -q '^gpgsig' && echo signed`.

`main` is the default branch and requires signed commits. Tags are `v<version>`, and release notes
come from the matching `## <version>` section of `CHANGELOG.md`. `changeset tag` is unused: it
writes `@skydeo-aviato/saw@<version>`, an npm convention meaning nothing for a package that never
publishes.
