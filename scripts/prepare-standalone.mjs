import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

// Vercel builds skip standalone output, so there is nothing to prepare there.
if (process.env.VERCEL) {
  console.log("Vercel build detected; skipping standalone preparation.");
  process.exit(0);
}

const projectRoot = process.cwd();
const standaloneRoot = path.join(projectRoot, ".next", "standalone");
const standaloneNext = path.join(standaloneRoot, ".next");

await mkdir(standaloneNext, { recursive: true });
await cp(path.join(projectRoot, "public"), path.join(standaloneRoot, "public"), {
  recursive: true,
  force: true,
});
await cp(path.join(projectRoot, ".next", "static"), path.join(standaloneNext, "static"), {
  recursive: true,
  force: true,
});

console.log("Prepared .next/standalone with public and static assets.");
