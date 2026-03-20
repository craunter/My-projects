const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'api', 'data.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const folder = req.query.folder;

    if (!folder) {
      return res.status(200).json(data["root"] || []);
    }

    return res.status(200).json(data[folder] || []);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load folders" });
  }
};