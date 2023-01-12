import { connection, connect, set, ConnectOptions } from "mongoose";

set("strictQuery", true);

const Connect__Database = async (port: number) => {
  try {
    const connectionOptions = {
      dbName: "Authentication__API",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions;

    connect("mongodb://localhost:27017", connectionOptions);

    connection.on("connected", () => {
      console.log(`Server is running on PORT ${port} and connected to database`);
    });
    connection.on("error", (error) => {
      throw error;
    });
    connection.on("disconnected", () => {
      console.log("Disconnected from database");
    });
    process.on("SIGINT", async () => {
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default Connect__Database
