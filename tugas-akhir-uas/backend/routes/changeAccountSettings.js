const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const {findUser} = require('../database/users.js')
const jwt = require('jsonwebtoken')
const {secret} = require('../super duper top secret/xixixi.js')
const bcrypt = require('bcrypt')
const SaltRounds = 10
const {isUser} = require('../middleware/role.js')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        __dirname,
        "..",
        "..",
        "frontend",
        "public",
        "uploads",
        "profile"
      )
    );
  },
  filename: (req, file, cb) => {
    const origin = file.originalname.split(".")
    cb(null, origin[0] + "-" + Date.now() + "." + origin[1]);
  },
});

const upload = multer({
  storage : storage,
})

router.use(express.static(__dirname));
router.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "uploads",
      "profile"
    )
  )
);

router.post("/profile-pic", upload.single("newProf"), isUser, async (req, res) => {
  const user = jwt.verify(req.headers.authorization, secret)
  const row = await findUser(user.name)

  row.profilePic = "../../public/uploads/profile/" + req.file.filename

  await row.save()
  
  const updatedToken = jwt.sign({name : row.name, pic : row.profilePic, role : row.role}, secret, { expiresIn : "2h" })

  res
    .status(201)
    .send({ msg: "Profile pic has successfully been changed", updatedToken});
});

router.post("/new_name", isUser, async (req, res)=>{
  if(!req.body){
    res.status(401).send("Please fill in a value")
    return
  }
  const newName = req.body

  const {name} = jwt.verify(req.headers.authorization, secret)

  if(newName.toLowerCase() === name.toLowerCase()){
    res.status(304).send({msg : "nothing changed bro"})
    return
  }

  const duplicate = await findUser(newName)

  console.log(duplicate)

  if(duplicate){
    res.status(401).send({msg : "this username is taken"})
    return
  }

  const account = await findUser(name)

  account.name = newName

  await account.save()

  const updatedToken = jwt.sign({name : account.name, pic : account.profilePic, role : account.role}, secret, { expiresIn : "2h" })

  res.status(201).send({msg : "username successfully changed", updatedToken})
})

router.post("/new_pass", isUser, async (req, res)=>{
  const data = Buffer.from(req.headers.authorization, 'base64').toString('utf8').split(":")
  console.log(data)
  oldPass = data[0]
  newPass = data[1]
  token = req.headers.authorization

  if(!oldPass || !newPass || !token){
    res.status(401).send({msg : "Please fill in a value"})
    return
  }

  if(oldPass === newPass){
    res.status(401).send({msg : "Nothing changed bro"})
    return
  }

  const { name } = jwt.verify(token, secret)

  console.log(name)

  const user = await findUser(name)

  const correctPass = await bcrypt.compare(oldPass, user.hash)
  if(!correctPass){
    res.status(401).send({msg : "wrong password"})
    return
  }
  
  user.hash = await bcrypt.hash(newPass, SaltRounds)
  
  await user.save()

  const updatedToken = jwt.sign({name : user.name, pic : user.profilePic, role : user.role}, secret, { expiresIn : "2h" })

  res.status(201).send({msg : "new password has been set", updatedToken})
})

module.exports = router