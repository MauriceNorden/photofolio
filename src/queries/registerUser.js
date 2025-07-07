const { hashString } = require('../modules/createhash');

const db = require('better-sqlite3')(`${process.cwd()}/src/db/db1.sqlite`);
db.pragma('journal_mode = WAL');

const registerUser = (data) => {
    const username = data.username
    const password = hashString(data.password)
    const firstname = data.firstname
    const lastname = data.lastname
    //default JSON response
    var returnvalue = {
        status: 'false',
        data: 'none',
    }
    if (!username || !password) {
        console.error("Username and password are required.");
        return returnvalue;
    }

    if (firstname !== undefined && lastname !== undefined) {
        // Registratie
        const checkUser = db.prepare(`SELECT 1 FROM users WHERE username = ?`).get(username);
        if (checkUser) {
            console.log(`Username '${username}' already exists.`);
            return returnvalue;
        }

        const insert = db.prepare(`
            INSERT INTO users (firstname, lastname, username, password)
            VALUES (?, ?, ?, ?)
        `);
        const result = insert.run(firstname, lastname, username, password);

        if (result.changes === 1) {
            console.log(`User '${username}' created successfully.`);
            const user = db.prepare(`
            SELECT firstname, lastname,username,password,isadmin FROM users WHERE username = ? AND password = ?
        `).get(username, password);
            returnvalue.status = 'true'
            returnvalue.data = user
            return returnvalue;
        } else {
            console.error(`Failed to create user '${username}'.`);
            return returnvalue;
        }

    }
};

exports.registerUser = registerUser;
