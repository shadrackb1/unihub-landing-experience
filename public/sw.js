/*
 * UniHub service worker — offline-first.
 *
 * Strategy:
 *  - App shell (core routes) is precached at install so the app opens cold offline.
 *  - Navigations: network-first with a short timeout; fall back to the cached
 *    copy, then to the cached home page. Every successful fetch refreshes the
 *    cache so users get the newest shell the next time they are offline.
 *  - Hashed static assets: cache-first wins on the network.
 *  - Images / fonts (same- or cross-origin, CORS GET): stale-while-revalidate.
 *  - Firestore / auth endpoints and non-GET requests are left untouched.
 *  - When a new worker activates it tells the open pages so they can reload.
 *
 * The VERSION constant must be bumped whenever precache URLs change.
 */
const VERSION = "unihub-v1.0.2";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// Core routes + the assets every offline first paint needs.
const PRECACHE_URLS = [
  "/",
  "/listings",
  "/list-property",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/admin/login",
  "/landlord/login",
  "/landlord/register",
  "/manifest.webmanifest",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/favicon.svg",
];

// Requests we never intercept.
function isDisallowed(url) {
  if (url.pathname.startsWith("/@")) return true; // vite dev server internals
  if (url.pathname.startsWith("/_")) return false; // hashed assets are handled
  return false;
}

// Dev-server / HMR artefacts that must always hit the network.
function isDevOnly(url) {
  return (
    url.pathname.startsWith("/@vite") ||
    url.pathname.startsWith("/@fs") ||
    url.pathname.startsWith("/@id") ||
    url.pathname.startsWith("/node_modules/.vite") ||
    url.pathname.startsWith("/api/")
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.allSettled(
        PRECACHE_URLS.map((u) => cache.add(new Request(u, { cache: "no-store" }))),
      );
      // Keep only entries whose response is usable.
      for (const u of PRECACHE_URLS) {
        const hit = await cache.match(u);
        if (!hit || !hit.ok) await cache.delete(u);
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) client.postMessage({ type: "SW_ACTIVATE", version: VERSION });
    })(),
  );
});

function isAssetResponse(response) {
  // Vite builds /_import? - actual hashed folders come from nitro builds; accept any 200 asset with a hash-ish tail.
  return response && response.ok && response.type !== "opaque" ? true : false;
}

function networkFirstTimeout(request, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeoutMs);
    fetch(request)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function trimRuntimeCache(maxEntries) {
  const cache = await caches.open(RUNTIME_CACHE);
  const keys = await cache.keys();
  if (keys.length > maxEntries)
    await Promise.all(keys.slice(0, keys.length - maxEntries).map((k) => cache.delete(k)));
}

async function handleNavigation(event, request, url) {
  let cached;
  try {
    const response = await networkFirstTimeout(request, 3500);
    if (response && response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put(request, response.clone());
      return response;
    }
  } catch {
    // offline — fall through
  }
  cached = await caches.match(request, { ignoreSearch: false });
  if (cached) return cached;
  // SPA fallback: render the cached shell of the closest known page.
  const fallback = (await caches.match("/")) || (await caches.match("/listings"));
  if (fallback) return fallback;
  return new Response(
    "<h1>UniHub is offline</h1><p>This page was not cached yet. Reconnect once to cache it.</p>",
    {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}

async function handleImmutableAsset(request, url) {
  const runtime = await caches.open(RUNTIME_CACHE);
  const hit = await runtime.match(request);
  if (hit) return hit;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === "opaque") && response.status !== 206) {
      runtime.put(request, response.clone());
      trimRuntimeCache(300);
    }
    return response;
  } catch (err) {
    const shellHint = await caches.match(request);
    if (shellHint) return shellHint;
    throw err;
  }
}

async function handleStaleWhileRevalidate(request) {
  const runtime = await caches.open(RUNTIME_CACHE);
  const hit = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) {
        runtime.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  return hit || (await network) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept:
  //  - this service worker script
  //  - dev-server/HMR plumbing
  //  - Firebase (Firestore/auth/storage) so the SDK and its own offline layer stay authoritative
  const isFirebase =
    url.hostname.endsWith("googleapis.com") || url.hostname === "firebasestorage.googleapis.com";
  if (url.pathname === "/sw.js" || isDevOnly(url) || isFirebase) return;

  // Video and audio are never intercepted. Browsers stream them with byte-range requests
  // (answered with 206), and replaying a cached full 200 response to a range request makes
  // Safari and some Chrome versions refuse to play. It would also fill the cache with
  // multi-megabyte files. The network and the CDN handle ranges correctly.
  if (
    request.destination === "video" ||
    request.destination === "audio" ||
    request.headers.has("range") ||
    /\.(?:mp4|webm|m4v|mov|mp3|ogg)$/i.test(url.pathname)
  ) {
    return;
  }

  // Same-origin navigations (page loads).
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event, request, url));
    return;
  }

  // Same-origin static assets.
  if (url.origin === self.location.origin) {
    if (
      /\.(?:css|js|mjs|json|svg|png|jpg|jpeg|webp|avif|gif|woff2?|ttf|ico|map)$/.test(
        url.pathname,
      ) ||
      url.pathname.startsWith("/assets/") ||
      url.pathname.startsWith("/_static/")
    ) {
      event.respondWith(handleImmutableAsset(request, url));
    }
    return;
  }

  // Cross-origin images, fonts, tiles and stylesheets: cache-enabled reads.
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style"
  ) {
    event.respondWith(handleStaleWhileRevalidate(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING" || (event.data && event.data.type === "SKIP_WAITING")) {
    self.skipWaiting();
  }
});
