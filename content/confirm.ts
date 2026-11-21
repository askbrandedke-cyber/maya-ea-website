/**
 * Placeholder helper. Any text produced by `confirm()` renders as a visible
 * "[CONFIRM: …]" marker on the site and on label artwork, and is listed in PLACEHOLDERS.md.
 */
export const CONFIRM_PREFIX = "[CONFIRM: ";

export function confirm(what: string): string {
  return `${CONFIRM_PREFIX}${what}]`;
}

export function isConfirm(text: string | undefined): boolean {
  return !!text && text.startsWith(CONFIRM_PREFIX);
}
