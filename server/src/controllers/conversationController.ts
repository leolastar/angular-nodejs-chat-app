import { Request, Response } from "express";
const { Conversation } = require("../models/conversation");
import { validationResult } from "express-validator";
import { Participant } from "../models/conversationParticipant";

const createConversation = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, participants, owner } = req.body;
    console.log("owner", owner);
    console.log("participants", participants);
    console.log("title", title);
    const conversation = await Conversation.create({
      title,
      owner_id: owner,
    } as any);
    console.log("conversation", conversation);
    await Participant.create({
      user_id: owner,
      conversation_id: conversation.id,
    } as any);
    participants.forEach(async (participant: any) => {
      await Participant.create({
        user_id: participant,
        conversation_id: conversation.id,
      } as any);
    });
    res.json(conversation as any);
  } catch (error) {
    console.log("createConversation error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteConversation = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.id;
    await Conversation.destroy({ where: { id: conversationId } });
    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log("getUserConversations userId", userId);
    const conversations = await Participant.findAll({
      include: {
        model: Conversation,
        as: "conversation",
        required: true,
      },
      where: {
        user_id: userId,
      },
    });
    console.log("conversations", conversations);
    res.json(conversations as any);
  } catch (error) {
    console.log("getUserConversations error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getConversationParticipants = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.id;
    console.log("getConversationParticipants conversationId", conversationId);

    const participants = await Participant.findAll({
      include: {
        model: require("../models/user").User,
        as: "owner",
        attributes: ["id", "firstName", "lastName", "email"],
      },
      where: {
        conversation_id: conversationId,
      },
    });

    console.log("participants", participants);
    res.json(participants as any);
  } catch (error) {
    console.log("getConversationParticipants error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createConversation,
  deleteConversation,
  getUserConversations,
  getConversationParticipants,
};
