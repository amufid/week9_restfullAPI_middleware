const pool = require('../config/config.js')
const express = require('express')
const {authorization} = require("../middlewares/auth.js")

const router = express.Router()

router.get('/paginate', (req, res) => {
   const page = parseInt(req.query.page)
   const limit = parseInt(req.query.limit)

   const offset = (page - 1) * limit
   const startIndex = offset + 1
   const endIndex = page * limit
   const starrEndIndex = { startIndex, endIndex }

   const sql = (
      'SELECT * FROM movies ORDER BY id OFFSET $1 LIMIT $2'
   );

   pool.query(sql, [offset, limit], (err, result) => {
      if (err) {
         console.log(err)
         res.status(500).json({ message: 'Internal Server Error' })
      } else {
         if (result.rows.length === 0) {
            res.status(404).json({ message: 'Not Found' })
         } else {
            res.status(200).json({
               next: starrEndIndex,
               result: result.rows
            })
         }
      }
   })
})

router.get('/', (req, res) => {
   pool.query('SELECT * FROM movies', (err, result) => {
      if (err) {
         console.log(err)
         res.status(500).json({ message: 'Internal Server Error' })
      } else {
         res.status(200).json(result.rows)
      }
   })
})

router.get('/:id', (req, res) => {
   const id = req.params.id

   const sql = (
      `SELECT * FROM movies WHERE id = ${id}`
   )

   pool.query(sql, (err, result) => {
      if (err) {
         console.log(err)
         res.status(500).json({ message: 'Internal Server Error' })
      } else {
         if (result.rows.length === 0) {
            res.status(404).json({ message: 'Not Found' })
         } else {
            res.status(200).json(result.rows[0])
         }
      }
   })
})

router.post('/add', authorization, (req, res) => {
   const { id, title, genres, year } = req.body

   const sql = (
      `INSERT INTO movies
            (id, title, genres, year) 
      VALUES
            ($1, $2, $3, $4)`
   )

   pool.query(sql, [id, title, genres, year], (err, result) => {
      if (err) {
         console.log(err)
         res.status(500).json({ message: 'Internal Server Error' })
      } else {
         res.status(200).json({ message: 'Add movie successful' })
      }
   })
})

router.put('/update/:id', authorization, (req, res) => {
   const id = parseInt(req.params.id)
   const { title, genres, year } = req.body

   const sql = (
      `UPDATE movies 
      SET title = $1, genres = $2, year = $3 
      WHERE id = ${id}`
   )

   pool.query(sql, [title, genres, year], (err, result) => {
      if (err) {
         console.log(err)
         res.status(500).json({ message: 'Internal Server Error' })
      } else {
         res.status(200).json({ message: `Update movie successful` })
      }
   })
})

router.delete('/delete/:id', authorization, (req, res) => {
   const id = req.params.id

   const sql = (
      `DELETE FROM movies WHERE id = ${id}`
   )

   pool.query(sql, (err, result) => {
      if (err) {
         console.log(err)
         res.status(500).json({ message: 'Internal Server Error' })
      } else {
         res.status(200).json({ message: 'Movie Removed' })
      }
   })
})

module.exports = router
