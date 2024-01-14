const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const db = require('./database/database.js')
const account = require('./routes/account.js')

db.connectToSql()
db.createDb()

app.use(account)

app.listen(3000)
