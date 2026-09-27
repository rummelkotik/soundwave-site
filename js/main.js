import { Carousel } from './modules/carousel.js';

function applyGlobalScale() {
  const root = document.querySelector('.site-scale-root');
  if (!root) return;

  const baseWidth = 2560;
  const currentWidth = window.innerWidth;
  const scale = currentWidth / baseWidth;

  // zoom пересчитывает саму геометрию и высоту без артефактов и пропастей
  root.style.zoom = scale;
}

// Запуск сразу
applyGlobalScale();
window.addEventListener('resize', applyGlobalScale);

document.addEventListener('DOMContentLoaded', () => {
  applyGlobalScale();

  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach((el) => {
    new Carousel(el, { gap: 0 });
  });
});