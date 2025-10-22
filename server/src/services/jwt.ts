const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

export const signToken = (payload: object, expiresIn = "1h") =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);
