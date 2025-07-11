#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TranslationScanner {
  constructor() {
    this.clientDir = path.join(__dirname, '..', 'client', 'src');
    this.i18nFile = path.join(this.clientDir, 'lib', 'i18n.ts');
    this.hardcodedStrings = new Set();
    this.usedTranslationKeys = new Set();
    this.availableKeys = { en: new Set(), ar: new Set() };
    this.missingKeys = { en: new Set(), ar: new Set() };
    this.duplicateKeys = { en: [], ar: [] };
    this.unusedKeys = { en: new Set(), ar: new Set() };
  }

  // Extract translation keys from i18n.ts file
  extractAvailableKeys() {
    try {
      const content = fs.readFileSync(this.i18nFile, 'utf8');
      
      // Parse English translations - look for the common section
      const enMatch = content.match(/common:\s*{([\s\S]*?)},\s*(?:fr|es|zh|ar):/);
      if (enMatch) {
        this.parseTranslationObject(enMatch[1], 'en');
      }

      // Parse Arabic translations - look for the ar section
      const arMatch = content.match(/ar:\s*{\s*common:\s*{([\s\S]*?)}\s*}/);
      if (arMatch) {
        this.parseTranslationObject(arMatch[1], 'ar');
      }

      console.log(`✅ Found ${this.availableKeys.en.size} English keys and ${this.availableKeys.ar.size} Arabic keys`);
    } catch (error) {
      console.error('❌ Error reading i18n file:', error.message);
    }
  }

  // Parse translation object and extract keys
  parseTranslationObject(content, lang) {
    // More robust regex to handle various quote types and multiline strings
    const keyRegex = /^\s*"([^"]+)":\s*"([^"]*(?:\\.[^"]*)*)"(?:,\s*)?$/gm;
    const keys = new Map();
    let match;

    while ((match = keyRegex.exec(content)) !== null) {
      const key = match[1];
      if (keys.has(key)) {
        this.duplicateKeys[lang].push(key);
      } else {
        keys.set(key, true);
        this.availableKeys[lang].add(key);
      }
    }
  }

  // Scan files for hardcoded strings and translation usage
  scanFiles() {
    this.walkDirectory(this.clientDir);
    console.log(`✅ Scanned files for translation usage`);
  }

  // Recursively walk directory
  walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        this.walkDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        this.scanFile(filePath);
      }
    }
  }

  // Scan individual file
  scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.clientDir, filePath);

    // Skip i18n.ts file itself
    if (relativePath.includes('i18n.ts')) return;

    // Extract used translation keys
    const tCallRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    let match;
    while ((match = tCallRegex.exec(content)) !== null) {
      this.usedTranslationKeys.add(match[1]);
    }

    // Look for hardcoded strings (basic heuristic)
    this.findHardcodedStrings(content, relativePath);
  }

  // Find potentially hardcoded strings
  findHardcodedStrings(content, filePath) {
    // Look for JSX text content that might be hardcoded
    const jsxTextRegex = />([^<>{}\n]{3,})</g;
    const stringLiteralRegex = /['"`]([^'"`\n]{10,})['"`]/g;
    
    let match;
    
    // JSX text content
    while ((match = jsxTextRegex.exec(content)) !== null) {
      const text = match[1].trim();
      if (this.isLikelyHardcodedString(text)) {
        this.hardcodedStrings.add(`${filePath}: "${text}"`);
      }
    }

    // String literals
    while ((match = stringLiteralRegex.exec(content)) !== null) {
      const text = match[1].trim();
      if (this.isLikelyHardcodedString(text) && !this.isCodeOrVariableName(text)) {
        this.hardcodedStrings.add(`${filePath}: "${text}"`);
      }
    }
  }

  // Heuristic to determine if a string is likely user-facing text
  isLikelyHardcodedString(text) {
    // Skip if it's likely a class name, ID, or technical string
    if (text.includes('className') || text.includes('http') || text.includes('://')) return false;
    if (text.match(/^[a-z-]+$/)) return false; // CSS classes
    if (text.match(/^[A-Z_]+$/)) return false; // Constants
    if (text.includes('{{') || text.includes('}}')) return false; // Template strings
    
    // Look for natural language indicators
    return text.includes(' ') || text.length > 15;
  }

  // Check if string is likely code or variable name
  isCodeOrVariableName(text) {
    return text.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/) || 
           text.includes('(') || text.includes('[') || 
           text.includes('=') || text.includes(';');
  }

  // Find missing and unused keys
  analyzeKeyUsage() {
    // Find keys used in code but missing from translations
    for (const key of this.usedTranslationKeys) {
      if (!this.availableKeys.en.has(key)) {
        this.missingKeys.en.add(key);
      }
      if (!this.availableKeys.ar.has(key)) {
        this.missingKeys.ar.add(key);
      }
    }

    // Find keys in translations but not used in code
    for (const key of this.availableKeys.en) {
      if (!this.usedTranslationKeys.has(key)) {
        this.unusedKeys.en.add(key);
      }
    }
    for (const key of this.availableKeys.ar) {
      if (!this.usedTranslationKeys.has(key)) {
        this.unusedKeys.ar.add(key);
      }
    }
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n📊 TRANSLATION COVERAGE REPORT');
    console.log('=' .repeat(50));

    // Summary statistics
    console.log('\n📈 SUMMARY STATISTICS');
    console.log(`Total translation keys used in code: ${this.usedTranslationKeys.size}`);
    console.log(`Available English keys: ${this.availableKeys.en.size}`);
    console.log(`Available Arabic keys: ${this.availableKeys.ar.size}`);
    console.log(`Translation coverage: ${Math.round((this.usedTranslationKeys.size / this.availableKeys.en.size) * 100)}%`);

    // Missing keys
    if (this.missingKeys.en.size > 0 || this.missingKeys.ar.size > 0) {
      console.log('\n❌ MISSING TRANSLATION KEYS');
      if (this.missingKeys.en.size > 0) {
        console.log(`\nMissing from English (${this.missingKeys.en.size}):`);
        [...this.missingKeys.en].forEach(key => console.log(`  - ${key}`));
      }
      if (this.missingKeys.ar.size > 0) {
        console.log(`\nMissing from Arabic (${this.missingKeys.ar.size}):`);
        [...this.missingKeys.ar].forEach(key => console.log(`  - ${key}`));
      }
    }

    // Duplicate keys
    if (this.duplicateKeys.en.length > 0 || this.duplicateKeys.ar.length > 0) {
      console.log('\n⚠️  DUPLICATE KEYS');
      if (this.duplicateKeys.en.length > 0) {
        console.log(`\nDuplicate English keys (${this.duplicateKeys.en.length}):`);
        this.duplicateKeys.en.forEach(key => console.log(`  - ${key}`));
      }
      if (this.duplicateKeys.ar.length > 0) {
        console.log(`\nDuplicate Arabic keys (${this.duplicateKeys.ar.length}):`);
        this.duplicateKeys.ar.forEach(key => console.log(`  - ${key}`));
      }
    }

    // Unused keys
    if (this.unusedKeys.en.size > 0) {
      console.log('\n🗑️  UNUSED TRANSLATION KEYS');
      console.log(`\nUnused keys (${this.unusedKeys.en.size}):`);
      [...this.unusedKeys.en].slice(0, 10).forEach(key => console.log(`  - ${key}`));
      if (this.unusedKeys.en.size > 10) {
        console.log(`  ... and ${this.unusedKeys.en.size - 10} more`);
      }
    }

    // Hardcoded strings
    if (this.hardcodedStrings.size > 0) {
      console.log('\n🔍 POTENTIALLY HARDCODED STRINGS');
      console.log(`\nFound ${this.hardcodedStrings.size} potentially hardcoded strings:`);
      [...this.hardcodedStrings].slice(0, 10).forEach(str => console.log(`  - ${str}`));
      if (this.hardcodedStrings.size > 10) {
        console.log(`  ... and ${this.hardcodedStrings.size - 10} more`);
      }
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    if (this.missingKeys.en.size > 0 || this.missingKeys.ar.size > 0) {
      console.log('  - Add missing translation keys to i18n.ts');
    }
    if (this.duplicateKeys.en.length > 0 || this.duplicateKeys.ar.length > 0) {
      console.log('  - Remove duplicate translation keys');
    }
    if (this.hardcodedStrings.size > 0) {
      console.log('  - Replace hardcoded strings with t() function calls');
    }
    if (this.unusedKeys.en.size > 10) {
      console.log('  - Consider removing unused translation keys');
    }

    console.log('\n✅ Scan complete!');
  }

  // Main execution method
  async run() {
    console.log('🔍 Starting translation scan...\n');
    
    this.extractAvailableKeys();
    this.scanFiles();
    this.analyzeKeyUsage();
    this.generateReport();
  }
}

// Run the scanner if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const scanner = new TranslationScanner();
  scanner.run().catch(console.error);
}

export default TranslationScanner;