# @skydeo-aviato/saw

## 0.2.0

### Minor Changes

- 86c2905: New `/saw:babysit` command: given a PR link or ID, it tends the PR — verifying and answering review-bot and human comments, fixing CI — until checks and reviews are green; merge happens only on the user's explicit ask.

### Patch Changes

- c0fc4f3: Rewrote `/saw:ship` and `/saw:babysit` as short, tool-agnostic instructions: ship focuses on PR title/description quality, babysit on verifying bot findings before acting — dropping the Greptile score loop and 5-iteration cap.
- Add /saw:babysit and reorient /saw:shape

## 0.1.0

### Minor Changes

- The SAW baseline: a curated Claude Code plugin carrying the Platform team's full operating surface — capture → shape → spec → slice → implement → ship, with `/help` as the router, `/cycle` drafting the commitment ritual, the Linear write contract and the operations doctrine (commitment charter, Asks intake) shipping alongside the skills.
