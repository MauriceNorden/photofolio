const db = require('better-sqlite3')(`${process.cwd()}/src/db/db1.sqlite`);
db.pragma('journal_mode = WAL');

const getSiteSettings = () => {
    const sitesettings = db.prepare("SELECT * FROM sitesettings").all();
    return sitesettings[0]
}
exports.getSiteSettings = getSiteSettings