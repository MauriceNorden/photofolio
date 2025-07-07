const db = require('better-sqlite3')(`${process.cwd()}/src/db/db1.sqlite`);
db.pragma('journal_mode = WAL');

const getImages = (data) => {
    if (!data) {
        const images = db.prepare(`SELECT * FROM photos`).all()
        console.log(images)
        return images
    }

}


exports.getImages = getImages