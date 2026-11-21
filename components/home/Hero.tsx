import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { HeroStage } from "./HeroStage";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-ink text-white">
      {/* soft glow + yellow stripe echo the pack system */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_40%,#1A487B_0%,transparent_70%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1.5 bg-chef" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-6 pt-7 md:px-6 md:pb-10 md:pt-10 lg:grid-cols-12 lg:gap-6 lg:pb-16 lg:pt-16">
        <div className="lg:col-span-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-chef sm:text-xs sm:tracking-[0.2em]">Kenya · Uganda · Rwanda · since 2009</p>
          <h1 id="hero-title" className="mt-3 text-balance text-[1.85rem] min-[400px]:text-[2.1rem] font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            Bakery ingredients for Kenya, Uganda and Rwanda
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/80 min-[400px]:text-base sm:mt-4 sm:text-lg">
            Bread improvers, premixes, chocolates and bakery supplies for commercial bakeries, cafés, food manufacturers and
            wholesalers. Order online or talk to our team in your country.
          </p>
          <div className="mt-5 flex flex-col flex-wrap gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <Link
              href="/wholesale"
              className="group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-chef px-6 font-semibold text-ink transition hover:bg-chef-tint"
            >
              Request wholesale pricing
              <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://bakeshed.rw"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 font-semibold ring-1 ring-white/35 transition hover:bg-white/10"
            >
              Shop on Bakeshed <span aria-hidden>↗</span>
              <span className="sr-only">(opens bakeshed.rw in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
