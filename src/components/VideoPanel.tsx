import { useEffect, useRef } from "react";

type VideoPanelProps = {
  src: string;
  poster: string;
  title: string;
  description: string;
  eyebrow?: string;
  id?: string;
};

function useRespectReducedMotion() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) {
        video.pause();
        return;
      }
      video.muted = true;
      void video.play().catch(() => {});
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return ref;
}

export function VideoPanel({
  src,
  poster,
  title,
  description,
  eyebrow,
  id,
}: VideoPanelProps) {
  const videoRef = useRespectReducedMotion();

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-video bg-black/60">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls
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

export function PortraitVideo({
  src,
  poster,
  ariaLabel,
  className = "",
}: {
  src: string;
  poster: string;
  ariaLabel: string;
  className?: string;
}) {
  const videoRef = useRespectReducedMotion();

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="metadata"
      poster={poster}
      aria-label={ariaLabel}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
  );
}
