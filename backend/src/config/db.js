const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    // logging: false, // Disable logging; default: console.log
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000,
    // },
  }
);

// Function to connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données réussie.");
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données :", error);
    process.exit(1); // Exit the process with failure
  }
};

// Export the sequelize instance and connectDB function
module.exports = {
  sequelize,
  connectDB,
};
