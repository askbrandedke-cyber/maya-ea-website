import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center md:py-32">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-navy">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4 text-lg text-ink/75">The link may be old or mistyped. Try the products page, or contact the team in your country.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white">
          Browse products
        </Link>
        <Link href="/contact" className="inline-flex min-h-12 items-center rounded-full px-6 font-semibold ring-1 ring-ink/25">
          Contact us
        </Link>
      </div>
    </section>
  );
}
