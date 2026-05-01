import type { Handle } from "@sveltejs/kit";

// Force HTML responses to always revalidate. Without this, the adapter
// emits no Cache-Control on SSR pages, which lets browsers (and CDNs)
// heuristically cache them for an unpredictable amount of time — so a
// fresh deploy can fail to reach the user even after a hard reload.
//
// max-age=0 + must-revalidate = "use the cached copy only after asking
// the origin if it's still good." Hashed static assets (/_app/immutable/*)
// keep their long immutable TTL because they're served by the Cloudflare
// static-asset handler, not by this hook.
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const ct = response.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) {
    response.headers.set("cache-control", "public, max-age=0, must-revalidate");
  }
  return response;
};
