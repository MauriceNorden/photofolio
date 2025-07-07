const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./photos.db');

db.serialize(() => {
  db.run(`
    
  `);
});

module.exports = db;