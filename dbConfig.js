const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE || "PolytechnicLibrary",
  trustServerCertificate: true,
  options: {
    encrypt: true, // Use encryption
    port: parseInt(process.env.DB_PORT), // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));

module.exports = {
  sql,
  poolPromise,
};
