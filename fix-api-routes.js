const fs = require('fs');
const path = require('path');

// Функція для рекурсивного пошуку файлів
function findFiles(dir, pattern) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, pattern));
    } else if (pattern.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Функція для виправлення API роутів
function fixApiRoute(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Виправляємо типи параметрів
  content = content.replace(
    /{ params }: { params: { id: string } }/g,
    '{ params }: { params: Promise<{ id: string }> }'
  );
  
  // Виправляємо використання параметрів
  content = content.replace(
    /const { id } = params;/g,
    'const { id } = await params;'
  );
  
  // Виправляємо інші параметри
  content = content.replace(
    /const { ([^}]+) } = params;/g,
    'const { $1 } = await params;'
  );
  
  // Зберігаємо файл якщо були зміни
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Виправлено: ${filePath}`);
    modified = true;
  }
  
  return modified;
}

// Знаходимо всі API роути
const apiDir = path.join(__dirname, 'src', 'app', 'api');
const routeFiles = findFiles(apiDir, /route\.ts$/);

console.log('🔧 Виправлення API роутів для Next.js 15...');

let fixedCount = 0;
for (const file of routeFiles) {
  if (fixApiRoute(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Виправлено ${fixedCount} файлів`);
console.log('🚀 Тепер можна запускати npm run build'); 