import { Router } from "express";
const {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
} = require("../controllers/userControler");

const userRouter = Router();

userRouter.get("/user/:id", getUserProfile);
userRouter.put("/user/:id", updateUserProfile);
userRouter.delete("/user/:id", deleteUser);
userRouter.get("/users", getAllUsers);

module.exports = userRouter;
