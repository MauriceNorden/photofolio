const { createHash } = require('node:crypto')
const hashString = (password) => {
    return createHash('sha3-256').update(password).digest('hex')
}
exports.hashString = hashString