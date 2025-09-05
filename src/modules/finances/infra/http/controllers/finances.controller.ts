/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import ICreateFinanceDTO from '../../../dtos/ICreateFinanceDTO';
import IUpdateFinanceDTO from '../../../dtos/IUpdateFinanceDTO';
import IResponseFinanceDTO from '../../../dtos/IResponseFinanceDTO';
import { lastValueFrom } from 'rxjs';

@Controller('finances')
class FinancesController {
  constructor(@Inject('FINANCES_SERVICE') private client: ClientProxy) {}

  @Get()
  async index() {
    try {
      const response = await lastValueFrom<IResponseFinanceDTO[]>(
        this.client.send({ cmd: 'finances_find_all' }, {}),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Post()
  async create(@Body() body: ICreateFinanceDTO) {
    try {
      const { user_id, valor, descricao } = body;

      const response = await lastValueFrom<IResponseFinanceDTO>(
        this.client.send(
          { cmd: 'finances_create' },
          {
            user_id,
            valor,
            descricao,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Get(':finance_id')
  async show(@Param('finance_id') finance_id: string) {
    try {
      const response = await lastValueFrom<IResponseFinanceDTO>(
        this.client.send(
          { cmd: 'finances_find' },
          {
            finance_id,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Put(':finance_id')
  async update(
    @Param('finance_id') finance_id: string,
    @Body() body: IUpdateFinanceDTO,
  ) {
    try {
      const { user_id, valor, descricao } = body;

      const response = await lastValueFrom<IResponseFinanceDTO>(
        this.client.send(
          { cmd: 'finances_update' },
          {
            finance_id,
            user_id,
            valor,
            descricao,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Delete(':finance_id')
  async delete(@Param('finance_id') finance_id: string) {
    try {
      const response = await lastValueFrom<IResponseFinanceDTO>(
        this.client.send(
          { cmd: 'finances_delete' },
          {
            finance_id,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }
}

export default FinancesController;
