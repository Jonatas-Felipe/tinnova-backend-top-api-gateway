import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import UsersController from './infra/http/controllers/users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TOP_USERS_HOST ?? 'localhost',
          port: parseInt(process.env.TOP_USERS_PORT ?? '3334'),
        },
      },
    ]),
  ],
  controllers: [UsersController],
})
class UsersModule {}

export default UsersModule;
