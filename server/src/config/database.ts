const { Sequelize } = require("sequelize");
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
  {
    dialect: "postgres",
    logging: false,
    pool: { max: 10, min: 0, idle: 10000 },
  }
);
