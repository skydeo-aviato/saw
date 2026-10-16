---
name: ship
description: File a pull request with a review-ready body and inline evidence. Use when the user asks to ship, file, open, or create a pull request, when a pstack playbook reaches Opening a PR, or to write or rewrite a PR body.
metadata:
  credits:
    - skill: pr
      author: Matt Pocock
      url: "https://github.com/mattpocock/skills/blob/v1.3.1/skills/engineering/pr/SKILL.md"
    - skill: show-me
      author: Dex Horthy
      organisation: Humanlayer
      url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
    - skill: poteto-mode, Opening a PR playbook
      author: Lauren Tan
      organisation: pstack
      url: "https://github.com/cursor/plugins/blob/f713f14203cd6420cec13cd7c55c32d598dbab68/pstack/skills/poteto-mode/playbooks/opening-a-pr.md"
---

# Ship a pull request

The reader is a reviewer who knows little about the product, the feature or the code. The body must
let them judge the PR without reading the diff line by line: the problem, the proof, the risk, in
the same place every time.

## Running under pstack

pstack's Opening a PR playbook runs at the end of every `poteto-mode` playbook. When it is driving,
both apply, split this way:

| The playbook keeps | This skill replaces |
| --- | --- |
| Worktree, small ordered commits, `/deslop`, `/no-comments`, `interrogate` in a subagent | **Descriptions**: the body is [`PR-BODY.md`](PR-BODY.md), steps 4 and 5 |
| Forge, built-in PR tool, readiness, stacks, babysit | **"attach videos or screenshots"**: evidence is captured and uploaded per steps 4 and 7 |
| Conventional Commits titles, `/technical-writing` and `/unslop` on all prose | |

Without pstack, the steps below cover the whole job.

## 1. Read the repository's rules

Read `AGENTS.md` at the repository root, any `AGENTS.md` nearer the files you touched, `CLAUDE.md`,
and `.github/pull_request_template.md` if present. They own trunk, title format, labels, required
checks, and who merges, and they can remap pstack's words ("wherever pstack says main, use
`staging`"). Where they disagree with this skill or with pstack, they win.

The base branch is the parent branch for a stacked PR, otherwise the trunk the rules name. If they
name none, resolve it, never assume it:

```bash
git symbolic-ref --quiet --short refs/remotes/origin/HEAD | sed 's#^origin/##'
```

Empty output means the remote HEAD was never fetched: `git remote set-head origin --auto`, retry.

Done when you can name the base branch and every PR rule the repository states.

## 2. Preflight `gh`

Evidence is uploaded with `gh --attach`, which first shipped in `gh` 2.99.0. No other forge CLI here
can upload it, so this step runs even when pstack resolved Origin as the forge.

```bash
gh --version              # must be 2.99.0 or later
gh api user --jq .login   # proves the token is accepted
gh repo view --json nameWithOwner --jq .nameWithOwner   # proves the repo is on GitHub
```

`gh` uses `GH_TOKEN` from the environment ahead of any stored login. If any command fails, stop and
report the exact command and error to the user. That failure is the result; there is no other place
to host evidence.

Check whether a PR already exists for this branch: `gh pr list --head <branch> --state all`. If one
does, you are updating it (step 7), not opening a second.

## 3. Review the diff

`git diff origin/<base>...HEAD`, three dots, so the comparison is against the merge-base. Confirm the
contents match the goal and nothing unrelated rode along.

## 4. Capture evidence

Evidence lives outside git, in one directory per PR, and is never added to any branch:

```bash
EV=/tmp/pr-ev/<repo>-<branch>; mkdir -p "$EV"
```

Run the **real system** (the running service, the app in a browser, the CLI against a real
environment) the same way twice: on the base, where it fails, and on your branch, where it passes.
Drive it with the repository's `verify-<app>` skill or a control skill (`control-ui`, `control-cli`)
when one exists. Attach straight from the directory that tool writes, or a swarm's
`/tmp/swarm-<pr-id>/`, when it is outside the repository or `git check-ignore -q <path>` passes.

