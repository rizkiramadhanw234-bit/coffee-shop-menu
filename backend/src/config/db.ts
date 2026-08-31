import { DataSource } from "typeorm";
import { entities } from "../entities/index.js";
import dotenv from "dotenv";

dotenv.config();

export const appDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities,
});

export async function dbConnection() {
  try {
    const connection = await appDataSource.initialize();
    console.log("database is connected", connection.options.database);
  } catch (error) {
    console.log("failed connecting to database!", error);
  }
}
