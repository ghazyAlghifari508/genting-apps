const fs = require('fs');
const results = JSON.parse(fs.readFileSync('lint-results.json', 'utf8'));
const summary = results
  .filter(r => r.errorCount > 0 || r.warningCount > 0)
  .map(r => ({
    file: r.filePath.replace(process.cwd(), ''),
    errors: r.errorCount,
    warnings: r.warningCount,
    rules: [...new Set(r.messages.map(m => m.ruleId))]
  }));
fs.writeFileSync('lint-summary.json', JSON.stringify(summary, null, 2));
console.log(`Summary created for ${summary.length} files.`);
