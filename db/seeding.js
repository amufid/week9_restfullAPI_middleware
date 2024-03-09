const fs = require('fs')
const pool = require('../config/config.js')

const seedQuery = fs.readFileSync('db/seeding.sql', 'utf-8')
pool.query(seedQuery, (err, res) => {
   if(err){
      console.log(err)
   }
   console.log('Seeding success')
   pool.end()
})