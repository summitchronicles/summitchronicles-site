import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  siteWireframeCategories,
  siteWireframes,
} from '@/app/components/wireframes/site-wireframes';

export default function WireframesIndexPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden px-6 pt-28">
        <div className="absolute inset-0">
          <Image
            src="/images/sunith-home-hero.jpg"
            alt="Wireframe gallery"
            fill
            priority
            className="object-cover object-center opacity-18"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.78)_56%,rgba(5,5,5,0.98)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl pb-24 pt-10 md:pb-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.26em] text-zinc-400 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-summit-gold" />
            Site Wireframes
          </div>

          <div className="mt-10 text-[10px] font-mono uppercase tracking-[0.32em] text-summit-gold/85">
            Apple discipline // Summit Chronicles atmosphere
          </div>

          <h1 className="mt-6 max-w-5xl font-oswald text-[15vw] uppercase leading-[0.9] tracking-[-0.06em] text-white md:text-[110px]">
            World-Class
            <br />
            Page System
          </h1>

          <p className="mt-8 max-w-[44rem] text-[17px] leading-[1.85] text-zinc-300 md:text-[20px]">
            These wireframes apply the same quieter philosophy across the public
            site: fewer surfaces, stronger hierarchy, cleaner typography, and
            more disciplined sequence. Admin, dashboard, CMS, studio, auth, and
            editing routes are intentionally excluded from this gallery because
            they need product workflows, not brand-page treatment.
          </p>
        </div>
      </section>

      {siteWireframeCategories.map((category) => {
        const pages = siteWireframes.filter((page) => page.category === category);
        if (pages.length === 0) {
          return null;
        }

        return (
          <section
            key={category}
            className="border-t border-white/8 px-6 py-20"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                <span className="h-px w-8 bg-white/12" />
                <span>{category}</span>
              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {pages.map((page) => (
                  <article
                    key={page.slug}
                    className="border-t border-white/10 pt-6"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                          {page.actualRoute}
                        </div>
                        <h2 className="mt-4 font-oswald text-3xl uppercase leading-[0.95] tracking-[-0.03em] text-white md:text-4xl">
                          {page.name}
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-[1.85] text-zinc-400">
                          {page.description}
                        </p>
                      </div>

                      <div className="hidden text-right text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-600 md:block">
                        {page.hero.metrics[0]?.value}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href={`/wireframes/${page.slug}`}
                        className="inline-flex items-center gap-2 border border-summit-gold/40 bg-summit-gold px-5 py-3 text-[10px] font-mono uppercase tracking-[0.28em] text-black transition-transform hover:translate-y-[-1px]"
                      >
                        Open Preview
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={page.actualRoute === '/blog/[slug]' ? '/blog' : page.actualRoute}
                        className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-[10px] font-mono uppercase tracking-[0.28em] text-white transition-colors hover:border-white/20"
                      >
                        Open Live Route
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
