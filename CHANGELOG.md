# @skydeo-aviato/saw

## 0.1.0

The first release of SAW as a curated distribution: 25 Claude Code skills the Skydeo team uses day
to day, packaged as one plugin.

23 of the 25 are other people's work, redistributed unchanged and under their own names. 22 come
from [Matt Pocock](https://github.com/mattpocock/skills), and `unslop` from
[Lauren Tan](https://github.com/cursor/plugins/tree/main/pstack). Both are MIT.
`plugins/saw/ATTRIBUTION.md` names the author of every command and links it to the source it came
from.

Two skills are ours, `ship` and `babysit`. We wrote the text; the idea came from versions Theo
Browne demonstrated on the T3 channel.

SAW ships no tracker configuration and no operating model of its own. The skills are tool-agnostic,
and `/saw:setup-matt-pocock-skills` answers the per-repo questions they leave open, so the plugin
works whether a repo tracks work in GitHub, GitLab, local markdown, or something described in prose.

The repo is markdown files. There is no build and no sync tooling.
