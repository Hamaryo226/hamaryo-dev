// Keep public/_headers in sync: static assets bypass the Worker entry point.
export const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src https://open.spotify.com; upgrade-insecure-requests",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000",
} as const;

export function withSecurityHeaders(response: Response): Response {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}

export function getSpotifyEmbedUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "open.spotify.com" ||
      url.port ||
      url.username ||
      url.password
    ) {
      return undefined;
    }
    const match = url.pathname.match(
      /^\/(?:embed\/)?(playlist|track|album|episode|show)\/([A-Za-z0-9]{22})\/?$/,
    );
    return match
      ? `https://open.spotify.com/embed/${match[1]}/${match[2]}`
      : undefined;
  } catch {
    return undefined;
  }
}
