import express from "express";
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import { sequelize } from "./config/database";
import { initSocket } from "./services/socket";
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messagesRoutes");
const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const messageThrottle = require("./middleware/ratelimiter");
import dotenv from "dotenv";
import path from "path";
dotenv.config();

console.log("process.env.CLIENT_URL", process.env.CLIENT_URL);

export const app = express();
const httpServer = new Server(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*", credentials: true },
});

app.use(cors());
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/auth", authRouter);
app.use("/users", authMiddleware, userRouter);
app.use("/conversations", authMiddleware, conversationRouter);
app.use("/messages", authMiddleware, messageThrottle, messageRouter);

app.use(errorHandler);

// Socket.io integration
initSocket(io);

const PORT = process.env.PORT || 4000;
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Sequelize synced");
    httpServer.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err: any) => {
    console.log("Sequelize error", err);
  });
