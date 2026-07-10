import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, SchemaTypes } from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type SavingPlanDocument = HydratedDocument<SavingPlan>;

export enum SavingPlanStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PAUSED = "paused",
}

@Schema({ timestamps: true, collection: "saving-plans" })
export class SavingPlan {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  icon: string;

  @Prop({ required: true, min: 0 })
  targetAmount: number;

  @Prop({ default: 0, min: 0 })
  currentAmount: number;

  @Prop({
    type: String,
    enum: SavingPlanStatus,
    default: SavingPlanStatus.ACTIVE,
  })
  status: SavingPlanStatus;

  @Prop({ required: false })
  deadline: Date;

  @Prop({ required: false })
  description: string;
}

export const SavingPlanSchema = SchemaFactory.createForClass(SavingPlan);
