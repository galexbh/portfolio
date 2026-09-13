import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// Ruta server-rendered (el resto del sitio queda prerenderizado como estático).
// Recibe beacons de dos scripts de cliente distintos —
// public/scripts/cv-print.js (al abrir el diálogo de impresión en /cv) y
// public/scripts/visit-ref.js (al entrar a "/" con ?ref=, p.ej. desde un
// enlace compartido en YouTube/Facebook/LinkedIn) — y reenvía un mensaje a
// Telegram según el tipo de evento.
export const prerender = false;

const ALLOWED_ORIGIN = 'https://galexbh.dev';
const MAX_BODY_BYTES = 1024;
const TELEGRAM_TIMEOUT_MS = 5000;

const EVENT_LABELS = {
  'cv-print': '📄 CV — impresión',
  'landing-visit': '🌐 Landing — visita',
} as const;

type EventKind = keyof typeof EVENT_LABELS;

function isEventKind(value: unknown): value is EventKind {
  return typeof value === 'string' && value in EVENT_LABELS;
}

interface TrackEventBody {
  event?: unknown;
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
 * (wrangler.jsonc: ratelimits, 5 req / 60 s), compartido entre los dos
 * tipos de evento. Una ráfaga de visitas a "/" con ref desde una IP consume
 * el mismo cupo que las notificaciones de impresión del CV desde esa IP —
 * para el tráfico de un portafolio personal no es un problema real, es la
 * misma protección contra flood de siempre, cubriendo dos gatillos en vez
 * de uno.
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
      console.error('track: Telegram sendMessage failed', res.status, await res.text());
    }
  } catch (err) {
    // Red caída, timeout, DNS, etc. — nunca debe tumbar la respuesta al cliente
    // (esta llamada corre en background vía waitUntil, ya se respondió 204).
    console.error('track: Telegram sendMessage threw', err);
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

  let body: TrackEventBody = {};
  try {
    body = JSON.parse(rawBody) as TrackEventBody;
  } catch {
    return new Response(null, { status: 204 });
  }

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const withinLimit = await checkRateLimit(ip);
  if (!withinLimit) {
    return new Response(null, { status: 429 });
  }

  // Antes de que existiera `event`, todo beacon a este endpoint era de
  // impresión de CV — si un navegador manda un body en caché de antes de
  // este deploy (sin `event`), sigue tratándose como tal en vez de perderse.
  const event: EventKind = isEventKind(body.event) ? body.event : 'cv-print';
  const ref = sanitizeRef(body.ref);

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const country = (request.headers.get('cf-ipcountry') ?? 'desconocido').toUpperCase();
    const referer = sanitizeLine(request.headers.get('referer') ?? '—', 200);
    const userAgent = sanitizeLine(request.headers.get('user-agent') ?? '—', 160);
    const when = new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' });

    const lines = [
      EVENT_LABELS[event],
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
    console.warn('track: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID no configurados, evento descartado');
  }

  return new Response(null, { status: 204 });
};
