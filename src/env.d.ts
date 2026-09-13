/// <reference path="../.astro/types.d.ts" />

// Subconjunto mínimo de la API de KV Namespace que usa el rate limiter de
// /api/cv-event — evita depender de @cloudflare/workers-types solo por esto.
interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

declare module 'cloudflare:workers' {
  interface Env {
    // Secretos de Worker (wrangler secret put ... / .dev.vars en local), nunca en el repo.
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_CHAT_ID?: string;
    // Binding de KV (wrangler.jsonc) para el rate limit de /api/cv-event.
    CV_RATE_LIMIT: KVNamespaceLike;
  }

  // El propio runtime de Workers expone este binding de bindings ya resueltos;
  // no viene tipado sin instalar @cloudflare/workers-types solo por esto.
  export const env: Env;
}
