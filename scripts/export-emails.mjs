import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'public', 'email-templates');
fs.mkdirSync(outDir, { recursive: true });

// We can fetch from http://localhost:3000/api or write a clean standalone generator
console.log('Out dir created at:', outDir);
