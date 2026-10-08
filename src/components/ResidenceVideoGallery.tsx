import { PortraitVideo, Reveal } from "@/components/VideoPanel";

export type ResidenceClip = {
  id: string;
  title: string;
  meta: string;
  blurb: string;
  src: string;
  poster: string;
  ariaLabel: string;
};

export function CoolVideoCard({
  clip,
  delay = 0,
  className = "",
}: {
  clip: ResidenceClip;
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal
      delay={delay}
      className={`video-card group relative overflow-hidden rounded-[1.75rem] border border-border bg-card ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-end p-4">
        <span className="rounded-full border border-highlight/40 bg-highlight/15 px-3 py-1.5 text-[0.68rem] font-semibold tracking-wide text-highlight">
          {clip.meta}
        </span>
      </div>

      <div className="relative aspect-[9/16] bg-black/70">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
        <PortraitVideo
          className="h-full w-full"
          src={clip.src}
          poster={clip.poster}
          ariaLabel={clip.ariaLabel}
        />
      </div>

      <div className="relative z-10 -mt-16 border-t border-white/10 bg-card p-5 sm:p-6">
        <h4 className="font-display text-xl font-medium leading-snug text-foreground">
          {clip.title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{clip.blurb}</p>
      </div>
    </Reveal>
  );
}

export function ResidenceVideoGallery({ clips }: { clips: ResidenceClip[] }) {
  return (
    <div className="mt-16">
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Residence film strip</p>
          <h3 className="mt-2 font-display text-2xl font-medium sm:text-3xl">
            Rooms, hostels & stays
          </h3>
        </div>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((clip, index) => (
          <CoolVideoCard key={clip.id} clip={clip} delay={index * 90} />
        ))}
      </div>
    </div>
  );
}
