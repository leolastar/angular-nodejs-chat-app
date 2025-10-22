import { Association, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Conversation } from "./conversation";
import { Message } from "./message";
import { Participant } from "./conversationParticipant";

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;

  public readonly messages?: Message[];
  public readonly conversations?: Conversation[];
  public readonly participants?: Participant[];

  public static associations: {
    messages: Association<User, Message>;
    conversations: Association<User, Conversation>;
    participants: Association<User, Participant>;
  };
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: true }
);

User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "messages",
});
User.hasMany(Conversation, {
  foreignKey: "user_id",
  as: "conversations",
});
User.hasMany(Participant, {
  foreignKey: "user_id",
  as: "participants",
});

Participant.belongsTo(User, {
  foreignKey: "user_id",
  as: "owner",
});

Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});

Conversation.belongsTo(User, {
  foreignKey: "owner_id",
  as: "owner",
});
