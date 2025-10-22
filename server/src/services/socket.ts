import { Server } from "socket.io";
const { cacheMessage, getConversationMessages } = require("./redisCache");
const { Message } = require("../models/message");
const { User } = require("../models/user");
const { Conversation } = require("../models/conversation");
const { Participant } = require("../models/conversationParticipant");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

export const initSocket = (io: Server) => {
  console.log("initSocket");
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.user = payload; // attach user data
      return next();
    } catch {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("connection socket.data.user", socket.data.user);
    const userId = socket.data.user.id;
    console.log("userId", userId);

    socket.on(
      "join_room",
      async (payload: {
        conversation_id: number;
        firstName: string;
        lastName: string;
      }) => {
        socket.join("room_" + payload.conversation_id);
        console.log(
          "conversation_id",
          payload.firstName,
          payload.lastName,
          payload.conversation_id
        );

        const msgs = await getConversationMessages(payload.conversation_id);
        io.emit("loadHistory", msgs);
        io.emit("user_joined", {
          conversation_id: payload.conversation_id,
          userId: userId,
          content: `${payload.firstName} ${payload.lastName} has joined the conversation`,
        });
      }
    );

    socket.on(
      "sendMessage",
      async (payload: {
        conversation_id: number;
        content: string;
        firstName: string;
        lastName: string;
      }) => {
        console.log("sendMessage", payload);
        const msg = await Message.create({
          conversation_id: payload.conversation_id,
          sender_id: userId as number,
          content: `${payload.firstName} ${payload.lastName} : ${payload.content}`,
        } as any);
        // console.log("msg", msg);
        await cacheMessage(msg);
        io.emit("newMessage", {
          message: msg,
          conversation_id: payload.conversation_id,
          sender_id: userId,
          content: `${payload.firstName} ${payload.lastName} : ${payload.content}`,
        });
      }
    );

    // Load historical messages on demand
    socket.on("loadHistory", async (convoId: number) => {
      const msgs = await getConversationMessages(convoId);
      socket.emit("history", msgs);
    });

    // Optional: handle typing indicator
    socket.on("typing", ({ conversation_id }) => {
      socket.emit("typing", { userId });
    });
  });
};
