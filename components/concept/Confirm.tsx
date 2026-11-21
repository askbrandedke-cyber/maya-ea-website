/** Visible [CONFIRM: …] placeholder (listed in PLACEHOLDERS.md). Same style as on the label artwork. */
export function Confirm({ text, as: Tag = "span", className = "" }: { text: string; as?: "span" | "div" | "p"; className?: string }) {
  return (
    <Tag
      className={`inline-block rounded-md border-[1.5px] border-dashed border-placeholder bg-[#FFF5F5] px-2 py-0.5 text-[0.85em] font-medium text-placeholder ${className}`}
      data-confirm
    >
      {text}
    </Tag>
  );
}
