---
name: ship
description: File a pull request with a review-ready body and inline evidence. Use when the user asks to ship, file, open, or create a pull request, or to write or rewrite a PR body.
metadata:
  credits:
    - skill: pr
      author: Matt Pocock
      url: "https://github.com/mattpocock/skills/blob/v1.3.1/skills/engineering/pr/SKILL.md"
    - skill: show-me
      author: Dex Horthy
      organisation: Humanlayer
      url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---

# Ship a Pull Request

The reader is a reviewer who knows little about the product, the feature or the code. The body must
let them judge the PR without reading the diff line by line: the problem, the proof, the risk, in
the same place every time.

## 1. Read the repository's rules

Read `AGENTS.md` at the repository root, any `AGENTS.md` nearer the files you touched, `CLAUDE.md`,
and `.github/pull_request_template.md` if present. They own the base branch, title format, labels,
required checks, and who merges. Where they disagree with this skill, they win.

If they name no base branch, resolve it, never assume it:

```bash
git symbolic-ref --quiet --short refs/remotes/origin/HEAD | sed 's#^origin/##'
```

Empty output means the remote HEAD was never fetched: `git remote set-head origin --auto`, retry.

Done when you can name the base branch and every PR rule the repository states.

## 2. Preflight `gh`

Evidence is uploaded with `--attach`, which first shipped in `gh` 2.99.0.

```bash
gh --version              # must be 2.99.0 or later
gh api user --jq .login   # proves the token is accepted
```

`gh` uses `GH_TOKEN` from the environment ahead of any stored login. If the version is older or the
API call fails, stop and report the exact command and error to the user. That failure is the
result; there is no other place to host evidence.

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

- **Backend, API, CLI:** the exact command and the real response, pasted as a fenced `console`
  block. Trim noise, never edit output. Keep the raw capture in `$EV` too.
- **UI:** screenshots (PNG) or a short video (MP4, MOV or WebM; 10 MB on a free GitHub plan, 100 MB
  on a paid one) in which the change is visibly working. Open every file and look at it before
  posting: right screen, change in frame, finished loading, no secrets or personal data.

A test run supports evidence; it never replaces it. If the real system cannot be run here, say so in
the Evidence section with the reason and the exact steps a reviewer can run instead.

Done when every behaviour claimed in the Change section has a before and an after in `$EV`.

## 5. Write the body

Copy [`PR-BODY.md`](PR-BODY.md) to `$EV/body.md` and fill it. Every section appears, in that order.
A section with nothing to say gets one line saying why.

Name every ticket and PR by what it is, with the link: `[Rename scopes to readonly and readwrite
(PLA-194)](https://linear.app/...)`, never a bare `PLA-194` or `#122`.

Reference each evidence file by the exact path you will pass to `--attach`:
`![After: the filter survives a reload](/tmp/pr-ev/console-saved-filters/after.png)`. `gh` swaps that
path for the uploaded URL. Use the repository's own words from `GLOSSARY.md` or `CONTEXT.md` where
they exist.

## 6. Title

PR titles usually become commit messages, so follow the repository's title convention; recent merged
PRs show it. Say what changes for the user, not what the code does:

> perf(server): Cut websocket frame size by 70%+ with gzipping

not

> perf(server): Negotiate permessage-deflate on the websocket

## 7. Open or update

```bash
gh pr create --base <base> --title "<title>" --body-file "$EV/body.md" \
  --attach "$EV/before.png#Before: the filter is lost on reload" \
  --attach "$EV/after.png#After: the filter survives a reload" \
  --attach "$EV/after.mp4"
```

Updating an existing PR: `gh pr edit <number> --body-file "$EV/body.md" --attach ...`. Evidence
added after review starts goes in a comment: `gh pr comment <number> --body "..." --attach ...`.

Open a real PR, not a draft, so review bots run, unless the repository's rules say otherwise. A
non-zero exit that still prints a URL means some uploads failed: re-run `gh pr edit` with the failed
files.

## 8. Verify the posted body

```bash
gh pr view <number> --json body --jq .body | grep -nE '/tmp/|\]\(\./' || echo clean
```

`clean` means every evidence path became a GitHub-hosted attachment. Open the PR and check each image
and video renders. Then, if the user asked, continue with the `babysit` skill.
