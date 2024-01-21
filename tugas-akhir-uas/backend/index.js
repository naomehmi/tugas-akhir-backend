const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
const expressWs = require('express-ws')

app.use(cors({
  credentials : true,
  origin : "http://localhost:5173",
}))
app.use(express.json())
app.use(cookieParser())
expressWs(app)

const users = require('./database/users.js')
const products = require('./database/product.js')
const account = require('./routes/account.js')
const upload = require('./routes/uploadProducts.js')
const changeAccountSettings = require('./routes/changeAccountSettings.js')
const home = require('./routes/home.js')
const editProducts = require('./routes/editProducts.js')
const chatRouter = require('./routes/chat')

users.createDb()
products.createDb()
app.use(home)
app.use(account)
app.use(changeAccountSettings)
app.use(upload)
app.use(editProducts)
app.use('/chat', chatRouter)

app.listen(PORT, console.log("App is listening on port " + PORT))
