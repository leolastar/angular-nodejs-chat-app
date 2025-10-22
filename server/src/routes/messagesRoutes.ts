import { Router } from "express";
const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");

const messageRouter = Router();

messageRouter.post("/create", createMessage);
messageRouter.post("/messages", getMessages);

module.exports = messageRouter;
