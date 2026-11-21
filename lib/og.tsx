/* eslint-disable @next/next/no-img-element -- next/og (Satori) renders plain <img>, not next/image */
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { brand, CONCEPT_TAG } from "@/content/brand";

/** Shared Open Graph renderer (1200×630). Runs at build time (static routes). */
export const ogSize = { width: 1200, height: 630 };

const font = (w: string) => fs.readFileSync(path.join(process.cwd(), `node_modules/@expo-google-fonts/poppins/Poppins_${w}.ttf`));
const fonts = [
  { name: "Poppins", data: font("500Medium"), weight: 500 as const, style: "normal" as const },
  { name: "Poppins", data: font("700Bold"), weight: 700 as const, style: "normal" as const },
];

const dataUrl = async (publicPath: string, width: number) => {
  const buf = await sharp(path.join(process.cwd(), "public", publicPath)).resize({ width }).png().toBuffer();
  return `data:image/png;base64,${buf.toString("base64")}`;
};

export async function ogImage(o: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  bg?: string;
  ink?: string;
  /** Public paths of concept pack textures to show on the right. */
  packs?: string[];
  concept?: boolean;
}) {
  const bg = o.bg ?? brand.colours.ink;
  const ink = o.ink ?? "#FFFFFF";
  const logo = await dataUrl(brand.logo.src, 140);
  const packs = await Promise.all((o.packs ?? []).slice(0, 3).map((p) => dataUrl(p, 300)));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: bg, color: ink, fontFamily: "Poppins", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, background: brand.colours.yellow, display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 0 64px 64px", width: packs.length ? 680 : 1080 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 16, padding: 10 }}>
              <img src={logo} width={92} height={105} alt="" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{brand.name}</div>
              <div style={{ fontSize: 20, fontWeight: 500, opacity: 0.85 }}>{`Kenya · Uganda · Rwanda · since ${brand.founded}`}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: bg === brand.colours.ink ? brand.colours.yellow : ink, opacity: 0.95 }}>{o.eyebrow}</div>
            <div style={{ fontSize: o.title.length > 38 || (packs.length > 1 && o.title.length > 22) ? 54 : 72, fontWeight: 700, lineHeight: 1.05, marginTop: 12, letterSpacing: -1 }}>{o.title}</div>
            {o.subtitle && <div style={{ fontSize: 26, fontWeight: 500, marginTop: 18, opacity: 0.9, lineHeight: 1.3 }}>{o.subtitle}</div>}
          </div>
          {o.concept ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#061220", color: "#FFFFFF", borderRadius: 999, padding: "10px 20px", fontSize: 20, fontWeight: 500, alignSelf: "flex-start" }}>
              <div style={{ width: 16, height: 16, background: brand.colours.yellow, borderRadius: 4, display: "flex" }} />
              {CONCEPT_TAG}
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
        </div>
        {packs.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, gap: 14, paddingRight: 40 }}>
            {packs.map((src, i) => (
              <img
                key={i}
                src={src}
                width={packs.length === 1 ? 300 : 150}
                height={packs.length === 1 ? 420 : 210}
                style={{ borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.45)", marginTop: packs.length === 3 && i !== 1 ? 60 : 0 }}
                alt=""
              />
            ))}
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts },
  );
}
