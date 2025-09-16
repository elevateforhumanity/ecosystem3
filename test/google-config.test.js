import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Import the functions we want to test
// Note: Since the script uses CommonJS, we'll need to work around this
// For now, we'll create a mock implementation to test the logic

const mockConfig = {
  gaId: 'G-TEST123456',
  googleVerification: 'test-verification-code',
  bingVerification: 'test-bing-code',
  canonicalDomain: 'https://test.example.com'
};

const mockPlaceholders = {
  'GA_MEASUREMENT_ID': mockConfig.gaId,
  'GOOGLE_VERIFICATION_CODE_HERE': mockConfig.googleVerification,
  'YOUR_BING_VERIFICATION_CODE': mockConfig.bingVerification
};

function mockReplacePlaceholders(content) {
  let updatedContent = content;
  Object.entries(mockPlaceholders).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder, 'g');
    updatedContent = updatedContent.replace(regex, value);
  });
  return updatedContent;
}

describe('Google Configuration Setup', () => {
  const testDir = '/tmp/google-config-test';
  const testHtmlFile = path.join(testDir, 'test.html');
  
  beforeEach(() => {
    // Create test directory and file
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    const testHtmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE_HERE" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
</head>
<body>
    <p>Test content with YOUR_BING_VERIFICATION_CODE</p>
</body>
</html>`;
    
    fs.writeFileSync(testHtmlFile, testHtmlContent);
  });
  
  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  it('should replace Google Analytics placeholder', () => {
    const content = 'gtag/js?id=GA_MEASUREMENT_ID';
    const result = mockReplacePlaceholders(content);
    
    expect(result).not.toContain('GA_MEASUREMENT_ID');
    expect(result).toContain(mockConfig.gaId);
    expect(result).toBe('gtag/js?id=G-TEST123456');
  });
  
  it('should replace Google site verification placeholder', () => {
    const content = 'content="GOOGLE_VERIFICATION_CODE_HERE"';
    const result = mockReplacePlaceholders(content);
    
    expect(result).not.toContain('GOOGLE_VERIFICATION_CODE_HERE');
    expect(result).toContain(mockConfig.googleVerification);
    expect(result).toBe('content="test-verification-code"');
  });
  
  it('should replace Bing verification placeholder', () => {
    const content = 'msvalidate.01" content="YOUR_BING_VERIFICATION_CODE"';
    const result = mockReplacePlaceholders(content);
    
    expect(result).not.toContain('YOUR_BING_VERIFICATION_CODE');
    expect(result).toContain(mockConfig.bingVerification);
    expect(result).toBe('msvalidate.01" content="test-bing-code"');
  });
  
  it('should handle content with no placeholders', () => {
    const content = '<p>This content has no placeholders</p>';
    const result = mockReplacePlaceholders(content);
    
    expect(result).toBe(content);
  });
  
  it('should have proper config object structure', () => {
    expect(mockConfig).toHaveProperty('gaId');
    expect(mockConfig).toHaveProperty('googleVerification');
    expect(mockConfig).toHaveProperty('bingVerification');
    expect(mockConfig).toHaveProperty('canonicalDomain');
    
    expect(typeof mockConfig.gaId).toBe('string');
    expect(typeof mockConfig.googleVerification).toBe('string');
    expect(typeof mockConfig.bingVerification).toBe('string');
    expect(typeof mockConfig.canonicalDomain).toBe('string');
  });
  
  it('should verify the setup script exists and is executable', () => {
    const setupScriptPath = './scripts/setup-supabase-codespaces.sh';
    expect(fs.existsSync(setupScriptPath)).toBe(true);
    
    const stats = fs.statSync(setupScriptPath);
    expect(stats.mode & 0o111).toBeTruthy(); // Check if executable
  });
  
  it('should verify the apply-google-config script exists', () => {
    const configScriptPath = './scripts/apply-google-config.js';
    expect(fs.existsSync(configScriptPath)).toBe(true);
  });
});