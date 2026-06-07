// tree.js
import fs from 'fs';
import path from 'path';

// Ignore list (folders + files)
const IGNORE_FOLDERS = ['node_modules', '.git', 'dist', 'build'];
const IGNORE_FILES = ['package.json', 'package-lock.json', 'yarn.lock'];

function printTree(dir, prefix = '') {
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    if (IGNORE_FOLDERS.includes(file)) return; // ignore folders
    if (IGNORE_FILES.includes(file)) return;   // ignore specific files

    const isLast = index === files.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    const fullPath = path.join(dir, file);

    console.log(prefix + pointer + file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      // Recursive call for directories
      printTree(fullPath, prefix + (isLast ? '    ' : '│   '));
    } else {
      // Print file content
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, i) => {
          const linePrefix = isLast ? '    ' : '│   ';
          console.log(prefix + linePrefix + (i === lines.length - 1 ? '└── ' : '├── ') + line);
        });
      } catch (err) {
        console.error(prefix + '    ' + 'Error reading file:', err.message);
      }
    }
  });
}

// Start from current directory
printTree(process.cwd());
