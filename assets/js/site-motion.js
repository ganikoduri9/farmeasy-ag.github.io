// Motion is progressive enhancement: all content and a still photo work without JS.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero-stage');
  const toggle = hero?.querySelector('.motion-toggle');
  let pausedByVisitor = false;
  let heroVisible = true;

  function syncHero() {
    if (!hero || !toggle) return;
    const permitted = !preference.matches && !navigator.connection?.saveData;
    const running = permitted && !pausedByVisitor && heroVisible && !document.hidden;
    hero.classList.toggle('motion-enabled', permitted);
    hero.classList.toggle('motion-paused', !running);
    toggle.hidden = !permitted;
    toggle.textContent = pausedByVisitor ? 'Play motion' : 'Pause motion';
    toggle.setAttribute('aria-label', pausedByVisitor ? 'Play background photo animation' : 'Pause background photo animation');
  }

  toggle?.addEventListener('click', () => {
    pausedByVisitor = !pausedByVisitor;
    syncHero();
  });
  preference.addEventListener('change', syncHero);
  document.addEventListener('visibilitychange', syncHero);
  syncHero();

  if ('IntersectionObserver' in window) {
    if (hero) {
      new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        syncHero();
      }).observe(hero);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.domain-card, .ai-banner, .notification-card, .solution-row, .field-story, .project-feature').forEach((element) => {
      // Avoid hiding content that was visible before initialization.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('reveal-item');
      observer.observe(element);
    });
  }
})();
