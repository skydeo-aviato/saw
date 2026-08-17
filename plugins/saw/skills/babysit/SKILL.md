---
name: babysit
description: Monitor a pull request through review and CI. Use when the user asks to monitor, watch, or babysit a PR.
argument-hint: "<PR link or ID>"
---

# Babysit

AI review bots leave comments on PRs, they're helpful but they're not always right.

If your harness offers tools to monitor a PR, use them so you can respond when comments arrive. Otherwise pull the PR for new comments and checks.

Only act on checks and comments that are newer than the latest push. Verify every bot finding against the source before changing code. Fix real findings and CI failures, distinguish repository failures from infrastructure flakes, and reply with a written response and a thumbs-down when dismissing a false positive. 

If a review bot leaves a review comment that you believe is not worth addressing, reply and resolve the comment. Format the comments left on the user behalf as:

```md
[MODEL_SLUG] RESPONDING ON BEHALF OF [USER]
-----

[actual reply]
```

Do not let review feedback expand the PR beyond the user's original goal. Address real shortcomings but avoid scope creep.

If something has not changed, stay quiet rather than posting filler comments. Stop when the review bots and required checks are green on the latest commit. Merge only when specifically asked to otherwise report that the PR is ready to merge.
