import path from "node:path";
import opentype from "opentype.js";

/**
 * Text → SVG path outlines (Poppins), so label SVGs need no font files and render
 * the same in browsers, Illustrator, resvg and as WebGL textures.
 */
const dir = path.join(process.cwd(), "node_modules/@expo-google-fonts/poppins");
const load = (f: string) => opentype.loadSync(path.join(dir, f));

export const fonts = {
  regular: load("Poppins_400Regular.ttf"),
  medium: load("Poppins_500Medium.ttf"),
  semibold: load("Poppins_600SemiBold.ttf"),
  bold: load("Poppins_700Bold.ttf"),
};
export type Weight = keyof typeof fonts;

export interface TextOpts {
  weight?: Weight;
  size: number;
  fill: string;
  tracking?: number; // extra space between letters, in units
  anchor?: "start" | "middle" | "end";
  opacity?: number;
}

/** Poppins lacks a few glyphs; map them to safe equivalents. */
const sanitize = (s: string) => s.replace(/″/g, '"').replace(/→/g, ">");

export function measure(text: string, o: Pick<TextOpts, "weight" | "size" | "tracking">) {
  const f = fonts[o.weight ?? "regular"];
  const scale = o.size / f.unitsPerEm;
  const glyphs = f.stringToGlyphs(sanitize(text));
  let w = 0;
  glyphs.forEach((g, i) => {
    w += (g.advanceWidth ?? 0) * scale + (o.tracking ?? 0);
    if (i < glyphs.length - 1) w += f.getKerningValue(g, glyphs[i + 1]) * scale;
  });
  return w - (glyphs.length ? (o.tracking ?? 0) : 0);
}

export function text(str: string, x: number, y: number, o: TextOpts): string {
  const f = fonts[o.weight ?? "regular"];
  const scale = o.size / f.unitsPerEm;
  const w = measure(str, o);
  let cx = o.anchor === "middle" ? x - w / 2 : o.anchor === "end" ? x - w : x;
  const glyphs = f.stringToGlyphs(sanitize(str));
  let d = "";
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, o.size).toPathData(1);
    cx += (g.advanceWidth ?? 0) * scale + (o.tracking ?? 0);
    if (i < glyphs.length - 1) cx += f.getKerningValue(g, glyphs[i + 1]) * scale;
  });
  if (!d) return "";
  return `<path d="${d}" fill="${o.fill}"${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ""}/>`;
}

/** Greedy word wrap. */
export function wrap(str: string, maxWidth: number, o: Pick<TextOpts, "weight" | "size" | "tracking">): string[] {
  const words = str.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (line && measure(test, o) > maxWidth) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/** Largest size (stepping down) at which `str` fits in `maxLines` lines and every line fits. */
export function fit(str: string, maxWidth: number, maxLines: number, o: { weight: Weight; from: number; to: number; tracking?: number }) {
  for (let size = o.from; size >= o.to; size -= 2) {
    const lines = wrap(str, maxWidth, { ...o, size });
    if (lines.length <= maxLines && lines.every((l) => measure(l, { ...o, size }) <= maxWidth)) return { size, lines };
  }
  return { size: o.to, lines: wrap(str, maxWidth, { ...o, size: o.to }) };
}

/** Multi-line block; returns svg and the y after the last line. */
export function block(lines: string[], x: number, y: number, lineHeight: number, o: TextOpts) {
  return {
    svg: lines.map((l, i) => text(l, x, y + i * lineHeight, o)).join(""),
    end: y + (lines.length - 1) * lineHeight,
  };
}
