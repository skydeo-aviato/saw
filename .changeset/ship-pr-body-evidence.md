---
"@skydeo-aviato/saw": minor
---

`/saw:ship` now writes every PR body in one fixed shape (problem, change, picture, evidence, risk, where to look, scope) and uploads screenshots and video with `gh --attach` instead of committing them to evidence branches. Under pstack's `poteto-mode` it takes over only the Opening a PR playbook's description and evidence steps, and leaves commits, forge, stacks, readiness and babysit to the playbook.
