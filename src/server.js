const connectDB = require("./config/dbConfig");
const app = require("./app");
const logger = require("./utils/logger");
require("dotenv").config();

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Start the Express server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
