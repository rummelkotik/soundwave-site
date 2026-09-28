const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.resolve(__dirname, 'assets/images');
const files = fs.readdirSync(imgDir).filter(f => f.toLowerCase().endsWith('.png'));

console.log(`Найдено ${files.length} изображений. Начинаем сжатие...`);

(async () => {
  for (const file of files) {
    const filePath = path.join(imgDir, file);
    const statBefore = fs.statSync(filePath);

    // Пропускаем легковесы (меньше 400 КБ)
    if (statBefore.size < 400 * 1024) {
      continue;
    }

    const sizeMBBefore = (statBefore.size / (1024 * 1024)).toFixed(2);
    const tempPath = path.join(imgDir, `temp_${file}`);

    try {
      const metadata = await sharp(filePath).metadata();

      let pipeline = sharp(filePath);
      // Если картинка шире 1920px — ресайзим до разумного разрешения для экранов
      if (metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
      }

      await pipeline
        .png({ quality: 80, compressionLevel: 9, effort: 7 })
        .toFile(tempPath);

      const statAfter = fs.statSync(tempPath);
      const sizeMBAfter = (statAfter.size / (1024 * 1024)).toFixed(2);

      if (statAfter.size < statBefore.size) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        console.log(`✓ ${file}: ${sizeMBBefore} MB -> ${sizeMBAfter} MB`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`- ${file}: уже оптимален`);
      }
    } catch (err) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      console.error(`Ошибка при сжатии ${file}:`, err.message);
    }
  }

  console.log('Сжатие завершено!');
})();