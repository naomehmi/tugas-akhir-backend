const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tugas-akhir-be", "root", "prisella_0511", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = sequelize;
