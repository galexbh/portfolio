/// <reference path="../.astro/types.d.ts" />

type CloudflareEnv = {
  // Secretos de Worker (wrangler secret put ...), nunca en el repo.
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
};

declare namespace App {
  interface Locals {
    runtime: {
      env: CloudflareEnv;
      cf?: Record<string, unknown>;
    };
  }
}
