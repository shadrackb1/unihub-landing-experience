type VideoPanelProps = {
  src: string;
  poster: string;
  title: string;
  description: string;
  eyebrow?: string;
  id?: string;
};

export function VideoPanel({
  src,
  poster,
  title,
  description,
  eyebrow,
  id,
}: VideoPanelProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-video bg-black/60">
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={title}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </div>
      <div className="p-6 sm:p-7">
        {eyebrow ? (
          <p id={id} className="eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-2 font-display text-2xl font-medium">{title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
