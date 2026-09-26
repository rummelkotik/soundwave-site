export class Carousel {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.track = this.container.querySelector('[data-carousel-track]');
    this.prevBtn = this.container.querySelector('[data-carousel-prev]');
    this.nextBtn = this.container.querySelector('[data-carousel-next]');
    this.dots = Array.from(this.container.querySelectorAll('.carousel-dot'));
    
    this.gap = options.gap || 24;
    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (!this.track) return;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollPrev());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollNext());
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToIndex(index));
    });

    // Отслеживаем скролл пользователя, чтобы подсвечивать активную точку
    this.track.addEventListener('scroll', () => {
      this.handleScroll();
    }, { passive: true });
  }

  getStepWidth() {
    const slide = this.track.querySelector('.carousel-slide');
    if (!slide) return 320;
    return slide.offsetWidth + this.gap;
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
    const activeIndex = Math.round(this.track.scrollLeft / step);
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