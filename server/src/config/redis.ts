import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

console.log("this is the redis client");
console.log("REDIS_HOST", process.env.REDIS_HOST);
console.log("REDIS_PORT", process.env.REDIS_PORT);
console.log("REDIS_PASSWORD", process.env.REDIS_PASSWORD);
console.log("REDIS_URL", process.env.REDIS_URL);

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  connectTimeout: 10000,
});

// Add error handling
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("ready", () => {
  console.log("Redis is ready to accept commands");
});

redisClient.on("close", () => {
  console.log("Redis connection closed");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});
