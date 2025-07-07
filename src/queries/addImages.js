const db = require('better-sqlite3')(`${process.cwd()}/src/db/db1.sqlite`);
db.pragma('journal_mode = WAL');

const addImages = (data) => {
    var returnvalue = {
        status: 'false',
        data: 'none',
    }
    console.log(data)
    const insert = db.prepare(`INSERT INTO photos (filename, path, year, month, day) VALUES (?, ?, ?, ?, ?)`);
    const result = insert.run(data);
    console.log(result)

    if (result.changes != 0) {
        returnvalue.status = 'true'
        return returnvalue
    } else {
        return returnvalue
    }
}



exports.addImages = addImages