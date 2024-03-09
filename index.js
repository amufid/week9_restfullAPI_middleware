const express = require('express')
const routerUsers = require('./routers/users.js')
const routerMovies = require('./routers/movies.js')
const routerAuth = require('./routers/auth.js')
const swaggerUi = require('swagger-ui-express')
const morgan = require('morgan')
const YAML = require('yamljs')
const path = require('path')
const {authentication} = require("./middlewares/auth.js")
const errorHandler = require('./middlewares/errorHandler.js')

const app = express()
const PORT = 3000

app.use(morgan('common'))
app.use(express.json())

const swaggerDocument = YAML.load(path.resolve(__dirname, './data.yaml'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/auth', routerAuth)
app.use(authentication)
app.use('/users', routerUsers)
app.use('/movies', routerMovies)
app.use(errorHandler)

app.listen(PORT, () => {
   console.log(`Server running at localhost:${PORT}...`)
})
