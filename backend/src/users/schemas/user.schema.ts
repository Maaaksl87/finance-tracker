import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Тип Mongoose-документа користувача з доступом до методів (save, validate, тощо)
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // атвоматично додає createdAt та updatedAt поля для відстеження початку реєстрації та зміни профіля
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true }) // unique: true не дозволить створити двох юзерів з однаковим email
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);