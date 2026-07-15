import fs from 'fs';
import path from 'path';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('[Postbuild] Starting static asset copy...');

try {
  // Ensure the destination exists
  if (!fs.existsSync('public/_next/static')) {
    fs.mkdirSync('public/_next/static', { recursive: true });
  }
  
  console.log('[Postbuild] Copying .next/static to public/_next/static...');
  copyRecursiveSync('.next/static', 'public/_next/static');
  console.log('[Postbuild] Successfully copied .next/static');
} catch (e) {
  console.error('[Postbuild] Failed to copy .next/static:', e);
  process.exit(1);
}

try {
  // Ensure the destination exists
  if (!fs.existsSync('public/src/assets')) {
    fs.mkdirSync('public/src/assets', { recursive: true });
  }

  console.log('[Postbuild] Copying src/assets to public/src/assets...');
  copyRecursiveSync('src/assets', 'public/src/assets');
  console.log('[Postbuild] Successfully copied src/assets');
} catch (e) {
  console.error('[Postbuild] Failed to copy src/assets:', e);
  // It's okay if src/assets doesn't exist in all setups
}
