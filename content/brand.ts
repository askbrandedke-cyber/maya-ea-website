/** Brand tokens taken from mayaealtd.com CSS and logo. */
export const brand = {
  name: "Maya E.A. Limited",
  legalName: "MAYA E.A. LIMITED",
  tagline: "Manufacturer & distributor of food ingredients & additives",
  rangeName: "Bakeshed",
  founded: 2009,
  colours: {
    navy: "#1A487B",
    navyDeep: "#163C67",
    ink: "#0D2036",
    night: "#061220",
    yellow: "#FCEA00",
    yellowTint: "#FFF666",
    red: "#DD2831",
    paper: "#FFFEF2",
    mist: "#F8FAFC",
  },
  font: "Poppins",
  logo: {
    src: "/brand/maya-logo.png",
    width: 628,
    height: 719,
    alt: "Maya E.A. Limited logo: chef mascot in a navy roundel",
  },
} as const;

/** Mandatory on every concept pack, in every medium. Do not edit without client approval. */
export const CONCEPT_TAG = "Concept packaging by BRANDED — proposal only";

/** Base URL used in pack QR codes and canonical URLs. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mayaealtd.com";
