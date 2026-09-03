const buttons = document.querySelectorAll('.filter-btn');
const grid = document.querySelector('[data-post-grid]');
const emptyNote = document.querySelector('[data-filter-empty]');

if (buttons.length && grid) {
  const cards = grid.querySelectorAll('[data-category]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

      let visible = 0;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
        if (match) visible += 1;
      });

      if (emptyNote) emptyNote.hidden = visible !== 0;
    });
  });
}
