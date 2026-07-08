import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type IntegrationDocument = HydratedDocument<Integration>;

@Schema({ timestamps: true })
export class Integration {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    exchange: string;

    @Prop({ required: true })
    apiKeyEncrypted: string;

    @Prop({ required: true })
    apiSecretEncrypted: string;

    @Prop({ type: Types.ObjectId, ref: "Source", required: true })
    sourceId: Types.ObjectId;

    @Prop()
    lastSyncedAt: Date;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);
