import { Module } from '@nestjs/common';

import UsersModule from '../../../modules/users/users.module';
import FinancesModule from '../../../modules/finances/finances.module';

@Module({
  imports: [UsersModule, FinancesModule],
})
export class AppModule {}
