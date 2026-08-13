#!/usr/bin/env node
// Tags the release commit `v<version>` and cuts the GitHub release from the
// CHANGELOG. Runs as `pnpm run release`, after the version bump is committed.
//
// Refuses rather than guesses: the two version files must agree, the tree must
// be clean, and the tag must not already exist.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const git = (...args) =>
  execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();

const read = (...path) => JSON.parse(readFileSync(join(repo, ...path), "utf8"));

const fail = (message) => {
  console.error(`✘ ${message}`);
  process.exit(1);
};

const { version } = read("package.json");
const plugin = read("plugins", "saw", ".claude-plugin", "plugin.json");
const tag = `v${version}`;

if (plugin.version !== version) {
  fail(
    `plugin.json is ${plugin.version}, package.json is ${version}. Run \`pnpm run sync version\`.`,
  );
}

if (git("status", "--porcelain")) {
  fail("Working tree is dirty. Commit the release first.");
}

if (git("tag", "--list", tag)) {
  fail(`Tag ${tag} already exists. Bump the version, or delete the tag.`);
}

// The CHANGELOG section for this version becomes the release notes.
const changelog = readFileSync(join(repo, "CHANGELOG.md"), "utf8");
// `s` without `m`, so `$` means end of file rather than end of line — with `m`
// the lookahead matches the first line break and the notes come out empty.
const section = new RegExp(
  `\\n## ${version.replace(/\./g, "\\.")}\\n(.*?)(?=\\n## |$)`,
  "s",
).exec(changelog);

if (!section) fail(`No \`## ${version}\` section in CHANGELOG.md.`);
const notes = section[1].trim();
if (!notes) fail(`The \`## ${version}\` section of CHANGELOG.md is empty.`);

console.log(`Tag:      ${tag} at ${git("rev-parse", "--short", "HEAD")}`);
console.log(`Notes:    ${notes.split("\n").length} lines from CHANGELOG.md`);

if (dryRun) {
  console.log(`\n✔ Dry run — nothing created.`);
  process.exit(0);
}

git("tag", "-a", tag, "-m", `saw ${version}`);
git("push", "origin", `refs/tags/${tag}`);
console.log(`✔ Created and pushed ${tag}`);

execFileSync(
  "gh",
  ["release", "create", tag, "--title", `saw ${version}`, "--notes", notes],
  { cwd: repo, stdio: "inherit" },
);
console.log(`✔ Released ${tag}`);
