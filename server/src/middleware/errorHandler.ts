import { Request, Response, NextFunction } from "express";
const { ValidationError } = require("class-validator");

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
};

module.exports = errorHandler;
