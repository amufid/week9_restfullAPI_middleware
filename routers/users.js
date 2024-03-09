const pool = require('../config/config.js')
const express = require('express')
const bcrypt = require('bcrypt')
const {authorization} = require("../middlewares/auth.js")

const router = express.Router()

router.get('/paginate', (req, res) => {
   const defaultPage = 1
   const defaultLimit = 10
   const page = parseInt(req.query.page) || defaultPage
   const limit = parseInt(req.query.limit) || defaultLimit

   const offset = (page - 1) * limit
   const startIndex = offset + 1
   const endIndex = page * limit
   const starrEndIndex = { startIndex, endIndex }

   const sql = (
      'SELECT * FROM users ORDER BY id OFFSET $1 LIMIT $2'
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
   pool.query('SELECT * FROM users', (err, result) => {
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
      `SELECT * FROM users WHERE id = ${id}`
   )

   pool.query(sql, (err, result) => {
      if (err) {
         console.log(err)
         res.status(500).json({ message: 'Internal Server Error' })
      } else {
         if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found' })
         }else{
            res.status(200).json(result.rows[0])
         }
      }
   })
})

router.put('/update/:id', authorization, async (req, res) => {
   try {
      const id = parseInt(req.params.id)
      const { email, gender, password, role } = req.body

      // check email 
      const checkEmail = {
         text: 'SELECT * FROM users WHERE email = $1',
         values: [email],
      }

      const resultCheckEmail = await pool.query(checkEmail)
      const userExists = resultCheckEmail.rows.length > 0

      if (userExists) {
         return res.status(400).json({ message: 'Email is registered' })
      }

      // create user 
      const hashedPassword = await bcrypt.hash(password, 15)
      const updateUser = {
         text: `UPDATE users SET email = $1, gender = $2, password = $3, role = $4 WHERE id = ${id}`,
         values: [email, gender, hashedPassword, role],
      }

      await pool.query(updateUser)

      return res.status(200).json({ message: 'Update user successful' })
   } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Error update user' })
   }
})

router.delete('/delete/:id', authorization, (req, res) => {
   const id = req.params.id

   const sql = (
      `DELETE FROM users WHERE id = ${id}`
   )

   pool.query(sql, (err, result) => {
      if (err) {
         console.log(err)
         return res.status(500).json({ message: 'Internal Server Error' })
      } else {
         res.status(200).json({ message: 'User Removed' })
      }
   })
})

module.exports = router
