const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("tugas-akhir-be", "root", "prisella_0511", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
})

let users

const connectToSql = ()=>{
  sequelize
    .authenticate()
    .then(()=>{
      console.log("Connection has been established successfully.");
    })
    .catch((error)=>{
      console.error("Unable to connect to the database: ", error);
    });
}

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
  console.log("find :",find)
  return find
}

const addNewRow = async (name, hash)=>{
  if(await findUser(name)){
    console.log("sini")
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
  sequelize,
  connectToSql,
  createDb,
  addNewRow,
  findUser
};
