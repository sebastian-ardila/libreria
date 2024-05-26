import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { LibroModule } from './libro/libro.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, LibroModule, UserModule, AuthModule],
  controllers: [UserController],
})
export class AppModule {}
