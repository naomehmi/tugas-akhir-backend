const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const SaltRounds = 10
const jwt = require('jsonwebtoken')
const { secret, AdminUserName, AdminPassword } = require('../super duper top secret/xixixi.js')
const { addNewRow } = require('../database/users.js')
const validateInput = require('../middleware/validateInput.js')

router.use(express.text())


router.post('/register', validateInput, async (req, res)=>{
  if(res.locals.user){
    res.send({message : "Username is already taken"})
    return
  }

  const hash = await bcrypt.hash(res.locals.password, SaltRounds)
  
  if(res.locals.username === AdminUserName && res.locals.password === AdminPassword){
    await addNewRow(AdminUserName, hash, "admin")
  } else if(res.locals.username === AdminUserName && res.locals.password !== AdminPassword){
    res.send({message : "invalid credentials"})
    return
  } else{
    await addNewRow(res.locals.username, hash)
  }

  console.log(`${res.locals.username} is added to the database`)
  res.status(201).send({message : "Account has been successfully created"})
})

router.post('/login', validateInput, async(req, res)=>{
  if(res.locals.user){
    const { name, hash, profilePic, role} = res.locals.user
    const validPass = await bcrypt.compare(res.locals.password, hash)
    if(validPass){
      const token = jwt.sign({name : name, pic : profilePic, role : role}, secret, { expiresIn : "2h" })
      res.status(200).send({message : "you are logged in", acc : token})
      return
    }
  }
  res.status(400).send({message : "there is something wrong with your password or username", acc : false})
})

router.get('/user', (req,res,next)=>{
  res.locals.token = req.headers.authorization
  if(!res.locals.token){
    res.send({msg : "please log in first :)"})
    return
  } 
  next()
}, (req,res)=>{
  try{
    const decoded = jwt.verify(res.locals.token, secret)
    const {name, pic, role} = decoded
    res.send({name : name, pic : pic, role : role})
  }
  catch(err){
    res.status(500).send({msg : 'something went wrong'})
  }
})
module.exports = router
