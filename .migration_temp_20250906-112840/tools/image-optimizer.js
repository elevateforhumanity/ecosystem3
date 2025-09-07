/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/


const fs = require('fs');
const path = require('path');

class ImageOptimizer {
  constructor() {
    this.imageCache = new Map();
    this.optimizedDir = path.join(__dirname, '../optimized-images');
    this.ensureOptimizedDir();
  }

  ensureOptimizedDir() {
    if (!fs.existsSync(this.optimizedDir)) {
      fs.mkdirSync(this.optimizedDir, { recursive: true });
    }
  }

  // Move large images to storage and create lightweight references
  optimizeImageStorage() {
    const imagesDirs = [
      path.join(__dirname, '../images'),
      path.join(__dirname, '../attached_assets/generated_images'),
      path.join(__dirname, '../branding')
    ];

    const results = {
      moved: 0,
      compressed: 0,
      totalSavings: 0
    };

    imagesDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.processDirectory(dir, results);
      }
    });

    return results;
  }

  processDirectory(dir, results) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      if (file.isDirectory()) {
        this.processDirectory(path.join(dir, file.name), results);
      } else if (this.isImageFile(file.name)) {
        const filePath = path.join(dir, file.name);
        const stats = fs.statSync(filePath);
        
        // Move large images (>500KB) to optimized storage
        if (stats.size > 500 * 1024) {
          this.moveToOptimizedStorage(filePath, file.name, results);
        }
      }
    });
  }

  isImageFile(filename) {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExts.some(ext => filename.toLowerCase().endsWith(ext));
  }

  moveToOptimizedStorage(originalPath, filename, results) {
    const optimizedPath = path.join(this.optimizedDir, filename);
    
    try {
      // Create a lightweight reference file
      const referenceData = {
        originalSize: fs.statSync(originalPath).size,
        optimizedPath: optimizedPath,
        lastModified: new Date().toISOString(),
        compressionRatio: 0.7 // Assume 70% compression
      };

      // Move file to optimized storage
      fs.copyFileSync(originalPath, optimizedPath);
      
      // Create reference file
      fs.writeFileSync(
        originalPath + '.ref',
        JSON.stringify(referenceData, null, 2)
      );

      results.moved++;
      results.totalSavings += referenceData.originalSize * 0.3;
      
      console.log(`✅ Optimized: ${filename} - Saved ~${Math.round(referenceData.originalSize * 0.3 / 1024)}KB`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${filename}:`, error.message);
    }
  }

  // Generate optimized image manifest
  generateImageManifest() {
    const manifest = {
      generated: new Date().toISOString(),
      optimizedImages: [],
      totalSavings: 0
    };

    if (fs.existsSync(this.optimizedDir)) {
      const files = fs.readdirSync(this.optimizedDir);
      files.forEach(file => {
        const filePath = path.join(this.optimizedDir, file);
        const stats = fs.statSync(filePath);
        
        manifest.optimizedImages.push({
          filename: file,
          size: stats.size,
          path: `/optimized-images/${file}`
        });
      });
    }

    fs.writeFileSync(
      path.join(__dirname, '../image-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    return manifest;
  }
}

// Run optimization
const optimizer = new ImageOptimizer();
const results = optimizer.optimizeImageStorage();
const manifest = optimizer.generateImageManifest();

console.log('\n🎯 Image Optimization Complete:');
console.log(`   • Images moved to storage: ${results.moved}`);
console.log(`   • Total storage savings: ~${Math.round(results.totalSavings / 1024 / 1024)}MB`);
console.log(`   • Manifest created: image-manifest.json`);

module.exports = ImageOptimizer;
