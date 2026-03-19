import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const basePath = path.join(process.cwd());
  
  const items = fs.readdirSync(basePath, { withFileTypes: true });

  const folders = items
    .filter(item => item.isDirectory() && item.name !== 'api' && item.name !== '.vercel')
    .map(item => item.name);

  res.status(200).json(folders);
}