import { Request, Response } from "express";
const { Message } = require("../models/message");
import { validationResult } from "express-validator";

const createMessage = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { content, senderId, conversationId } = req.body;
    const message = await Message.create({
      content,
      senderId,
      conversationId,
    } as any);
    res.json(message as any);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.body;
    const messages = await Message.findAll({ where: { conversationId } });
    res.json(messages as any);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createMessage,
  getMessages,
};
