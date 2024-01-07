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
    password: {
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

const findRow = async (user)=>{
  const find = await users.findOne({ where : {name : user}})
  if(find === null){
    console.log('Not found!')
    return false
  } else{
    console.log(find)
    return true
  }
}

const addNewRow = async (name, password)=>{
  if(await findRow(name)){
    console.log("sini")
    return false
  } 

  users.create({
    name,
    password
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
  addNewRow
};
