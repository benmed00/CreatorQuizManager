# Translation Scanner Tools

These tools help maintain complete localization coverage for your quiz application.

## Available Scripts

### `node scripts/translation-scanner.js`
Comprehensive translation analysis tool that scans your entire codebase for:

- **Missing Translation Keys**: Keys used in code but not defined in i18n.ts
- **Duplicate Keys**: Keys defined multiple times in the same language
- **Unused Keys**: Keys defined but never used in code
- **Hardcoded Strings**: Potentially untranslated user-facing text
- **Coverage Statistics**: Overall translation completion percentage

### `node scripts/fix-translations.js`
Automated translation maintenance tool that:

- **Fixes Duplicate Keys**: Automatically removes duplicate translation keys
- **Generates Missing Keys**: Creates placeholder translations for missing keys
- **Suggests Translations**: Provides common Arabic translations for known terms

## Usage Examples

### Run Full Translation Scan
```bash
node scripts/translation-scanner.js
```

### Auto-fix Common Issues
```bash
node scripts/fix-translations.js
```

## Reports Generated

The scanner provides detailed reports including:

- **Summary Statistics**: Total keys, coverage percentage, language distribution
- **Missing Keys Report**: Lists all keys used in code but missing from translations
- **Duplicate Keys Report**: Shows keys defined multiple times
- **Hardcoded Strings Report**: Identifies potentially untranslated text
- **Recommendations**: Actionable steps to improve translation coverage

## Integration with Development Workflow

### Pre-commit Checks
You can integrate these tools into your development workflow:

```bash
# Check translations before committing
node scripts/translation-scanner.js
```

### Automated Translation Maintenance
```bash
# Fix common issues automatically
node scripts/fix-translations.js
```

## Key Features

✅ **Comprehensive Coverage Analysis**: Scans all .tsx/.ts files for translation usage
✅ **Duplicate Key Detection**: Identifies and can auto-fix duplicate translations
✅ **Hardcoded String Detection**: Finds potentially untranslated user-facing text
✅ **Missing Key Generation**: Creates placeholder translations for missing keys
✅ **Arabic Translation Support**: Provides common Arabic translations for known terms
✅ **Detailed Reporting**: Provides actionable insights for translation improvement

## Best Practices

1. **Run scanner regularly** to catch missing translations early
2. **Fix duplicate keys** to prevent build warnings
3. **Replace hardcoded strings** with t() function calls
4. **Use meaningful key names** that describe the content
5. **Keep translations consistent** across all supported languages

## Implementation Details

The scanner uses:
- **Regex parsing** to extract translation keys from i18n.ts
- **AST analysis** to find t() function calls in code
- **Heuristic detection** for potentially hardcoded strings
- **Cross-reference analysis** to identify missing/unused keys

This ensures comprehensive coverage analysis while maintaining high accuracy in translation detection.