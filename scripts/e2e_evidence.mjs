#!/usr/bin/env node
import { mkdirSync, cpSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const now = new Date();
const iso = now.toISOString();
const day = iso.slice(0, 10);
const runId = iso.replace(/[:.]/g, "-");
const root = process.cwd();
const runDir = join(root, "tmp", "e2e", day, `run-${runId}`);
const artifactsDir = join(runDir, "artifacts");

mkdirSync(artifactsDir, { recursive: true });

const command = ["npx", "playwright", "test"];
const result = spawnSync(command[0], command.slice(1), {
  cwd: root,
  env: process.env,
  stdio: "pipe",
  encoding: "utf-8",
});

const stdout = result.stdout ?? "";
const stderr = result.stderr ?? "";
writeFileSync(join(runDir, "playwright.stdout.log"), stdout);
writeFileSync(join(runDir, "playwright.stderr.log"), stderr);

for (const dir of ["playwright-report", "test-results"]) {
  const source = join(root, dir);
  if (existsSync(source)) {
    cpSync(source, join(artifactsDir, dir), { recursive: true });
  }
}

const summary = {
  generatedAt: iso,
  command: command.join(" "),
  status: result.status ?? 1,
  signal: result.signal ?? null,
  evidenceDir: runDir,
};

writeFileSync(join(runDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.stdout.write(stdout);
process.stderr.write(stderr);
process.exit(result.status ?? 1);
