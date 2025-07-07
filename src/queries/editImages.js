const db = require('better-sqlite3')(`${process.cwd()}/src/db/db1.sqlite`);
db.pragma('journal_mode = WAL');

const editImages = () => {

}


exports.editImages = editImages