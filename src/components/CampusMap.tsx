import { useEffect, useRef } from "react";

export type CampusPin = {
  id: string;
  code: string;
  name: string;
  town: string;
  lng: number;
  lat: number;
};

/** Approximate campus-area pins for Kenya student housing search. */
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: import("maplibre-gl").Map | null = null;
    let cancelled = false;

    void (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      await import("maplibre-gl/dist/maplibre-gl.css");
      if (cancelled || !container) return;

      map = new maplibregl.Map({
        container,
        style: {
          version: 8,
          name: "UniHub dark",
          sources: {
            carto: {
              type: "raster",
              tiles: [
                "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          layers: [
            {
              id: "carto-dark",
              type: "raster",
              source: "carto",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [36.5, -0.7],
        zoom: 5.6,
        pitch: 28,
        bearing: -8,
        maxPitch: 55,
        attributionControl: false,
      });

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
          .addTo(map!);

        bounds.extend([pin.lng, pin.lat]);
      });

      map.on("load", () => {
        map?.fitBounds(bounds, {
          padding: { top: 48, bottom: 72, left: 40, right: 40 },
          duration: 0,
          maxZoom: 8.2,
        });
      });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`unihub-map relative min-h-[28rem] overflow-hidden rounded-3xl border border-border bg-card ${className}`}
      role="region"
      aria-label="Campus housing map of Kenya"
    />
  );
}
