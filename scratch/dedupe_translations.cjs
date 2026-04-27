const fs = require('fs');
const path = require('path');

const locales = ['uz', 'ru', 'en'];
const baseDir = '/Users/davronbekdev/Desktop/car-wash/public/locales';

locales.forEach(lang => {
  const filePath = path.join(baseDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      // We parse it manually to handle potential duplicate keys which JSON.parse would just overwrite
      // But actually, Node's JSON.parse keeps the last one.
      // However, we want to see what's being overwritten.
      
      const lines = content.split('\n');
      const uniqueKeys = new Set();
      const resultLines = [];
      
      // We process from bottom to top to keep the LAST occurrence
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const match = line.match(/^\s*"([^"]+)"\s*:/);
        if (match) {
          const key = match[1];
          if (uniqueKeys.has(key)) {
            console.log(`Removing duplicate key "${key}" in ${lang}`);
            continue;
          }
          uniqueKeys.add(key);
        }
        resultLines.unshift(line);
      }
      
      // Fix commas
      const cleanedLines = resultLines.map((line, idx) => {
        if (line.trim() === '{' || line.trim() === '}') return line;
        const isLastLine = idx === resultLines.length - 2; // Before the closing brace
        const hasComma = line.trim().endsWith(',');
        
        if (isLastLine && hasComma) {
          return line.replace(/,\s*$/, '');
        }
        if (!isLastLine && !hasComma && line.includes(':')) {
          return line + ',';
        }
        return line;
      });

      fs.writeFileSync(filePath, cleanedLines.join('\n'), 'utf8');
      console.log(`Deduplicated ${lang}/translation.json`);
    } catch (e) {
      console.error(`Error processing ${lang}:`, e);
    }
  }
});
