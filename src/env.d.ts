/// <reference path="../.astro/types.d.ts" />

// Subconjunto mínimo de la API del binding de Rate Limiting que usa
// /api/cv-event — evita depender de @cloudflare/workers-types solo por esto.
interface RateLimiterLike {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

declare module 'cloudflare:workers' {
  interface Env {
    // Secretos de Worker (wrangler secret put ... / .dev.vars en local), nunca en el repo.
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_CHAT_ID?: string;
    // Binding de Rate Limiting (wrangler.jsonc: ratelimits) para /api/cv-event.
    CV_RATE_LIMIT: RateLimiterLike;
  }

  // El propio runtime de Workers expone este binding de bindings ya resueltos;
  // no viene tipado sin instalar @cloudflare/workers-types solo por esto.
  export const env: Env;
}
