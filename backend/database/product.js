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

  sequelize
  .sync()
  .then(()=>{
    console.log("Products table created successfully!");
  })
  .catch((error)=>{
    console.error("Unable to create table : ", error);
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

const findProduct = async (product=null, cat)=>{
  let find;
  if(product){
    find = await products.findOne({ where : {name : product, category : cat}})
  } else{
    find = await products.findOne({ where : {category : cat}})
  }
  return find
}

const findProductById = async(id)=>{
  const find = await products.findOne({where : {id : id}})
  return find
}

const findAllProducts = async ()=>{
  const allProducts = await products.findAll()
  return allProducts
}

module.exports = {
  createDb,
  addNewRow,
  findProduct,
  findAllProducts,
  findProductById
}