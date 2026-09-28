const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(__dirname, 'assets-src/images');
const OUT = path.resolve(__dirname, 'assets/images');

// Жесткие лимиты ширины для тяжелых фонов
const MAX_WIDTH = {
  default: 1600,
  'hero-leather': 1600,       // Уменьшаем с 1920 до 1600 px (на экранах до 2K хватает с избытком)
  'process-steps-bg': 1600,   // Уменьшаем с 1920 до 1600 px
  'approach-statue': 1200,
  'approach-bg': 1200,
  'brands-banner-bg': 1600,
  'process-anatomy-bg': 1600,
  'approach-icon': 256,
};

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => /\.(png|jpe?g)$/i.test(f));
const kb = p => (fs.statSync(p).size / 1024).toFixed(0);

(async () => {
  for (const file of files) {
    const { name } = path.parse(file);
    const src = path.join(SRC, file);
    const width = MAX_WIDTH[name] ?? MAX_WIDTH.default;

    const base = () => sharp(src).resize({ width, withoutEnlargement: true });

    try {
      const avif = path.join(OUT, `${name}.avif`);
      const webp = path.join(OUT, `${name}.webp`);

      // Качество 50 для AVIF и 70 для WebP на больших текстурах даст идеальный вес (цель 300–500 КБ) без видимых потерь
      await base().avif({ quality: 50, effort: 6 }).toFile(avif);
      await base().webp({ quality: 70, effort: 5 }).toFile(webp);

      console.log(`✓ ${name}: avif ${kb(avif)} КБ / webp ${kb(webp)} КБ`);
    } catch (err) {
      console.error(`Ошибка при сжатии ${file}:`, err.message);
    }
  }
  console.log('Пересборка фонов завершена!');
})();