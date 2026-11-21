/** Fails if any route title/description is duplicated or too long. `npm run check:meta` */
import { allRoutes } from "../content/site";
const SUFFIX = " | Maya E.A. Limited";
let bad = 0;
const seen = new Map<string, string>();
for (const r of allRoutes) {
  const full = r.path === "/" ? `Maya E.A. Limited | ${r.title}` : r.title + SUFFIX;
  const issues = [];
  if (full.length > 65) issues.push(`title ${full.length}`);
  if (r.description.length > 160 || r.description.length < 70) issues.push(`desc ${r.description.length}`);
  for (const k of [r.title, r.description]) { if (seen.has(k)) issues.push(`dup of ${seen.get(k)}`); seen.set(k, r.path); }
  if (issues.length) { bad++; console.log(r.path.padEnd(48), issues.join(", "), "|", full); }
}
console.log(`${allRoutes.length} routes, ${bad} with issues`);
process.exit(bad ? 1 : 0);
