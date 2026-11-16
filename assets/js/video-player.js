// Enhance native video controls with a prominent, keyboard-accessible play button.
document.querySelectorAll('.video-player').forEach((player) => {
  const video = player.querySelector('video');
  const button = player.querySelector('.video-play');
  if (!video || !button) return;

  button.hidden = false;
  button.addEventListener('click', () => {
    video.play().then(() => video.focus({ preventScroll: true })).catch(() => {
      // Native controls remain usable if playback is unavailable.
      button.hidden = true;
      video.focus({ preventScroll: true });
    });
  });
  video.addEventListener('play', () => { button.hidden = true; });
  video.addEventListener('pause', () => { button.hidden = false; });
  video.addEventListener('ended', () => { button.hidden = false; });
  video.addEventListener('error', () => { button.hidden = true; });
});
