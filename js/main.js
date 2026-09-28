import { Carousel } from './modules/carousel.js';

function applyGlobalScale() {
  const root = document.querySelector('.site-scale-root');
  if (!root) return;

  const currentWidth = window.innerWidth;
  const mobileBreakpoint = 768; // граница мобильной версии

  if (currentWidth <= mobileBreakpoint) {
    // На мобилках полностью отключаем зум и жесткие размеры десктопа
    root.style.zoom = '1';
    root.style.width = '100%';
    root.style.minWidth = '0px';
    root.style.maxWidth = '100%';
  } else {
    // На десктопе сохраняем эталонный холст 2560px
    const baseWidth = 2560;
    root.style.zoom = currentWidth / baseWidth;
    root.style.width = '2560px';
    root.style.minWidth = '2560px';
    root.style.maxWidth = '2560px';
  }
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