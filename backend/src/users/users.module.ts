import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema'; // Імпорт нашої схеми

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
