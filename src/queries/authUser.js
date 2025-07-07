const { hashString } = require('../modules/createhash');

const db = require('better-sqlite3')(`${process.cwd()}/src/db/db1.sqlite`);
db.pragma('journal_mode = WAL');

const autUser = (data) => {
    //default JSON response
    var returnvalue = {
        status: 'false',
        data: 'none',
    }

    if (!data || !data.username || !data.password) {
        return returnvalue
    }
    const username = data.username
    const password = data.password
    //check data



    // Login
    const user = db.prepare(`
            SELECT firstname, lastname,username,password, isadmin FROM users WHERE username = ? AND password = ?
        `).get(username, password);

    if (user) {
        console.log(`User '${username}' logged in successfully.`);
        returnvalue.status = 'true'
        returnvalue.data = user
        return returnvalue;
    } else {
        console.warn(`Invalid username or password.`);
        return returnvalue;
    }

};

exports.autUser = autUser;
