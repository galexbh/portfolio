// Avisa a /api/track cuando alguien entra a "/" con ?ref= (p.ej. un enlace
// compartido en YouTube/Facebook/LinkedIn). Sin ref, esta función ni siquiera
// toca sessionStorage — tráfico normal/orgánico no genera ningún request.
(() => {
  const ref = new URLSearchParams(window.location.search).get('ref');
  if (!ref) return;

  const NOTIFIED_KEY = 'landing-ref-notified';
  try {
    if (sessionStorage.getItem(NOTIFIED_KEY)) return;
    sessionStorage.setItem(NOTIFIED_KEY, '1');
  } catch {
    return; // storage bloqueado/privado — opcional, no insistir con otra vía
  }

  const body = JSON.stringify({ event: 'landing-visit', ref });
  navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
})();
