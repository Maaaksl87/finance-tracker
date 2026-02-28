import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Тип Mongoose-документа користувача з доступом до методів (save, validate, тощо)
export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, unknown>) => {
      delete ret.password; // При перетворенні документа в JSON видаляємо поле password
      delete ret.__v; // Видаляємо поле __v, яке Mongoose використовує для версіювання
      return ret;
    },
  },
})
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
