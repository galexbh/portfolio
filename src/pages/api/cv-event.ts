import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// Ruta server-rendered (el resto del sitio queda prerenderizado como estático).
// Recibe un beacon de public/scripts/cv-print.js cuando alguien abre el diálogo
// de impresión en /cv, y lo reenvía como mensaje de Telegram.
export const prerender = false;

const ALLOWED_ORIGIN = 'https://galexbh.dev';
const MAX_BODY_BYTES = 1024;
const TELEGRAM_TIMEOUT_MS = 5000;

interface CvEventBody {
  ref?: unknown;
}

/**
 * `sendBeacon` same-origin a veces no manda `Origin`, así que su ausencia no
 * puede rechazarse — pero eso solo, sin más, deja pasar cualquier petición
 * sin cabeceras de navegador (un `curl` recto). Los navegadores sí mandan
 * `Sec-Fetch-Site` en toda petición fetch/beacon moderna: si llega y no es
 * `same-origin`, es cross-site sin Origin (inusual) o un cliente no-navegador
 * falseándola — se rechaza. Si ninguna de las dos cabeceras llega, el rate
 * limit de abajo sigue siendo la única defensa, como ya lo era antes.
 */
function isAllowedRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (origin) return origin === ALLOWED_ORIGIN;

  const secFetchSite = request.headers.get('sec-fetch-site');
  return !secFetchSite || secFetchSite === 'same-origin';
}

/** Recorta, limpia saltos de línea (evitan inyectar líneas falsas en el
 * mensaje de Telegram, que se arma con `lines.join('\n')`) y trunca. */
function sanitizeLine(value: string, maxLength: number): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength);
}

function sanitizeRef(ref: unknown): string | undefined {
  if (typeof ref !== 'string') return undefined;
  const cleaned = sanitizeLine(ref, 80);
  return cleaned || undefined;
}

/**
 * Rate limit por IP vía el binding nativo de Rate Limiting de Workers
 * (wrangler.jsonc: ratelimits, 5 req / 60 s). Reemplaza una implementación
 * anterior sobre KV que no era atómica (get+put separados dejaban colar
 * ráfagas concurrentes) y que además, al ser KV de consistencia eventual
 * entre colos, tardaba hasta ~60s en propagar un contador — casi la ventana
 * completa, así que en la práctica limitaba bastante menos de lo que parecía.
 * Este binding es atómico por diseño y no consume operaciones de KV.
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const { success } = await env.CV_RATE_LIMIT.limit({ key: ip });
  return success;
}

async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<void> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error('cv-event: Telegram sendMessage failed', res.status, await res.text());
    }
  } catch (err) {
    // Red caída, timeout, DNS, etc. — nunca debe tumbar la respuesta al cliente
    // (esta llamada corre en background vía waitUntil, ya se respondió 204).
    console.error('cv-event: Telegram sendMessage threw', err);
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!isAllowedRequest(request)) {
    return new Response(null, { status: 204 });
  }

  // El header content-length lo declara el cliente y no se valida contra los
  // bytes reales — se lee el body como texto y se mide de verdad antes de
  // parsear JSON, en vez de confiar en el header.
  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return new Response(null, { status: 204 });
  }

  let body: CvEventBody = {};
  try {
    body = JSON.parse(rawBody) as CvEventBody;
  } catch {
    return new Response(null, { status: 204 });
  }

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const withinLimit = await checkRateLimit(ip);
  if (!withinLimit) {
    return new Response(null, { status: 429 });
  }

  const ref = sanitizeRef(body.ref);

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const country = (request.headers.get('cf-ipcountry') ?? 'desconocido').toUpperCase();
    const referer = sanitizeLine(request.headers.get('referer') ?? '—', 200);
    const userAgent = sanitizeLine(request.headers.get('user-agent') ?? '—', 160);
    const when = new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' });

    const lines = [
      '📄 CV — impresión',
      `Fecha: ${when}`,
      `País: ${country}`,
      `Referer: ${referer}`,
      `UA: ${userAgent}`,
    ];
    if (ref) lines.push(`Ref: ${ref}`);

    // No se espera la respuesta de Telegram para responder al cliente: si
    // Telegram tarda o cuelga, no debe bloquear ni facturar wall-time extra
    // del Worker por una petición que ya devolvió 204 vía sendBeacon.
    locals.cfContext.waitUntil(sendTelegramMessage(token, chatId, lines.join('\n')));
  } else {
    console.warn('cv-event: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID no configurados, evento descartado');
  }

  return new Response(null, { status: 204 });
};
