const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { folder } = req.query;

  let basePath;

  if (!folder) {
    // root folders
    basePath = process.cwd();
  } else {
    // inside selected folder
    basePath = path.join(process.cwd(), folder);
  }

  const items = fs.readdirSync(basePath, { withFileTypes: true });

  const folders = items
    .filter(item => item.isDirectory() && !item.name.startsWith('.'))
    .map(item => item.name);

  res.status(200).json(folders);
};