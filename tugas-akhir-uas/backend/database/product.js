const { DataTypes } = require("sequelize")

const sequelize = require('./dbconfig.js')

let products

const createDb = ()=>{
  products = sequelize.define("products", {
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
    category : {
      type : DataTypes.INTEGER,
      allowNull: false,
    },
    price : {
      type : DataTypes.INTEGER,
      allowNull : false
    }
    ,
    photo : {
      type :  DataTypes.STRING
    }
  });
}

const addNewRow = async (name, category, price, photo)=>{
    products.create({
    name,
    category,
    price,
    photo
  })
  .then(res => {
    console.log(res)
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
}

const findProduct = async (product, cat)=>{
  const find = await products.findOne({ where : {name : product, category : cat}})
  return find
}

module.exports = {
  createDb,
  addNewRow,
  findProduct
}