import { Router } from "express";
const {
  createConversation,
  deleteConversation,
  getUserConversations,
  getConversationParticipants,
} = require("../controllers/conversationController");

const conversationRouter = Router();

conversationRouter.post("/conversation", createConversation);
conversationRouter.delete("/conversation/:id", deleteConversation);
conversationRouter.get("/conversations/:id", getUserConversations);
conversationRouter.get("/participants/:id", getConversationParticipants);

module.exports = conversationRouter;
