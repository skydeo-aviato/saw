#!/usr/bin/env node
// One sync entry point, two jobs:
//
//   pnpm run sync vendor            regenerate the vendored upstream from the manifest
//   pnpm run sync version           copy package.json's version into plugin.json
//   pnpm run sync version --check   write nothing; exit 1 if the two versions differ
//
// ── sync vendor ──────────────────────────────────────────────────────────────
// Regenerates saw's vendored upstream from plugins/saw/vendor-manifest.json.
// The manifest (upstream repo, pinned ref, whitelist) is the only input:
// editing it and rerunning is the whole upgrade / un-kill flow.
//
// What it owns — and delete-and-recreates on every run:
//   - plugins/saw/vendor/                      (wholly)
//   - plugins/saw/skills/<name>/               (only names in the manifest's
//                                               "registered" list)
// It never touches other skills/ directories (ours / overlays), the plugin
// manifest, or any repo root file.
//
// Placement is registration: skill directories copied into plugins/saw/skills/
// are auto-discovered and appear in the `/` menu; directories copied into
// plugins/saw/vendor/ are never scanned and stay file-only, reachable only by
// path from overlays.
//
// Copies are byte-identical skill directories (no patching, no frontmatter
// injection) plus upstream's LICENSE — never upstream scaffolding. The vendor
// tree mirrors upstream's skills/<category>/<name> layout so copies stay
// trivially auditable and overlay path references survive upgrades.
//
// Before writing anything it validates every bare-name skill reference
// (`/skill-name`) in the whitelisted bodies: each must name a skill that will
// exist in the plugin after the sync (registered or vendored) or sit on the
// manifest's accept-list. Anything new fails the sync loudly, before a single
// file moves.
//
// ── sync version ─────────────────────────────────────────────────────────────
// Claude Code keys the plugin cache on plugin.json's version, so a bump that
// lands only in package.json reaches nobody. Runs as part of `pnpm run
// version`, immediately after `changeset version`.

import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = join(repo, "plugins", "saw");

function fail(message) {
  console.error(`sync: ${message}`);
  process.exit(1);
}

// ── sync version ─────────────────────────────────────────────────────────────

