#!/usr/bin/env bash
# SAW: SessionStart scan for reapable worktrees. Emits a context block (stdout) only
# when >=1 linked worktree's remote branch is gone & the tree is clean; silent otherwise.
# Not destructive to worktrees or local branches, but it DOES prune stale remote-tracking
# refs and contact the network. Targets bash 3.2 (stock macOS): no mapfile/assoc arrays.
set -u
cat >/dev/null 2>&1 || true   # drain the hook payload on stdin; we operate on cwd
tab="$(printf '\t')"

git rev-parse --git-dir >/dev/null 2>&1 || exit 0

gcd="$(git rev-parse --git-common-dir 2>/dev/null)"
case "$gcd" in /*) ;; *) gcd="$(cd "$gcd" 2>/dev/null && pwd)" ;; esac
main="$(dirname "$gcd")"
current="$(git rev-parse --show-toplevel 2>/dev/null)"

# Candidate worktrees (exclude only the main checkout), one "path<TAB>branch<TAB>prunable"
# per line. The current worktree IS included — a merged tree you are sitting in is the
# one you most want reaped; it is tagged and reaped after a /cd back to main.
cands="$(git worktree list --porcelain 2>/dev/null | awk -v main="$main" '
  function flush(){ if (p!="" && p!=main) print p"\t"b"\t"pr }
  /^worktree /{ flush(); p=substr($0,10); b=""; pr=0 }
  /^branch /{ b=substr($0,8); sub(/^refs\/heads\//,"",b) }
  /^prunable/{ pr=1 }
  END{ flush() }
')"
[ -z "$cands" ] && exit 0

# Only touch the network when there is something to evaluate. `remote prune` drops stale
# remote-tracking refs (-> upstream [gone]) without downloading objects. Prune every remote
# (not just origin) so fork/upstream setups work. Offline only if no remote could be pruned.
stale=" — merge state may be stale (offline)"
for r in $(git remote 2>/dev/null); do
  if git remote prune "$r" >/dev/null 2>&1; then stale=""; fi
done

reap=""     # dir|status|branch|path  (one per line)
aware=""    # free text  (one per line)
while IFS= read -r line; do
  [ -z "$line" ] && continue
  path="${line%%$tab*}"; rest="${line#*$tab}"
  branch="${rest%%$tab*}"; prunable="${rest#*$tab}"
  dir="$(basename "$path")"
  tag=""; [ "$path" = "$current" ] && tag=" (current — /cd $main to remove)"

  if [ "$prunable" = "1" ]; then
    aware="$aware$dir (directory missing — run: git worktree prune)
"; continue
  fi
  if [ -z "$branch" ]; then
    aware="$aware$dir (detached HEAD)
"; continue
  fi
  if [ -n "$(git -C "$path" status --porcelain 2>/dev/null)" ]; then
    aware="$aware$dir (uncommitted changes)
"; continue
  fi

  fields="$(git for-each-ref --format="%(upstream:track)${tab}%(upstream)" "refs/heads/$branch" 2>/dev/null)"
  track="${fields%%$tab*}"; up="${fields#*$tab}"

  if [ "$track" = "[gone]" ]; then
    reap="$reap$dir|remote branch gone$stale$tag|$branch|$path
"
  elif [ -z "$up" ]; then
    aware="$aware$dir (local branch, never pushed)
"
  elif printf '%s' "$track" | grep -q ahead; then
    aware="$aware$dir (unpushed commits)
"
  else
    aware="$aware$dir (open — not merged)
"
  fi
done <<EOF
$cands
EOF

[ -z "$reap" ] && exit 0

n="$(printf '%s' "$reap" | grep -c .)"
echo "[SAW worktree teardown] $n worktree(s) whose remote branch is gone (likely squash-merged, but git can't prove it):"
printf '%s' "$reap" | while IFS='|' read -r dir status branch path; do
  [ -z "$dir" ] && continue
  echo "  • $dir — $status  [$branch]  @ $path"
done
awaren="$(printf '%s' "$aware" | grep -c .)"
if [ "$awaren" -gt 0 ]; then
  echo "Left alone: $(printf '%s' "$aware" | grep . | paste -sd '|' - | sed 's/|/, /g')"
fi
echo "→ Offer removal per plugins/saw/references/worktree.md § Teardown: AskUserQuestion multi-select; remove the tree with \`git worktree remove\` (never --force) and safe-delete the branch with \`git branch -d\`. Never force-delete (\`-D\`) automatically — git cannot distinguish a squash-merge from an abandoned branch."
exit 0
