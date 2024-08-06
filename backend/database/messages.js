const { DataTypes } = require("sequelize")

const sequelize = require('./dbconfig.js')

const createDb = ()=>{
  const messages = sequelize.define("messages", {
    id : {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    test: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
}

module.exports = {
  createDb
}