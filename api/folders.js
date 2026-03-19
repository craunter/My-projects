const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const basePath = process.cwd();

  const items = fs.readdirSync(basePath, { withFileTypes: true });

  const folders = items
    .filter(item =>
      item.isDirectory() &&
      item.name !== 'api' &&
      item.name !== '.vercel' &&
      item.name !== 'node_modules'
    )
    .map(item => item.name);

  res.status(200).json(folders);
};