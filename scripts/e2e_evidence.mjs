import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const now = new Date();
const date = now.toISOString().slice(0, 10);
const stamp = now.toISOString().replace(/[:.]/g, "-");
const runDir = join("tmp", "e2e", date, `run-${stamp}`);
const artifactsDir = join(runDir, "artifacts");

mkdirSync(artifactsDir, { recursive: true });

const run = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["playwright", "test", "--reporter=list,html"],
  { encoding: "utf8" }
);

writeFileSync(join(runDir, "playwright.stdout.log"), run.stdout || "");
writeFileSync(join(runDir, "playwright.stderr.log"), run.stderr || "");

if (existsSync("playwright-report")) {
  cpSync("playwright-report", join(artifactsDir, "playwright-report"), { recursive: true });
}
if (existsSync("test-results")) {
  cpSync("test-results", join(artifactsDir, "test-results"), { recursive: true });
}

const summary = {
  date,
  runDir,
  command: "npx playwright test --reporter=list,html",
  exitCode: run.status ?? 1,
  hasPlaywrightReport: existsSync(join(artifactsDir, "playwright-report")),
  hasTestResults: existsSync(join(artifactsDir, "test-results")),
  generatedAt: new Date().toISOString(),
};

writeFileSync(join(runDir, "summary.json"), JSON.stringify(summary, null, 2));

if (run.status !== 0) {
  console.error(`E2E run failed. Evidence bundle written to ${runDir}`);
  process.exit(run.status ?? 1);
}

console.log(`E2E run passed. Evidence bundle written to ${runDir}`);
