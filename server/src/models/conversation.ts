import { Association, DataTypes, Model } from "sequelize";
import { Message } from "./message";
import { Participant } from "./conversationParticipant";
const { sequelize } = require("../config/database");

export interface ConversationAttributes {
  id: number;
  title: string;
  owner_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Conversation
  extends Model<ConversationAttributes>
  implements ConversationAttributes
{
  id!: number;
  title!: string;
  owner_id!: number;

  public readonly participants?: Participant[];
  public readonly messages?: Message[];

  public static associations: {
    participants: Association<Conversation, Participant>;
    messages: Association<Conversation, Message>;
  };
}

Conversation.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    owner_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Conversation",
    tableName: "conversations",
    timestamps: true,
  }
);

Conversation.hasMany(Participant, {
  foreignKey: "conversation_id",
  as: "participants",
});
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
});

Participant.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  as: "conversation",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  as: "conversation",
});
