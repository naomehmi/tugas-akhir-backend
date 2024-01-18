const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3000
const cookieParser = require('cookie-parser')

app.use(cors({
  credentials : true,
  origin : "http://localhost:5173",
}))
app.use(express.json())
app.use(cookieParser())

const users = require('./database/users.js')
const products = require('./database/product.js')
const messages = require('./database/messages.js')
const account = require('./routes/account.js')
const upload = require('./routes/uploadProducts.js')

users.createDb()
products.createDb()
messages.createDb()
app.use(account)
app.use(upload)

app.listen(PORT, console.log("App is listening on port " + PORT))