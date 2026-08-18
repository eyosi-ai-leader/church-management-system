const app = require("./app");
const env = require("./config/env");
const pool = require("./config/db");

const startServer = async () => {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();

    // Start server
    app.listen(env.PORT, () => {
      console.log(
        `🚀 Server is running on http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to connect to MySQL");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();