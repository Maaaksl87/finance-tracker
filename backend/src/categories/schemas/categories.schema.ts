import { HydratedDocument, Types, SchemaTypes } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { User } from "src/users/schemas/user.schema";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, trim: true, maxlength: 30 })
    name: string;

    @Prop({ required: true, enum: ["income", "expense"] })
    type: string;

    @Prop({ required: true })
    color: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });
