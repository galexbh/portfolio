import type { APIRoute } from 'astro';

// Ruta server-rendered (el resto del sitio queda prerenderizado como estático).
// Recibe un beacon de public/scripts/cv-print.js cuando alguien abre el diálogo
// de impresión en /cv, y lo reenvía como mensaje de Telegram.
export const prerender = false;

const ALLOWED_ORIGIN = 'https://galexbh.dev';
const MAX_BODY_BYTES = 1024;

interface CvEventBody {
  type?: unknown;
  ref?: unknown;
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // sendBeacon a veces no envía Origin en same-origin
  return origin === ALLOWED_ORIGIN;
}

function sanitizeRef(ref: unknown): string | undefined {
  if (typeof ref !== 'string') return undefined;
  const trimmed = ref.trim().slice(0, 80);
  return trimmed || undefined;
}

async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<void> {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  if (!res.ok) {
    console.error('cv-event: Telegram sendMessage failed', res.status, await res.text());
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!isAllowedOrigin(request.headers.get('origin'))) {
    return new Response(null, { status: 204 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 204 });
  }

  let body: CvEventBody = {};
  try {
    body = (await request.json()) as CvEventBody;
  } catch {
    return new Response(null, { status: 204 });
  }

  const type = body.type === 'download' ? 'download' : 'print';
  const ref = sanitizeRef(body.ref);

  const env = locals.runtime?.env;
  const token = env?.TELEGRAM_BOT_TOKEN;
  const chatId = env?.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const country = (request.headers.get('cf-ipcountry') ?? 'desconocido').toUpperCase();
    const referer = request.headers.get('referer') ?? '—';
    const userAgent = (request.headers.get('user-agent') ?? '—').slice(0, 160);
    const when = new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' });

    const lines = [
      `📄 CV — ${type === 'download' ? 'descarga' : 'impresión'}`,
      `Fecha: ${when}`,
      `País: ${country}`,
      `Referer: ${referer}`,
      `UA: ${userAgent}`,
    ];
    if (ref) lines.push(`Ref: ${ref}`);

    await sendTelegramMessage(token, chatId, lines.join('\n'));
  } else {
    console.warn('cv-event: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID no configurados, evento descartado');
  }

  return new Response(null, { status: 204 });
};
