import fs from 'fs';
import path from 'path';
import { ImageProvider } from '../schemas/imageGenerationSchema.js';

const PROVIDERS_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../../../../registry/image-providers'
);

// Handle Windows drive letter in URL pathname
function normalizePath(p: string): string {
  // On Windows, URL pathname gives /C:/..., strip leading slash
  if (process.platform === 'win32' && /^\/[A-Za-z]:/.test(p)) {
    return p.slice(1);
  }
  return p;
}

function getProvidersDir(): string {
  const dirs = [
    path.join(process.cwd(), 'registry/image-providers'),
    path.join(process.cwd(), '../../registry/image-providers'),
    path.join(process.cwd(), '../../../registry/image-providers'),
    normalizePath(PROVIDERS_DIR),
  ];
  for (const dir of dirs) {
    if (fs.existsSync(dir)) return dir;
  }
  return dirs[0];
}

export function loadImageProviders(): ImageProvider[] {
  const dir = getProvidersDir();
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    return raw as ImageProvider;
  });
}

export function loadImageProvider(id: string): ImageProvider | null {
  const providers = loadImageProviders();
  return providers.find(p => p.id === id) || null;
}
