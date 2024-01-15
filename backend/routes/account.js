const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const SaltRounds = 10

router.use(express.text())

const { addNewRow, findUser } = require('../database/users.js')

let username, password, user
// middleware to validate/authenticate username and password
validateInput = async (req, res, next)=>{
  console.log("authenticating...")
  try{
    const auth = Buffer.from(req.headers.authorization, 'base64').toString('utf8').split(":")
    console.log(auth)
    if(auth === undefined){
      res.status(502).send({message : "please log in first"})
    }
    username = auth[0]
    password = auth[1]
    if(!username || !password){
      res.status(502).send({message : "Please enter username and password"})
      return
    }
    if(username.match(/\W/) || password.match(/\W/) || auth.length > 2){
      res.status(502).send({message : "Please only use letters, numbers, or underscore (_)"})
      return
    }
    user = await findUser(username)
  } catch(err){
    console.error(err)
    res.status(400).send({message : "there is something wrong with your password or username", acc : false})
    return
  }
  next()
}

// session table [session id, user id], generate session id after login

// post logout, authorization = session id, delete session id from session table

router.post('/register', validateInput, async (req, res)=>{
  if(user){
    res.send({message : "Username is already taken"})
    return
  }

  const hash = await bcrypt.hash(password, SaltRounds)
  await addNewRow(username, hash)

  console.log(`${username} is added to the database`)
  res.status(201).send({message : "Account has been successfully created"})
})

router.post('/login', validateInput, async(req, res)=>{
  if(user){
    const validPass = await bcrypt.compare(password, user.hash)
    if(validPass){
      res.status(200).send({message : "you are logged in", acc : true})
      return
    }
  }
  res.status(400).send({message : "there is something wrong with your password or username", acc : false})
})

router.get('/user', (req,res,next)=>{
  if(!username || !password){
    res.send({msg : "please log in first :)"})
    return
  } 
  next()
}, (req,res)=>{
  res.send({name : username, pic : ''})
})

module.exports = router
