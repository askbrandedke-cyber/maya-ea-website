import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/brand";

/** Maya logo, unchanged, on a white plate (it is designed for light backgrounds). */
export function Logo({ height = 48, link = true }: { height?: number; link?: boolean }) {
  const w = Math.round((height - 8) * (brand.logo.width / brand.logo.height)) + 8;
  const img = (
    <span className="inline-flex items-center justify-center rounded-lg bg-white p-1" style={{ width: w, height }}>
      <Image src={brand.logo.src} alt={link ? `${brand.name}, home` : brand.logo.alt} width={w - 8} height={height - 8} priority />
    </span>
  );
  return link ? (
    <Link href="/" className="inline-flex rounded-lg">
      {img}
    </Link>
  ) : (
    img
  );
}
