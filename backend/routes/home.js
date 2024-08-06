const express = require('express')
const { findAllProducts, findProduct } = require('../database/product')
const router = express.Router()

router.get('/', async (req,res)=>{
  const temp = await findAllProducts()
  res.send(temp)
})

module.exports = router