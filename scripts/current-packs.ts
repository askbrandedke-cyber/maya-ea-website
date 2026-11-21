/**
 * Converts downloaded current pack photos (from bakeshed.rw) to 800px WebP in /public/current-packs.
 *   npx tsx scripts/current-packs.ts <download-dir>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const src = process.argv[2];
(async () => {
  for (const f of fs.readdirSync(src)) {
    const slug = f.replace(/\.[^.]+$/, "");
    await sharp(path.join(src, f)).resize(800, 800, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" }).webp({ quality: 78 }).toFile(`public/current-packs/${slug}.webp`);
  }
  console.log("done", fs.readdirSync("public/current-packs").length);
})();
