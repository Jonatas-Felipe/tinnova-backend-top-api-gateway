/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUpdateUserDTO from '../../../dtos/IUpdateUserDTO';
import IResponseUserDTO from '../../../dtos/IResponseUserDTO';
import { lastValueFrom } from 'rxjs';

@Controller('users')
class UsersController {
  constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {}

  @Get()
  async index(@Query('page') page: number | undefined) {
    try {
      const response = await lastValueFrom<IResponseUserDTO[]>(
        this.client.send(
          { cmd: 'users_find_all' },
          {
            page,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Post()
  async create(@Body() body: ICreateUserDTO) {
    try {
      const {
        nome,
        email,
        rua,
        numero,
        bairro,
        complemento,
        cidade,
        estado,
        cep,
        status,
      } = body;

      const response = await lastValueFrom<IResponseUserDTO>(
        this.client.send(
          { cmd: 'users_create' },
          {
            nome,
            email,
            rua,
            numero,
            bairro,
            complemento,
            cidade,
            estado,
            cep,
            status,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Get(':user_id')
  async show(@Param('user_id') user_id: string) {
    try {
      const response = await lastValueFrom<IResponseUserDTO>(
        this.client.send(
          { cmd: 'users_find' },
          {
            user_id,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Put(':user_id')
  async update(
    @Param('user_id') user_id: string,
    @Body() body: IUpdateUserDTO,
  ) {
    try {
      const {
        nome,
        email,
        rua,
        numero,
        bairro,
        complemento,
        cidade,
        estado,
        cep,
        status,
      } = body;

      const response = await lastValueFrom<IResponseUserDTO>(
        this.client.send(
          { cmd: 'users_update' },
          {
            user_id,
            nome,
            email,
            rua,
            numero,
            bairro,
            complemento,
            cidade,
            estado,
            cep,
            status,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Delete(':user_id')
  async delete(@Param('user_id') user_id: string) {
    try {
      const response = await lastValueFrom<IResponseUserDTO>(
        this.client.send(
          { cmd: 'users_delete' },
          {
            user_id,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }

  @Patch(':user_id')
  async patch(
    @Param('user_id') user_id: string,
    @Body() { status }: { status: string },
  ) {
    try {
      const response = await lastValueFrom<IResponseUserDTO>(
        this.client.send(
          { cmd: 'users_patch' },
          {
            user_id,
            status,
          },
        ),
      );

      return response;
    } catch (error) {
      throw new NotFoundException(error?.message || 'Erro do microserviço');
    }
  }
}

export default UsersController;
