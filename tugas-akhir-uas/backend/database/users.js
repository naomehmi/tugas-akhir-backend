const { DataTypes } = require("sequelize");

const sequelize = require('./dbconfig.js')

let users

const createDb = ()=>{
  users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePic: {
      type: DataTypes.STRING,
      defaultValue: "../../public/uploads/profile/default.jpg"
    }
  });

  sequelize
  .sync()
  .then(()=>{
    console.log("Users table created successfully!");
  })
  .catch((error)=>{
    console.error("Unable to create table : ", error);
  });
};

const findUser = async (user)=>{
  const find = await users.findOne({ where : {name : user}})
  return find
}

const addNewRow = async (name, hash)=>{
  if(await findUser(name)){
    return false
  } 

  console.log()

  users.create({
    name,
    hash
  })
  .then(res => {
    console.log(res)
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });

  return true
}

module.exports = {
  createDb,
  addNewRow,
  findUser
};
