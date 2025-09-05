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
          host: 'localhost',
          port: 3334,
        },
      },
    ]),
  ],
  controllers: [UsersController],
})
class UsersModule {}

export default UsersModule;
