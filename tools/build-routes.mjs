import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
for (const route of ['about', 'works', 'works/kashika', 'music', 'books', 'contact']) {
  const dir = new URL(`${route}/`, root);
  mkdirSync(dir, { recursive: true });
  const base = '../'.repeat(route.split('/').length);
  writeFileSync(new URL('index.html', dir), html.replace('<head>', `<head>\n    <base href="${base}" />`));
}
