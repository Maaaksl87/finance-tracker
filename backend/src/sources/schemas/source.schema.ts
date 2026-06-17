import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

import { User } from "src/users/schemas/user.schema";

export type SourceDocument = HydratedDocument<Source>;

@Schema({ timestamps: true })
export class Source {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
