import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { TrainingRedesignPrototype } from '@/app/components/training/TrainingRedesignPrototype';
import { cn } from '@/lib/utils';
import type {
  WireframePageDefinition,
  WireframeSection,
} from './site-wireframes';

export function SiteWireframePreview({
  page,
  previousPage,
  nextPage,
}: {
  page: WireframePageDefinition;
  previousPage?: WireframePageDefinition;
  nextPage?: WireframePageDefinition;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PreviewTopBar
        page={page}
        previousPage={previousPage}
        nextPage={nextPage}
      />

      {page.slug === 'training' ? (
        <TrainingRedesignPrototype />
      ) : (
        <GenericWireframePage page={page} />
      )}
    </div>
  );
}

function PreviewTopBar({
  page,
  previousPage,
  nextPage,
}: {
  page: WireframePageDefinition;
  previousPage?: WireframePageDefinition;
  nextPage?: WireframePageDefinition;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/wireframes"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Wireframes
          </Link>
          <div className="hidden h-4 w-px bg-white/10 md:block" />
          <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
            {page.category}
          </div>
        </div>

        <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-white">
          {page.name}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href={page.actualRoute === '/blog/[slug]' ? '/blog' : page.actualRoute}
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-400 transition-colors hover:text-summit-gold"
          >
            Open Live Route
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {previousPage ? (
            <Link
              href={`/wireframes/${previousPage.slug}`}
              className="hidden text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500 transition-colors hover:text-white md:block"
            >
              Prev
            </Link>
          ) : null}
          {nextPage ? (
            <Link
              href={`/wireframes/${nextPage.slug}`}
              className="hidden text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500 transition-colors hover:text-white md:block"
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GenericWireframePage({ page }: { page: WireframePageDefinition }) {
  return (
    <>
      <section className="relative overflow-hidden px-6 pt-28">
        <div className="absolute inset-0">
          <Image
            src={page.hero.image}
            alt={page.name}
            fill
            priority
            className="object-cover object-center opacity-22"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.76)_56%,rgba(5,5,5,0.98)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl pb-24 pt-10 md:pb-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.26em] text-zinc-400 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-summit-gold" />
              {page.hero.eyebrow}
            </div>

            <div className="mt-10 text-[10px] font-mono uppercase tracking-[0.32em] text-summit-gold/85">
              {page.actualRoute}
            </div>

            <h1 className="mt-6 max-w-5xl font-oswald text-[16vw] uppercase leading-[0.9] tracking-[-0.06em] text-white md:text-[120px]">
              {page.hero.title}
            </h1>

            <p className="mt-8 max-w-[42rem] text-[17px] leading-[1.85] text-zinc-300 md:text-[20px]">
              {page.hero.description}
            </p>
          </div>

          <div className="mt-16 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
            {page.hero.metrics.map((metric) => (
              <QuietStat
                key={metric.label}
                label={metric.label}
                value={metric.value}
                note={metric.note}
              />
            ))}
          </div>
        </div>
      </section>

      {page.sections.map((section, index) => (
        <RenderSection
          key={`${page.slug}-${index}`}
          section={section}
          first={index === 0}
        />
      ))}
    </>
  );
}

function RenderSection({
  section,
  first,
}: {
  section: WireframeSection;
  first: boolean;
}) {
  switch (section.type) {
    case 'narrative':
      return (
        <section className={cn('px-6 py-24', first ? 'border-t border-white/8' : 'border-t border-white/8')}>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_320px]">
            <div>
              <SectionEyebrow label={section.eyebrow} />
              <h2 className="mt-6 max-w-3xl font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
                {section.title}
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-[1.9] text-zinc-300 md:text-lg">
                {section.body}
              </p>
            </div>

            <div className="space-y-8 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {section.metrics?.map((metric) => (
                <QuietStat
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  note={metric.note}
                />
              ))}
              {section.sideNotes?.map((note) => (
                <p
                  key={note}
                  className="text-sm leading-[1.85] text-zinc-500"
                >
                  {note}
                </p>
              ))}
            </div>
          </div>
        </section>
      );

    case 'grid':
      return (
        <section className="border-t border-white/8 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionEyebrow label={section.eyebrow} />
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="max-w-3xl font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
                  {section.body}
                </p>
              </div>
            </div>

            <div
              className={cn(
                'mt-14 grid gap-8 border-t border-white/10 pt-8',
                section.columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
              )}
            >
              {section.items.map((item) => (
                <div key={item.title} className="space-y-4">
                  {item.kicker ? (
                    <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-summit-gold/80">
                      {item.kicker}
                    </div>
                  ) : null}
                  <h3 className="font-oswald text-2xl uppercase leading-[0.95] tracking-[-0.02em] text-white md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.85] text-zinc-400">
                    {item.body}
                  </p>
                  {item.meta ? (
                    <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-600">
                      {item.meta}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'list':
      return (
        <section className="border-t border-white/8 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionEyebrow label={section.eyebrow} />
            <h2 className="mt-6 max-w-3xl font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
              {section.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
              {section.body}
            </p>

            <div className="mt-14 border-t border-white/10">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-4 border-b border-white/8 py-6 md:grid-cols-[160px_minmax(0,1fr)_140px]"
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                    {item.kicker || item.meta || 'Module'}
                  </div>
                  <div>
                    <h3 className="font-oswald text-2xl uppercase leading-[0.95] tracking-[-0.02em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-[1.85] text-zinc-400">
                      {item.body}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-600 md:text-right">
                    {item.meta || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'timeline':
      return (
        <section className="border-t border-white/8 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionEyebrow label={section.eyebrow} />
            <h2 className="mt-6 max-w-3xl font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
              {section.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
              {section.body}
            </p>

            <div className="mt-14 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
              {section.items.map((item) => (
                <div key={item.title} className="relative pl-6">
                  <div className="absolute left-0 top-1 h-full w-px bg-white/10" />
                  <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-summit-gold" />
                  <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                    {item.label}
                  </div>
                  <h3 className="mt-4 font-oswald text-2xl uppercase leading-[0.95] tracking-[-0.02em] text-white md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-[1.85] text-zinc-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'legal':
      return (
        <section className="border-t border-white/8 px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionEyebrow label={section.eyebrow} />
            <h2 className="mt-6 max-w-3xl font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
              {section.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
              {section.body}
            </p>

            <div className="mt-14 space-y-10 border-t border-white/10 pt-8">
              {section.items.map((item) => (
                <div key={item.title}>
                  <h3 className="font-oswald text-2xl uppercase leading-[0.95] tracking-[-0.02em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-3xl text-sm leading-[1.9] text-zinc-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="border-t border-white/8 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <h2 className="font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
                {section.title}
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-[1.9] text-zinc-400 md:text-lg">
                {section.body}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="border border-summit-gold/40 bg-summit-gold px-6 py-4 text-[10px] font-mono uppercase tracking-[0.28em] text-black transition-transform hover:translate-y-[-1px]">
                {section.primaryLabel}
              </button>
              {section.secondaryLabel ? (
                <button className="border border-white/10 px-6 py-4 text-[10px] font-mono uppercase tracking-[0.28em] text-white transition-colors hover:border-white/20">
                  {section.secondaryLabel}
                </button>
              ) : null}
            </div>
          </div>
        </section>
      );
  }
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
      <span className="h-px w-8 bg-white/12" />
      <span>{label}</span>
    </div>
  );
}

function QuietStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
        {label}
      </div>
      <div className="mt-3 font-oswald text-2xl uppercase leading-none text-white md:text-3xl">
        {value}
      </div>
      {note ? (
        <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-600">
          {note}
        </div>
      ) : null}
    </div>
  );
}
