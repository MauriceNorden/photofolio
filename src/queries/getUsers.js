const db = require('better-sqlite3')(`${process.cwd()}/src/db/db1.sqlite`);
db.pragma('journal_mode = WAL');

const getUsers = () => {

    const users = db.prepare("SELECT * FROM users").all();

    return users
}
exports.getUsers = getUsers