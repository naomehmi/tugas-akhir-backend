const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const SaltRounds = 10

router.use(express.text())

const { addNewRow, findUser } = require('../database/database.js')
// middleware to validate/authenticate username and password

const middleWare = (req, res, next)=>{
  next()
}

// app.post('/simpan', middlewareFunction, (req,res)=>{...})

// encode username:password pakai base64

// session table [session id, user id], generate session id after login

// post logout, authorization = session id, delete session id from session table

router.post('/register', async (req,res)=>{
  if(!req.body.name || !req.body.password){
    res.send({message : "Please enter username and password"})
  }

  const {name, password} = req.body

  // check if the username has already existed
  const added = await findUser(name)
  console.log("added :",added)

  if(added){
    res.send({message : "Username is already taken"})
    return
  }

  const hash = await bcrypt.hash(password, SaltRounds)
  await addNewRow(name, hash)

  console.log("user is added")
  res.status(201).send({message : "Account has been successfully created"})
})

router.post('/login', async(req, res)=>{
  if(!req.body.name || !req.body.password){
    res.send({message : "Please enter username and password"})
  }

  const { name, password} = req.body

  const user = await findUser(name)
  if(user){
    const validPass = await bcrypt.compare(password, user.hash)
    if(validPass){
      res.status(200).send({message : "you are logged in", acc : true})
      return
    }
    res.status(404).send({message : "there is something wrong with your password or username", acc : false})
  }
})

module.exports = router
