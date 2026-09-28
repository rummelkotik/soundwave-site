export class Carousel {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.track = this.container.querySelector('[data-carousel-track]') || this.container.querySelector('.carousel-track');
    this.prevBtn = this.container.querySelector('[data-carousel-prev]') || this.container.querySelector('.control-btn:first-child');
    this.nextBtn = this.container.querySelector('[data-carousel-next]') || this.container.querySelector('.control-btn:last-child');
    this.dots = Array.from(this.container.querySelectorAll('.carousel-dot'));

    this.gap = options.gap !== undefined ? options.gap : null;
    this.currentIndex = 0;
    this._scrollTicking = false;

    this.init();
  }

  init() {
    if (!this.track) return;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollPrev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollNext();
      });
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToIndex(index);
      });
    });

    // Оптимизированное отслеживание скролла через requestAnimationFrame
    this.track.addEventListener('scroll', () => {
      if (!this._scrollTicking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this._scrollTicking = false;
        });
        this._scrollTicking = true;
      }
    }, { passive: true });

    // Корректировка позиции при повороте экрана / изменении размера окна
    window.addEventListener('resize', () => {
      const step = this.getStepWidth();
      this.track.scrollTo({
        left: step * this.currentIndex,
        behavior: 'instant'
      });
    });
  }

  getStepWidth() {
    const slide = this.track.querySelector('.carousel-slide');
    if (!slide) return this.track.clientWidth;

    let currentGap = 0;
    if (this.gap !== null) {
      currentGap = this.gap;
    } else {
      const computedGap = parseFloat(window.getComputedStyle(this.track).gap);
      currentGap = isNaN(computedGap) ? 0 : computedGap;
    }

    return slide.offsetWidth + currentGap;
  }

  scrollNext() {
    this.track.scrollBy({
      left: this.getStepWidth(),
      behavior: 'smooth'
    });
  }

  scrollPrev() {
    this.track.scrollBy({
      left: -this.getStepWidth(),
      behavior: 'smooth'
    });
  }

  goToIndex(index) {
    const step = this.getStepWidth();
    this.track.scrollTo({
      left: step * index,
      behavior: 'smooth'
    });
    this.updateDots(index);
  }

  handleScroll() {
    const step = this.getStepWidth();
    if (!step) return;

    const activeIndex = Math.min(
      Math.max(0, Math.round(this.track.scrollLeft / step)),
      Math.max(0, this.dots.length - 1)
    );

    this.updateDots(activeIndex);
  }

  updateDots(index) {
    if (this.currentIndex === index) return;
    this.currentIndex = index;

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}

// Автоматическая инициализация всех каруселей на странице
const initAllCarousels = () => {
  const wrappers = document.querySelectorAll('.carousel-wrapper');
  wrappers.forEach((el) => {
    if (!el.__carouselInstance) {
      el.__carouselInstance = new Carousel(el);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllCarousels);
} else {
  initAllCarousels();
}