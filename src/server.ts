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

if (cluster.isPrimary) {
  // Create a single worker
  cluster.fork();

  // Listen for exit events from workers and fork a new worker to replace the one that died
  cluster.on("exit", (worker, code, signal) => {
    // Check if there are no workers
    if (!cluster.workers || Object.keys(cluster.workers).length === 0) {
      // There are no workers, fork a new worker
      cluster.fork();
    }
  });
} else if (cluster.isWorker) {
  // This is a worker process, start the server
  startServer();
}
