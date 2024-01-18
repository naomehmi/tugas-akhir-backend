const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const SaltRounds = 10
const jwt = require('jsonwebtoken')
const secret = require('../super duper top secret/xixixi.js')

router.use(express.text())

const { addNewRow, findUser } = require('../database/users.js')

// middleware to validate/authenticate username and password
validateInput = async (req, res, next)=>{
  console.log("authenticating...")
  try{
    const auth = Buffer.from(req.headers.authorization, 'base64').toString('utf8').split(":")
    console.log(auth)
    if(auth === undefined){
      res.status(502).send({message : "please log in first"})
    }
    res.locals.username = auth[0]
    res.locals.password = auth[1]
    if(!res.locals.username || !res.locals.password){
      res.status(502).send({message : "Please enter username and password"})
      return
    }
    if(res.locals.username.match(/\W/) || res.locals.password.match(/\W/) || auth.length > 2){
      res.status(502).send({message : "Please only use letters, numbers, or underscore (_)"})
      return
    }
    res.locals.user = await findUser(res.locals.username)
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
  if(res.locals.user){
    res.send({message : "Username is already taken"})
    return
  }

  const hash = await bcrypt.hash(res.locals.password, SaltRounds)
  await addNewRow(res.locals.username, hash)

  console.log(`${res.locals.username} is added to the database`)
  res.status(201).send({message : "Account has been successfully created"})
})

router.post('/login', validateInput, async(req, res)=>{
  if(res.locals.user){
    const { name, hash, profilePic} = res.locals.user
    const validPass = await bcrypt.compare(res.locals.password, hash)
    if(validPass){
      const token = jwt.sign({name : name, pic : profilePic}, secret, { expiresIn : "2h" })
      res.cookie("jwt-token", token, {httpOnly : true})
      res.status(200).send({message : "you are logged in", acc : true})
      return
    }
  }
  res.status(400).send({message : "there is something wrong with your password or username", acc : false})
})

router.get('/user', (req,res,next)=>{
  console.log('cookies :',req.cookies)
  token = req.cookies["jwt-token"]
  if(!token){
    res.send({msg : "please log in first :)"})
    return
  } 
  next()
}, (req,res)=>{
  try{
    const decoded = jwt.verify(token, secret)
    const {name, pic} = decoded
    console.log(decoded)
    res.send({name : name, pic : pic})
  }
  catch(err){
    res.status(500).send('something went wrong')
  }
})

module.exports = router
