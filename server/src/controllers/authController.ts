const { User } = require("../models/user");
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { signToken } from "../services/jwt";

const signup = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, password } = req.body;
    console.log("firstName", firstName);
    console.log("lastName", lastName);
    console.log("email", email);
    console.log("password", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    } as any);
    console.log("user", user);
    res.json({ result: true, message: "User created successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ result: false, message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      res.status(401).json({ result: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password as string
    );
    if (!isPasswordValid) {
      res.status(401).json({ result: false, message: "Invalid credentials" });
    }
    const token = signToken({ id: user?.id });
    delete user?.password;
    let userData = {
      id: user?.id as number,
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
      email: user?.email as string,
    };
    res.json({
      result: true,
      user: userData,
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ result: false, message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
};
