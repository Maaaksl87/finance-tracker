import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema'; // Імпорт нашої схеми
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    // Реєструємо схему. Для використання моделі User у сервісі
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Експортуємо сервіс, щоб інші модулі (наприклад, Auth) могли ним користуватися
})
export class UsersModule {}
