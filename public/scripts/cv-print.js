// Botón "Imprimir / Guardar PDF" + aviso a /api/cv-event cuando se abre el diálogo
// de impresión. beforeprint dispara al ABRIR el diálogo, no al confirmar, así que
// esto mide intención de imprimir, no una impresión confirmada.
(() => {
  const btn = document.getElementById('cv-print-btn');
  if (btn) {
    btn.addEventListener('click', () => window.print());
  }

  const NOTIFIED_KEY = 'cv-print-notified';

  function notifyOnce() {
    if (sessionStorage.getItem(NOTIFIED_KEY)) return;
    sessionStorage.setItem(NOTIFIED_KEY, '1');

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || undefined;
    const body = JSON.stringify({ type: 'print', ref });

    navigator.sendBeacon('/api/cv-event', new Blob([body], { type: 'application/json' }));
  }

  window.addEventListener('beforeprint', notifyOnce);

  // Safari no siempre dispara beforeprint; matchMedia('print') es el respaldo.
  const printMedia = window.matchMedia('print');
  if (printMedia.addEventListener) {
    printMedia.addEventListener('change', (e) => {
      if (e.matches) notifyOnce();
    });
  }
})();