- **Backend, API, CLI:** the exact command and the real response, pasted as a fenced `console`
  block. Trim noise, never edit output.
- **UI:** screenshots (PNG) or a short video (MP4, MOV or WebM; 10 MB on a free GitHub plan, 100 MB
  on a paid one) in which the change is visibly working. Open every file and look at it before
  posting: right screen, change in frame, finished loading, no secrets or personal data.

A test run supports evidence; it never replaces it. If the real system cannot be run here, say so in
the Evidence section with the reason and the exact steps a reviewer can run instead.

Bulk that would bury the briefing (full logs, swarm or arena lane tables, verdict recitals, full
SHAs) goes in a PR comment, and the Evidence section links it. Screenshots, video and captures stay
out of git even where `principle-prove-it-works` would commit an artifact; a `show-me-your-work`
decision log follows its own rule.

Done when every behaviour claimed in the Change section has a before and an after. A PR opened
early, so CI and bots run alongside the work, says in Evidence what will be captured, and is updated
in step 7 once it is.

## 5. Write the body

Copy [`PR-BODY.md`](PR-BODY.md) to `$EV/body.md` and fill it. Every section appears, in that order.
A section with nothing to say gets one line saying why.

Name every ticket and PR by what it is, with the link: `[Rename scopes to readonly and readwrite
(PLA-194)](https://linear.app/...)`, never a bare `PLA-194` or `#122`. Use the repository's own words
from `GLOSSARY.md` or `CONTEXT.md` where they exist.

Leave screenshots and video out of the body text. `--attach` appends each one after the last
section, captioned by the alt text you give it (`before.png#Before: the filter is lost on reload`).
In Evidence, name each attached file and what it proves.

## 6. Title

Conventional Commits, `type(scope): subject`, unless the repository's rules say otherwise. Titles
usually become commit messages; recent merged PRs show the house style. The subject says what
changes for the user, not what the code does:

> perf(server): Cut websocket frame size by 70%+ with gzipping

not

> perf(server): Negotiate permessage-deflate on the websocket

## 7. Open or update

Open the PR ready for review, never as a draft. Push the branch first.

When the run provides a built-in PR tool, create it there with `draft: false` and the body from
`$EV/body.md`, then upload the evidence with `gh`, with no body flag so the body stays as written:

```bash
gh pr edit <number> --attach "$EV/before.png#Before: the filter is lost on reload" \
  --attach "$EV/after.png#After: the filter survives a reload" --attach "$EV/after.mp4"
```

Otherwise create it with `gh`, naming the head; without `--head`, `gh pr create` can refuse a branch
that is already pushed:

```bash
gh pr create --head <branch> --base <base> --title "<title>" --body-file "$EV/body.md" \
  --attach "$EV/before.png#Before: the filter is lost on reload" \
  --attach "$EV/after.png#After: the filter survives a reload" --attach "$EV/after.mp4"
```

To change the body later, start from the posted body so the uploaded media stays in it:
`gh pr view <number> --json body --jq .body > "$EV/body.md"`, edit, then save it through the
built-in tool, or `gh pr edit <number> --body-file "$EV/body.md"` without one. New files go up with
`gh pr edit <number> --attach ...`. Evidence added after review starts goes in a comment:
`gh pr comment <number> --body "..." --attach ...`.

A non-zero exit that still prints a URL means some uploads failed: re-run `gh pr edit --attach` with
the failed files.

## 8. Verify the posted body

```bash
gh pr view <number> --json body --jq .body | grep -c 'github.com/user-attachments/assets/'
```

The count equals the number of files you attached. Open the PR and check each image and video
renders.

Opening a PR does not start a babysit. Post the URL and stop. Babysit only when the user asks, with
pstack's Babysit playbook under `poteto-mode`, otherwise the `babysit` skill.
