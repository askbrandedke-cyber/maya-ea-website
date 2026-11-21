import { mapCountries, mapHubs, mapViewBox } from "@/content/map.generated";
import type { Office } from "@/content/types";

/** Static (server-rendered) map with one country highlighted. No JS, no map service. */
export function CountryMap({ code, city }: { code: Office["countryCode"]; city: string }) {
  const [x, y] = mapHubs[code];
  return (
    <svg viewBox={`0 0 ${mapViewBox.w} ${mapViewBox.h}`} className="h-auto w-full" role="img" aria-label={`Map of East Africa with ${city} marked`}>
      {mapCountries.map((c) => (
        <path key={c.id} d={c.d} fill={c.id === code ? "#1A487B" : c.focus ? "#9FB3CB" : "#E7E1D3"} stroke="#FBF8F1" strokeWidth={1.2} />
      ))}
      <circle cx={x} cy={y} r={18} fill="#FCEA00" opacity={0.35} />
      <circle cx={x} cy={y} r={9} fill="#FCEA00" stroke="#0D2036" strokeWidth={4} />
      <g transform={`translate(${x + 16} ${y - 14})`}>
        <rect width={city.length * 13 + 24} height={34} rx={17} fill="#0D2036" />
        <text x={12} y={23} fill="#FFFFFF" fontSize={18} fontWeight={600} fontFamily="var(--font-poppins), sans-serif">
          {city}
        </text>
      </g>
    </svg>
  );
}
