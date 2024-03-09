const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config/config.js')

const router = express.Router()
const secretKey = 'kodeyangsangatrahasiasekali';

router.post('/', async (req, res) => {
   try {
      const { email, password } = req.body

      const sql = {
         text: 'SELECT * FROM users WHERE email = $1',
         values: [email],
      }

      const result = await pool.query(sql)
      const user = result.rows[0]

      if (!user) {
         return res.status(400).json({message: 'Not Found'})
      }

      // verify password 
      const passwordValid = await bcrypt.compare(password, user.password)

      if (!passwordValid) {
         return res.status(404).json({message: 'Incorrect email and password'})
      }

      const token = jwt.sign({ id: user.id }, secretKey, {
         expiresIn: '1h'
      })

      res.status(200).json({
         id: user.id,
         name: user.name,
         email: user.email,
         accessToken: token,
      })
   } catch (err) {
      console.error(err)
      return res.status(500).json('Sign in error')
   }
})

router.post('/register', async (req, res) => {
   try {
      const { id, email, gender, password, role } = req.body

      // cek email 
      const checkEmail = {
         text: 'SELECT * FROM users WHERE email = $1',
         values: [email],
      }

      const resultCheckEmail = await pool.query(checkEmail)
      const userExists = resultCheckEmail.rows.length > 0

      if (userExists) {
         return res.status(409).json({ message: 'Email is registered' })
      }

      // create user 
      const hashedPassword = await bcrypt.hash(password, 15)
      const createUser = {
         text: 'INSERT INTO users(id, email, gender, password, role) VALUES($1, $2, $3, $4, $5)',
         values: [id, email, gender, hashedPassword, role],
      }

      await pool.query(createUser)
      return res.status(200).json({ message: 'Registration user successful' })
   } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Error registering user' })
   }
})


module.exports = router