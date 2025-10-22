import { Association, DataTypes, Model } from "sequelize";
import { Conversation } from "./conversation";
import { User } from "./user";
const { sequelize } = require("../config/database");

export interface ParticipantAttributes {
  id: number;
  user_id: number;
  conversation_id: number;
  joined_at?: Date;
}

export class Participant
  extends Model<ParticipantAttributes>
  implements ParticipantAttributes
{
  id!: number;
  user_id!: number;
  conversation_id!: number;

  public readonly user?: User;
  public readonly conversation?: Conversation;

  public static associations: {
    user: Association<Participant, User>;
    conversation: Association<Participant, Conversation>;
  };
}

Participant.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Participant",
    tableName: "participants",
    timestamps: true,
  }
);
