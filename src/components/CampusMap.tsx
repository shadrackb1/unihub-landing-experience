import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CampusPin = {
  id: string;
  code: string;
  name: string;
  town: string;
  lng: number;
  lat: number;
};

export const campusPins: CampusPin[] = [
  { id: "uon", code: "UoN", name: "University of Nairobi", town: "Nairobi", lng: 36.814, lat: -1.279 },
  { id: "jkuat", code: "JKUAT", name: "Jomo Kenyatta University", town: "Juja", lng: 37.015, lat: -1.093 },
  { id: "ku", code: "KU", name: "Kenyatta University", town: "Kahawa", lng: 36.927, lat: -1.174 },
  { id: "su", code: "SU", name: "Strathmore University", town: "Madaraka", lng: 36.813, lat: -1.31 },
  { id: "thika", code: "THK", name: "Thika student belt", town: "Thika", lng: 37.069, lat: -1.033 },
  { id: "mu", code: "MU", name: "Moi University", town: "Kesses", lng: 35.335, lat: 0.295 },
  { id: "egu", code: "EGU", name: "Egerton University", town: "Njoro", lng: 35.944, lat: -0.366 },
  { id: "nku", code: "NKU", name: "Nakuru campus belt", town: "Nakuru", lng: 36.08, lat: -0.303 },
];

type BasemapId = "dark" | "satellite";

/** Free providers. No API keys. Attribution required in UI. */
const BASEMAPS: Record<
  BasemapId,
  {
    label: string;
    attribution: string;
    style: Record<string, unknown>;
  }
> = {
  dark: {
    label: "Dark",
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://openfreemap.org/">OpenFreeMap</a>',
    // Vector style from OpenFreeMap (free, keyless)
    style: "https://tiles.openfreemap.org/styles/dark",
  },
  satellite: {
    label: "Satellite",
    attribution:
      'Imagery © <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
    style: {
      version: 8,
      name: "Esri World Imagery",
      sources: {
        esri: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution:
            'Imagery © <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "esri-imagery",
          type: "raster",
          source: "esri",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
};

function markerEl(pin: CampusPin) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "unihub-map-marker";
  el.setAttribute("aria-label", `${pin.name} in ${pin.town}`);
  el.innerHTML = `
    <span class="unihub-map-marker__dot" aria-hidden="true"></span>
    <span class="unihub-map-marker__label">${pin.code}<em>${pin.town}</em></span>
  `;
  return el;
}

export function CampusMap({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [basemap, setBasemap] = useState<BasemapId>("dark");
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    void (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      await import("maplibre-gl/dist/maplibre-gl.css");
      if (cancelled || !container) return;

      const cfg = BASEMAPS.dark;
      const map = new maplibregl.Map({
        container,
        style: cfg.style as never,
        center: [36.5, -0.7],
        zoom: 5.6,
        pitch: 28,
        bearing: -8,
        maxPitch: 55,
        attributionControl: false,
      });
      mapRef.current = map;

      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );
      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right",
      );

      const bounds = new maplibregl.LngLatBounds();

      campusPins.forEach((pin) => {
        const el = markerEl(pin);
        const popup = new maplibregl.Popup({
          offset: 18,
          closeButton: true,
          className: "unihub-map-popup",
        }).setHTML(
          `<div class="unihub-map-popup__inner">
            <p class="unihub-map-popup__code">${pin.code}</p>
            <p class="unihub-map-popup__title">${pin.name}</p>
            <p class="unihub-map-popup__town">${pin.town}</p>
          </div>`,
        );

        new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([pin.lng, pin.lat])
          .setPopup(popup)
          .addTo(map);

        bounds.extend([pin.lng, pin.lat]);
      });

      map.on("load", () => {
        map.fitBounds(bounds, {
          padding: { top: 48, bottom: 72, left: 40, right: 40 },
          duration: 0,
          maxZoom: 8.2,
        });
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const cfg = BASEMAPS[basemap];
    map.setStyle(cfg.style as never);
    map.once("style.load", () => {
      map.resize();
    });
  }, [basemap]);

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex gap-2">
        {(Object.keys(BASEMAPS) as BasemapId[]).map((id) => {
          const active = basemap === id;
          return (
            <button
              key={id}
              type="button"
              className={cn(
                "pointer-events-auto rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] backdrop-blur-md transition-colors",
                active
                  ? "border-highlight/50 bg-highlight/20 text-foreground"
                  : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setBasemap(id)}
              aria-pressed={active}
            >
              {BASEMAPS[id].label}
            </button>
          );
        })}
      </div>
      <div
        ref={containerRef}
        className="unihub-map min-h-[28rem] overflow-hidden rounded-3xl border border-border bg-card"
        role="region"
        aria-label="Campus housing map of Kenya"
      />
      <p className="sr-only">{BASEMAPS[basemap].attribution.replace(/<[^>]+>/g, "")}</p>
    </div>
  );
}
