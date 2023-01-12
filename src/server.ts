import { config } from "dotenv";
config({ path: ".env" });
import app from "./app";
import CustomErrorHandler from "./utils/CustomError.Handler";
import Connect__Database from "./DB/config.Database";
import cluster from "cluster";

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

async function startServer() {
  try {
    // Connect to the database

    // Start the server
    app.listen(PORT, async () => {
      await Connect__Database(PORT);
    });
  } catch (error) {
    CustomErrorHandler.serverError(error.message);
  }
}

startServer();
