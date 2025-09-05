import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import FinancesController from './infra/http/controllers/finances.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FINANCES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TOP_FINANCE_HOST ?? 'localhost',
          port: parseInt(process.env.TOP_FINANCE_PORT ?? '3335'),
        },
      },
    ]),
  ],
  controllers: [FinancesController],
})
class FinancesModule {}

export default FinancesModule;
