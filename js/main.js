import { Carousel } from './modules/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('[data-carousel]');
  
  carousels.forEach((el) => {
    new Carousel(el, { gap: 24 });
  });
});