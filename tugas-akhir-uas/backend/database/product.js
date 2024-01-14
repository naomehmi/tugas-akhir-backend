const { sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize("tugas-akhir-be", "root", "prisella_0511", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
})

let products // sini kita tarok database penuh dengan jusnya

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
  });
}