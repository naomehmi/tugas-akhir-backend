const express = require('express')
const router = express.Router()


router.use(express.text())

const { addNewRow } = require('../database/database.js')

router.post('/register', async (req,res)=>{
  if(!req.body.name || !req.body.password){
    res.send({message : "Please enter username and password"})
  }

  const {name, password} = req.body

  const added = addNewRow(name, password)

  console.log("added :",added)

  if(!added){
    res.send({message : "Username is already taken"})
    return
  }

  console.log("user is added")
  res.status(201).send({message : "Account has been successfully created"})
})

router.post('/login', async(req, res)=>{
  if(!req.body.name || !req.body.password){
    res.send({message : "Please enter username and password"})
  }
})

module.exports = router