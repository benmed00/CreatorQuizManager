#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TranslationScanner from './translation-scanner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TranslationFixer {
  constructor() {
    this.scanner = new TranslationScanner();
    this.i18nFile = path.join(__dirname, '..', 'client', 'src', 'lib', 'i18n.ts');
  }

  // Auto-fix duplicate keys
  async fixDuplicateKeys() {
    console.log('🔧 Fixing duplicate keys...');
    
    let content = fs.readFileSync(this.i18nFile, 'utf8');
    
    // Remove duplicate keys by keeping track of seen keys
    const seenKeys = new Set();
    
    // Fix English section
    content = content.replace(/en:\s*{([\s\S]*?)},\s*fr:/, (match, enContent) => {
      const fixedContent = this.removeDuplicateKeysFromSection(enContent, seenKeys);
      return match.replace(enContent, fixedContent);
    });
    
    // Reset for Arabic section
    seenKeys.clear();
    
    // Fix Arabic section
    content = content.replace(/ar:\s*{([\s\S]*?)}\s*}\s*}\s*;/, (match, arContent) => {
      const fixedContent = this.removeDuplicateKeysFromSection(arContent, seenKeys);
      return match.replace(arContent, fixedContent);
    });
    
    fs.writeFileSync(this.i18nFile, content);
    console.log('✅ Fixed duplicate keys');
  }

  // Remove duplicate keys from a translation section
  removeDuplicateKeysFromSection(content, seenKeys) {
    const lines = content.split('\n');
    const filteredLines = [];
    
    for (const line of lines) {
      const keyMatch = line.match(/^\s*"([^"]+)":\s*"[^"]*",?\s*$/);
      if (keyMatch) {
        const key = keyMatch[1];
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          filteredLines.push(line);
        } else {
          console.log(`  Removed duplicate key: ${key}`);
        }
      } else {
        filteredLines.push(line);
      }
    }
    
    return filteredLines.join('\n');
  }

  // Generate missing translation keys
  async generateMissingKeys() {
    console.log('🔧 Generating missing translation keys...');
    
    await this.scanner.run();
    
    if (this.scanner.missingKeys.en.size === 0 && this.scanner.missingKeys.ar.size === 0) {
      console.log('✅ No missing keys found');
      return;
    }

    const missingEnKeys = [...this.scanner.missingKeys.en];
    const missingArKeys = [...this.scanner.missingKeys.ar];

    // Generate English keys
    if (missingEnKeys.length > 0) {
      console.log(`\nGenerated English keys (${missingEnKeys.length}):`);
      missingEnKeys.forEach(key => {
        const placeholder = this.generatePlaceholderText(key);
        console.log(`  "${key}": "${placeholder}",`);
      });
    }

    // Generate Arabic keys
    if (missingArKeys.length > 0) {
      console.log(`\nGenerated Arabic keys (${missingArKeys.length}):`);
      missingArKeys.forEach(key => {
        const placeholder = this.generateArabicPlaceholder(key);
        console.log(`  "${key}": "${placeholder}",`);
      });
    }

    console.log('\n📝 Copy the above keys to your i18n.ts file');
  }

  // Generate placeholder text for English keys
  generatePlaceholderText(key) {
    // Convert key to human-readable text
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Generate placeholder text for Arabic keys
  generateArabicPlaceholder(key) {
    // Basic key-to-Arabic mapping for common terms
    const commonTranslations = {
      'home': 'الرئيسية',
      'dashboard': 'لوحة التحكم',
      'profile': 'الملف الشخصي',
      'settings': 'الإعدادات',
      'logout': 'تسجيل الخروج',
      'login': 'تسجيل الدخول',
      'register': 'التسجيل',
      'quiz': 'اختبار',
      'quizzes': 'اختبارات',
      'create': 'إنشاء',
      'edit': 'تحرير',
      'delete': 'حذف',
      'save': 'حفظ',
      'cancel': 'إلغاء',
      'submit': 'إرسال',
      'loading': 'جاري التحميل...',
      'error': 'خطأ',
      'success': 'نجح',
      'warning': 'تحذير',
      'info': 'معلومات'
    };

    // Try to find a match
    for (const [en, ar] of Object.entries(commonTranslations)) {
      if (key.toLowerCase().includes(en)) {
        return ar;
      }
    }

    // Fallback to placeholder with key name
    return `[${key}]`;
  }

  // Main execution method
  async run() {
    console.log('🔧 Starting translation fixes...\n');
    
    await this.fixDuplicateKeys();
    await this.generateMissingKeys();
    
    console.log('\n✅ Translation fixes complete!');
  }
}

// Run the fixer if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new TranslationFixer();
  fixer.run().catch(console.error);
}

export default TranslationFixer;