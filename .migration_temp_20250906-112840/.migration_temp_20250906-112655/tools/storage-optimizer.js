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

class StorageOptimizer {
  constructor() {
    this.tempFiles = [];
    this.duplicates = [];
    this.largeFiles = [];
  }

  optimizeStorage() {
    console.log('🧹 Starting Storage Optimization...');
    
    this.findTempFiles();
    this.findDuplicates();
    this.findLargeFiles();
    this.cleanup();
    
    return this.generateReport();
  }

  findTempFiles() {
    const tempPatterns = [
      /\.tmp$/,
      /\.temp$/,
      /~$/,
      /\.bak$/,
      /\.cache$/,
      /node_modules\/\.cache/,
      /\.DS_Store$/,
      /Thumbs\.db$/
    ];
    
    this.scanForPatterns('.', tempPatterns, this.tempFiles);
  }

  findDuplicates() {
    const fileHashes = new Map();
    this.scanForDuplicates('.', fileHashes);
  }

  findLargeFiles() {
    this.scanForLargeFiles('.', 1024 * 1024); // Files > 1MB
  }

  scanForPatterns(dir, patterns, results) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory() && !this.shouldSkipDir(item.name)) {
          this.scanForPatterns(fullPath, patterns, results);
        } else if (item.isFile()) {
          const matches = patterns.some(pattern => pattern.test(item.name));
          if (matches) {
            const stats = fs.statSync(fullPath);
            results.push({
              path: fullPath,
              size: stats.size,
              type: 'temp'
            });
          }
        }
      });
    } catch (error) {
      // Skip directories we can't read
    }
  }

  scanForDuplicates(dir, hashes) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory() && !this.shouldSkipDir(item.name)) {
          this.scanForDuplicates(fullPath, hashes);
        } else if (item.isFile() && this.shouldCheckForDuplicates(item.name)) {
          try {
            const content = fs.readFileSync(fullPath);
            const hash = require('crypto').createHash('md5').update(content).digest('hex');
            
            if (hashes.has(hash)) {
              this.duplicates.push({
                path: fullPath,
                duplicate_of: hashes.get(hash),
                size: content.length
              });
            } else {
              hashes.set(hash, fullPath);
            }
          } catch (error) {
            // Skip files we can't read
          }
        }
      });
    } catch (error) {
      // Skip directories we can't read
    }
  }

  scanForLargeFiles(dir, threshold) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory() && !this.shouldSkipDir(item.name)) {
          this.scanForLargeFiles(fullPath, threshold);
        } else if (item.isFile()) {
          const stats = fs.statSync(fullPath);
          if (stats.size > threshold) {
            this.largeFiles.push({
              path: fullPath,
              size: stats.size,
              sizeMB: (stats.size / 1024 / 1024).toFixed(2)
            });
          }
        }
      });
    } catch (error) {
      // Skip directories we can't read
    }
  }

  shouldSkipDir(dirname) {
    const skipDirs = ['node_modules', '.git', 'cached-assets', 'optimized-images'];
    return skipDirs.includes(dirname);
  }

  shouldCheckForDuplicates(filename) {
    const checkExts = ['.js', '.css', '.html', '.json', '.png', '.jpg', '.jpeg'];
    return checkExts.some(ext => filename.toLowerCase().endsWith(ext));
  }

  cleanup() {
    let cleaned = 0;
    let spaceSaved = 0;

    // Clean temp files
    this.tempFiles.forEach(file => {
      try {
        spaceSaved += file.size;
        fs.unlinkSync(file.path);
        cleaned++;
        console.log(`🗑️  Removed temp file: ${file.path}`);
      } catch (error) {
        console.log(`⚠️  Could not remove: ${file.path}`);
      }
    });

    // Report duplicates (don't auto-delete)
    this.duplicates.forEach(dup => {
      console.log(`🔄 Duplicate found: ${dup.path} (same as ${dup.duplicate_of})`);
    });

    console.log(`\n✅ Cleanup complete: ${cleaned} files removed, ${Math.round(spaceSaved / 1024)}KB freed`);
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      tempFiles: {
        count: this.tempFiles.length,
        totalSize: this.tempFiles.reduce((sum, f) => sum + f.size, 0)
      },
      duplicates: {
        count: this.duplicates.length,
        totalSize: this.duplicates.reduce((sum, f) => sum + f.size, 0)
      },
      largeFiles: {
        count: this.largeFiles.length,
        files: this.largeFiles.sort((a, b) => b.size - a.size).slice(0, 10) // Top 10
      }
    };

    fs.writeFileSync('storage-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📊 Storage Report:');
    console.log(`   • Temp files: ${report.tempFiles.count} (${Math.round(report.tempFiles.totalSize / 1024)}KB)`);
    console.log(`   • Duplicates: ${report.duplicates.count} (${Math.round(report.duplicates.totalSize / 1024)}KB)`);
    console.log(`   • Large files: ${report.largeFiles.count}`);
    console.log('   • Report saved: storage-report.json');

    return report;
  }
}

// Run optimization
const optimizer = new StorageOptimizer();
optimizer.optimizeStorage();

module.exports = StorageOptimizer;
