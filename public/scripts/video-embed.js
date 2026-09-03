document.querySelectorAll('.post-video[data-video-id]').forEach((el) => {
  el.addEventListener(
    'click',
    () => {
      const id = el.dataset.videoId;
      const iframe = document.createElement('iframe');
      iframe.className = 'post-video-frame';
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      iframe.title = 'Reproductor de YouTube';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      el.replaceWith(iframe);
    },
    { once: true }
  );
});
