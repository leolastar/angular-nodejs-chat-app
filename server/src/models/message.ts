import { Association, DataTypes, Model } from "sequelize";
import { User } from "./user";
import { Conversation } from "./conversation";
const { sequelize } = require("../config/database");

export interface MessageAttributes {
  id: number;
  content: string;
  sender_id: number;
  conversation_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Message
  extends Model<MessageAttributes>
  implements MessageAttributes
{
  id!: number;
  content!: string;
  sender_id!: number;
  conversation_id!: number;

  public readonly sender?: User;
  public readonly conversation?: Conversation;

  public static associations: {
    sender: Association<Message, User>;
    conversation: Association<Message, Conversation>;
  };
}

Message.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    sender_id: { type: DataTypes.INTEGER, allowNull: false },
    conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Message", tableName: "messages", timestamps: true }
);
