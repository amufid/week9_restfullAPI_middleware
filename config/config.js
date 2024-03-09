const Pool = require('pg').Pool

const pool = new Pool({
   user: 'postgres',
   password: 'postgres',
   database: 'week9_dbmovies',
   host: 'localhost',
   port: 5432,
})

module.exports = pool