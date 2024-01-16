const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tugas-akhir-be", "root", "prisella_0511", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
})

module.exports = sequelize