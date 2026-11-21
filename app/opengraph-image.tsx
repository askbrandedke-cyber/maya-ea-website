import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Maya E.A. Limited: bakery ingredients for Kenya, Uganda and Rwanda";

export default function Image() {
  return ogImage({
    eyebrow: "Bakery ingredients & food additives",
    title: "Bakery ingredients for Kenya, Uganda and Rwanda",
    subtitle: "Bread improvers, premixes, chocolates and bakery supplies for commercial bakers.",
  });
}
