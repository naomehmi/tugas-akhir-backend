const express = require('express')
const jwt = require('jsonwebtoken')
const { secret } = require('../super duper top secret/xixixi.js')

const isUser = (req,res,next)=>{
  const token = jwt.verify(req.headers.authorization, secret)

  if(token.role !== "user"){
    res.status(403).end()
    return
  }
  next()
}

const isAdmin = (req,res,next)=>{
  const token = jwt.verify(req.headers.authorization, secret)

  if(token.role !== "admin"){
    res.status(403).end()
    return
  }
  next()
}

module.exports = {isUser, isAdmin}