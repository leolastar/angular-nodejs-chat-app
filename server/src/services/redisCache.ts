import { redisClient } from "../config/redis";
import { Message } from "../models/message";

/**
 * Cache key format:
 *   convo:{id}:messages   → list of message IDs (LRANGE)
 *   msg:{id}              → JSON of message
 */

export const cacheMessage = async (msg: Message) => {
  const key = `msg:${msg.id}`;
  await redisClient.set(key, JSON.stringify(msg));
  await redisClient.rpush(`convo:${msg.conversation_id}:messages`, msg.id);
};

export const getConversationMessages = async (convoId: number) => {
  const ids = await redisClient.lrange(`convo:${convoId}:messages`, 0, -1);
  const msgs = await Promise.all(ids.map((id) => redisClient.get(`msg:${id}`)));
  return msgs.map((json) => JSON.parse(json as string));
};
