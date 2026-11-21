import type { IconName } from "../../content/types";

/**
 * Category icons, drawn on a 100×100 grid with a 6-unit round stroke.
 * They are also exported to /public/packaging/icons for use on the site.
 */
export const icons: Record<IconName, string> = {
  "loaf-rise":
    '<path d="M14 72C14 50 30 42 50 42S86 50 86 72Z"/><path d="M36 54l6 9M50 52l6 9M64 54l6 9"/><path d="M50 32V8M41 17l9-9 9 9"/><path d="M8 82h84"/>',
  wheat:
    '<path d="M50 94V22"/><path d="M50 22c-4-6-4-12 0-18 4 6 4 12 0 18Z"/>' +
    [34, 50, 66]
      .map(
        (y) =>
          `<path d="M50 ${y}c-12-2-18-10-18-18 10 2 18 10 18 18Z"/><path d="M50 ${y}c12-2 18-10 18-18-10 2-18 10-18 18Z"/>`,
      )
      .join(""),
  "cake-slice":
    '<path d="M12 58L88 42 66 26Z"/><path d="M12 58v22h76V42"/><path d="M12 69l76-14"/><circle cx="66" cy="18" r="6"/>',
  "cake-board":
    '<ellipse cx="50" cy="52" rx="40" ry="16"/><ellipse cx="50" cy="52" rx="26" ry="9"/><path d="M10 52v8c0 9 18 16 40 16s40-7 40-16v-8"/>',
  "cake-box":
    '<path d="M16 46h68v40H16z"/><path d="M10 34h80v12H10z"/><path d="M34 58h32v16H34z"/><path d="M50 34V22"/><path d="M50 22c-10-10-20-4-12 2zM50 22c10-10 20-4 12 2z"/>',
  "choc-bar":
    '<rect x="20" y="12" width="60" height="76" rx="6"/><path d="M40 12v76M60 12v76M20 31h60M20 50h60M20 69h60"/>',
  cherries:
    '<path d="M30 58c6-20 16-34 30-44M70 58c-4-18-8-30-10-44"/><path d="M60 14c10-8 22-6 26 0-8 6-18 6-26 0Z"/><circle cx="30" cy="70" r="14"/><circle cx="70" cy="70" r="14"/>',
  "bowl-whisk":
    '<path d="M10 52h80c0 20-18 34-40 34S10 72 10 52Z"/><path d="M58 46c-10-12-6-24 4-26 10 2 10 16-4 26Z"/><path d="M64 20 78 4"/>',
  droplet:
    '<path d="M50 8S20 44 20 64a30 30 0 0 0 60 0C80 44 50 8 50 8Z"/><path d="M36 66c0 8 6 12 12 12"/>',
  "piping-bag":
    '<path d="M18 14c12 16 52 16 64 0L56 72H44Z"/><path d="M44 72l3 16h6l3-16"/><path d="M34 32l10 10"/>',
  shield: '<path d="M50 8l34 12v26c0 22-16 38-34 46-18-8-34-24-34-46V20Z"/><path d="M34 50l12 12 22-24"/>',
  seeds:
    '<ellipse cx="32" cy="38" rx="11" ry="20" transform="rotate(-30 32 38)"/><ellipse cx="68" cy="38" rx="11" ry="20" transform="rotate(30 68 38)"/><ellipse cx="50" cy="72" rx="11" ry="20"/><path d="M50 60v24"/>',
  sprinkles:
    '<path d="M18 24l14 6M60 14l4 16M76 40l14-10M26 54l-6 16M46 50l14 8M70 66l14 6M38 80l14 6M10 42h4"/>',
  "paper-case":
    '<path d="M8 40h84"/><path d="M14 40l10 48h52l10-48"/><path d="M30 40l6 48M44 40l3 48M56 40l-3 48M70 40l-6 48"/>',
};

export function iconSvg(name: IconName, opts: { x: number; y: number; size: number; colour: string; opacity?: number; stroke?: number }) {
  const s = opts.size / 100;
  return `<g transform="translate(${opts.x} ${opts.y}) scale(${s})" fill="none" stroke="${opts.colour}" stroke-width="${opts.stroke ?? 6}" stroke-linecap="round" stroke-linejoin="round" opacity="${opts.opacity ?? 1}">${icons[name]}</g>`;
}
