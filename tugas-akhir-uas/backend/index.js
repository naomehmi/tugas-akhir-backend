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
const account = require('./routes/account.js')
const upload = require('./routes/uploadProducts.js')
const changeAccountSettings = require('./routes/changeAccountSettings.js')
const home = require('./routes/home.js')
const editProducts = require('./routes/editProducts.js')

users.createDb()
products.createDb()
app.use(home)
app.use(account)
app.use(changeAccountSettings)
app.use(upload)
app.use(editProducts)

app.listen(PORT, console.log("App is listening on port " + PORT))