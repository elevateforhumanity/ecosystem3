#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Check if sharp is available
let sharp;
try {
    const sharpModule = await import('sharp');
    sharp = sharpModule.default;
} catch (error) {
    console.error('❌ Sharp not found. Install with: npm install sharp');
    console.error('   Or run: npm install -D sharp');
    process.exit(1);
}

// Configuration
const config = {
    inputDir: 'images/raw',
    outputDir: 'assets/images',
    maxWidth: 1600,
    quality: {
        webp: 75,
        jpeg: 80,
        png: 90
    },
    formats: ['webp', 'jpeg'] // Output formats
};

// Ensure directories exist
if (!fs.existsSync(config.inputDir)) {
    console.log(`📁 Creating input directory: ${config.inputDir}`);
    fs.mkdirSync(config.inputDir, { recursive: true });
    
    console.log(`ℹ️  Place your raw images in ${config.inputDir}/`);
    console.log('   Supported formats: jpg, jpeg, png, webp');
    process.exit(0);
}

if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
}

async function optimizeImage(inputPath, filename) {
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext);
    
    // Skip if not an image
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        return;
    }
    
    console.log(`🖼️  Processing: ${filename}`);
    
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        console.log(`   Original: ${metadata.width}x${metadata.height} (${(fs.statSync(inputPath).size / 1024).toFixed(1)}KB)`);
        
        // Process each output format
        for (const format of config.formats) {
            const outputFilename = `${baseName}.${format}`;
            const outputPath = path.join(config.outputDir, outputFilename);
            
            let processor = image.clone()
                .resize({
                    width: config.maxWidth,
                    withoutEnlargement: true
                });
            
            // Apply format-specific settings
            switch (format) {
                case 'webp':
                    processor = processor.webp({ quality: config.quality.webp });
                    break;
                case 'jpeg':
                    processor = processor.jpeg({ quality: config.quality.jpeg, progressive: true });
                    break;
                case 'png':
                    processor = processor.png({ quality: config.quality.png, progressive: true });
                    break;
            }
            
            await processor.toFile(outputPath);
            
            const outputSize = fs.statSync(outputPath).size;
            const outputMeta = await sharp(outputPath).metadata();
            
            console.log(`   → ${outputFilename}: ${outputMeta.width}x${outputMeta.height} (${(outputSize / 1024).toFixed(1)}KB)`);
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
}

async function optimizeAll() {
    console.log('🚀 Starting image optimization...');
    console.log(`📁 Input: ${config.inputDir}`);
    console.log(`📁 Output: ${config.outputDir}`);
    console.log(`🎯 Max width: ${config.maxWidth}px`);
    console.log(`📋 Formats: ${config.formats.join(', ')}`);
    console.log('');
    
    const files = fs.readdirSync(config.inputDir);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    
    if (imageFiles.length === 0) {
        console.log(`ℹ️  No images found in ${config.inputDir}`);
        console.log('   Add some .jpg, .png, or .webp files and run again');
        return;
    }
    
    console.log(`📊 Found ${imageFiles.length} images to process`);
    console.log('');
    
    for (const file of imageFiles) {
        const inputPath = path.join(config.inputDir, file);
        await optimizeImage(inputPath, file);
        console.log('');
    }
    
    console.log('✅ Image optimization complete!');
    console.log('');
    console.log('💡 Usage in HTML:');
    console.log('   <picture>');
    console.log('     <source srcset="/assets/images/hero.webp" type="image/webp">');
    console.log('     <img src="/assets/images/hero.jpeg" alt="Description" loading="lazy">');
    console.log('   </picture>');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log('Image Optimizer for Elevate for Humanity');
    console.log('');
    console.log('Usage: node scripts/image-optimizer.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --help, -h     Show this help message');
    console.log('  --config       Show current configuration');
    console.log('');
    console.log('Configuration:');
    console.log(`  Input directory:  ${config.inputDir}`);
    console.log(`  Output directory: ${config.outputDir}`);
    console.log(`  Max width:        ${config.maxWidth}px`);
    console.log(`  Output formats:   ${config.formats.join(', ')}`);
    process.exit(0);
}

if (args.includes('--config')) {
    console.log('Current Configuration:');
    console.log(JSON.stringify(config, null, 2));
    process.exit(0);
}

// Run optimization
optimizeAll().catch(error => {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
});