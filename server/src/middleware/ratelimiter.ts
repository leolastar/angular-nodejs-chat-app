import rateLimit from "express-rate-limit";

const messageThrottle = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many messages sent, please slow down",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = messageThrottle;
