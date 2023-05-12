import { Sequelize } from "sequelize";
import config from "./index";

const {
  DATABASE_DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  dialectOptions,
} = config;



export const db = new Sequelize(
  DATABASE_DATABASE_NAME!,
  DATABASE_USERNAME!,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    port: 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions
  }
);

export async function connectToDatabase() {
  try {
    await db.sync();
    console.log("DB connected successfully!!!!");
  } catch (error) {
    console.log(error);
  }
}


