const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(process.env.DB_FILE)
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ files: [] }).write()
module.exports = db
