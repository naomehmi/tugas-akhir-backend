const express = require('express')
const {findUser} = require('../database/users')

validateInput = async (req, res, next)=>{
  console.log("authenticating...")
  try{
    const auth = Buffer.from(req.headers.authorization, 'base64').toString('utf8').split(":")

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

module.exports = validateInput