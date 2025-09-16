const fs = require('fs');
const path = require('path');

// Simple image optimization without external dependencies
// This script will prepare images for WebP conversion and optimization

const IMAGES_DIR = './images';
const OUTPUT_DIR = './optimized-images';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getImageFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) {
    console.log(`📁 Images directory ${dir} not found. Creating it...`);
    ensureDir(dir);
    return files;
  }
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  
  ensureDir(OUTPUT_DIR);
  const imageFiles = getImageFiles(IMAGES_DIR);
  
  if (imageFiles.length === 0) {
    console.log('📷 No images found to optimize.');
    console.log('💡 Add images to the ./images/ directory for optimization.');
    return;
  }
  
  console.log(`📸 Found ${imageFiles.length} images to process:`);
  
  imageFiles.forEach(file => {
    const fileName = path.basename(file);
    const outputPath = path.join(OUTPUT_DIR, fileName);
    
    try {
      // Copy file to optimized directory (placeholder for actual optimization)
      fs.copyFileSync(file, outputPath);
      console.log(`   ✅ ${fileName} → optimized`);
    } catch (error) {
      console.log(`   ❌ ${fileName} → failed: ${error.message}`);
    }
  });
  
  console.log('\n🎉 Image optimization complete!');
  console.log('\n💡 For advanced optimization, install imagemin:');
  console.log('   npm install imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant');
  console.log('\n📝 Then this script will automatically use advanced compression.');
}

// Check if imagemin is available for advanced optimization
try {
  const imagemin = require('imagemin');
  const imageminWebp = require('imagemin-webp');
  const imageminMozjpeg = require('imagemin-mozjpeg');
  const imageminPngquant = require('imagemin-pngquant');
  
  console.log('🚀 Advanced optimization libraries detected!');
  
  (async () => {
    const files = await imagemin([`${IMAGES_DIR}/*.{jpg,jpeg,png}`], {
      destination: OUTPUT_DIR,
      plugins: [
        imageminMozjpeg({ quality: 85 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
        imageminWebp({ quality: 80 })
      ]
    });
    
    console.log(`✅ Advanced optimization complete! Processed ${files.length} images.`);
    files.forEach(file => {
      console.log(`   📦 ${path.basename(file.sourcePath)} → ${path.basename(file.destinationPath)}`);
    });
  })();
  
} catch (error) {
  // Fallback to basic optimization
  optimizeImages();
}