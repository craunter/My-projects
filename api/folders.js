const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const filePath = path.join(process.cwd(), 'api', 'folders.json'); // ✅ FIXED PATH
  const folders = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.status(200).json(folders);
};