function syncVersion(checkOnly) {
  const pluginPath = join(pluginDir, ".claude-plugin", "plugin.json");

  const { version } = JSON.parse(
    readFileSync(join(repo, "package.json"), "utf8"),
  );
  const source = readFileSync(pluginPath, "utf8");
  const plugin = JSON.parse(source);

  if (plugin.version === version) {
    console.log(`plugin.json version is ${version} — already in sync`);
    return;
  }

  if (checkOnly)
    fail(
      `plugin.json version is ${plugin.version}, package.json is ${version}. ` +
        "Run `pnpm run sync version`.",
    );

  // Rewrite only the version line, to keep the key order and the formatting.
  const updated = source.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`);

  if (JSON.parse(updated).version !== version)
    fail(`could not find a version field to replace in ${pluginPath}.`);

  writeFileSync(pluginPath, updated);
  console.log(`plugin.json version ${plugin.version} -> ${version}`);
}

// ── sync vendor ──────────────────────────────────────────────────────────────

function syncVendor() {
  const manifestPath = join(pluginDir, "vendor-manifest.json");
  const skillsDir = join(pluginDir, "skills");
  const vendorDir = join(pluginDir, "vendor");

  // --- Read the manifest -----------------------------------------------------

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const { upstream, registered, vendored, acceptList } = manifest;

  if (!upstream?.repo || !upstream?.ref)
    fail(`manifest ${manifestPath} needs upstream.repo and upstream.ref`);
  for (const [key, value] of Object.entries({ registered, vendored, acceptList }))
    if (!Array.isArray(value)) fail(`manifest field "${key}" must be an array`);

  const overlap = registered.filter((name) => vendored.includes(name));
  if (overlap.length > 0)
    fail(`skill(s) listed as both registered and vendored: ${overlap.join(", ")}`);

  // --- Check out upstream at the pinned ref ----------------------------------

  const checkout = mkdtempSync(join(tmpdir(), "saw-sync-vendor-"));
  process.on("exit", () => rmSync(checkout, { recursive: true, force: true }));

  console.log(`Cloning ${upstream.repo} at ${upstream.ref} ...`);
  execFileSync(
    "git",
    [
      "-c",
      "advice.detachedHead=false",
      "clone",
      "--quiet",
      "--depth",
      "1",
      "--branch",
      upstream.ref,
      upstream.repo,
      checkout,
    ],
    { stdio: ["ignore", "inherit", "inherit"] },
  );

  // --- Index every skill upstream ships (any category) ------------------------

  const upstreamSkills = new Map(); // name -> path relative to the checkout
  const upstreamSkillsRoot = join(checkout, "skills");
  for (const category of readdirSync(upstreamSkillsRoot)) {
    const categoryDir = join(upstreamSkillsRoot, category);
    if (!statSync(categoryDir).isDirectory()) continue;
    for (const name of readdirSync(categoryDir)) {
      const skillDir = join(categoryDir, name);
      if (!existsSync(join(skillDir, "SKILL.md"))) continue;
      if (upstreamSkills.has(name))
        fail(
          `upstream ships "${name}" twice (${upstreamSkills.get(name)} and ` +
            `${relative(checkout, skillDir)}) — the manifest's bare names can't disambiguate`,
        );
      upstreamSkills.set(name, relative(checkout, skillDir));
    }
  }

  const missing = [...registered, ...vendored].filter(
    (name) => !upstreamSkills.has(name),
  );
  if (missing.length > 0)
    fail(
      `whitelisted skill(s) not found upstream at ${upstream.ref}: ${missing.join(", ")}`,
    );

  // --- Validate bare-name skill references before writing anything ------------
  //
  // A reference resolves when it names a skill that will exist in the plugin
  // after this sync (registered — inherited, ours, or overlay — or vendored
  // file-only) or sits on the accept-list. The candidate vocabulary is every
  // skill upstream ships, so a future upstream version that starts referencing
  // a skill we don't carry fails here, loudly, before any copy.

  const registeredAfterSync = new Set([
    ...readdirSync(skillsDir).filter((entry) =>
      statSync(join(skillsDir, entry)).isDirectory(),
    ),
    ...registered,
  ]);
  const resolvable = new Set([...registeredAfterSync, ...vendored, ...acceptList]);

  const referencePattern = /(?<=^|[\s`"'(\[])\/([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\b/g;
  const violations = [];

  function collectFiles(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) collectFiles(path, out);
      else out.push(path);
    }
    return out;
  }

  for (const name of [...registered, ...vendored]) {
    const skillDir = join(checkout, upstreamSkills.get(name));
    for (const file of collectFiles(skillDir)) {
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, index) => {
        for (const match of line.matchAll(referencePattern)) {
          const referenced = match[1];
          if (upstreamSkills.has(referenced) && !resolvable.has(referenced))
            violations.push(
              `${relative(checkout, file)}:${index + 1} references /${referenced}, ` +
                `which is neither registered, vendored, nor on the accept-list`,
            );
        }
      });
    }
  }

  if (violations.length > 0) {
    console.error("sync: unresolved bare-name skill reference(s):\n");
    for (const violation of violations) console.error(`  ${violation}`);
    console.error(
      "\nEither whitelist the referenced skill in the manifest or add it to the" +
        " accept-list. Nothing was written.",
    );
    process.exit(1);
  }

  // --- Delete and recreate everything the sync owns ---------------------------

  rmSync(vendorDir, { recursive: true, force: true });

  for (const name of vendored) {
    const rel = upstreamSkills.get(name);
    cpSync(join(checkout, rel), join(vendorDir, "mattpocock", rel), {
      recursive: true,
    });
  }
  cpSync(join(checkout, "LICENSE"), join(vendorDir, "mattpocock", "LICENSE"));

  for (const name of registered) {
    const target = join(skillsDir, name);
    rmSync(target, { recursive: true, force: true });
    cpSync(join(checkout, upstreamSkills.get(name)), target, { recursive: true });
  }

  console.log(
    `Synced ${upstream.repo}@${upstream.ref}: ` +
      `${registered.length} registered skill(s) into plugins/saw/skills/, ` +
      `${vendored.length} file-only skill(s) plus LICENSE into plugins/saw/vendor/mattpocock/.`,
  );
}

// ── Dispatch ─────────────────────────────────────────────────────────────────

const [subcommand, ...flags] = process.argv.slice(2);

if (subcommand === "vendor") syncVendor();
else if (subcommand === "version") syncVersion(flags.includes("--check"));
else {
  console.error(
    "usage: pnpm run sync vendor | pnpm run sync version [--check]",
  );
  process.exit(1);
}
