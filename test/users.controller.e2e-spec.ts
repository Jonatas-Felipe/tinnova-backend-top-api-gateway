/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/shared/infra/http/app';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import IResponseUserDTO from '../src/modules/users/dtos/IResponseUserDTO';
import ICreateUserDTO from '../src/modules/users/dtos/ICreateUserDTO';
import IUpdateUserDTO from '../src/modules/users/dtos/IUpdateUserDTO';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let clientProxy: ClientProxy;

  const mockUser: IResponseUserDTO = {
    id: '1',
    nome: 'Alice',
    email: 'alice@example.com',
    rua: 'Rua Exemplo',
    numero: '123',
    bairro: 'Centro',
    complemento: 'Apto 4',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '12345-678',
    status: 'ativo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: new Date().toISOString(),
    is_deleted: false,
  };

  beforeEach(async () => {
    clientProxy = {
      send: jest.fn().mockImplementation((pattern, data) => {
        if (pattern.cmd === 'users_find_all') {
          return of([mockUser]);
        }
        if (pattern.cmd === 'users_create') {
          return of(mockUser);
        }
        if (pattern.cmd === 'users_find') {
          if (data.user_id === '1') {
            return of(mockUser);
          }
          throw new Error('User not found');
        }
        if (pattern.cmd === 'users_update') {
          const user_id = data.user_id;
          delete data.user_id;
          return of({ ...mockUser, ...data, id: user_id });
        }
        if (pattern.cmd === 'users_delete') {
          return of({ id: data.user_id, deleted: true });
        }
        if (pattern.cmd === 'users_patch') {
          return of({ ...mockUser, status: data.status });
        }
        return of(null);
      }),
      connect: jest.fn(),
      close: jest.fn(),
      emit: jest.fn(),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('USERS_SERVICE')
      .useValue(clientProxy)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('Deve retornar uma lista de usuários', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .query({ page: 1, onlyActives: true })
        .expect(200);

      expect(response.body).toEqual([mockUser]);
    });
  });

  describe('POST /users', () => {
    it('Deve criar um novo usuário', async () => {
      const createUserDto: ICreateUserDTO = {
        nome: 'Alice',
        email: 'alice@example.com',
        rua: 'Rua Exemplo',
        numero: '123',
        bairro: 'Centro',
        complemento: 'Apto 4',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '12345-678',
        status: 'ativo',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toEqual(mockUser);
    });

    it('Deve retornar erro ao criar um usuário com dados inválidos', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ nome: '', email: 'invalid' })
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
    });
  });

  describe('GET /users/:user_id', () => {
    it('Deve retornar um usuário', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/1')
        .expect(200);

      expect(response.body).toEqual(mockUser);
    });

    it('Deve retornar erro ao buscar um usuário inexistente', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/999')
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'User not found',
        statusCode: 404,
      });
    });
  });

  describe('PUT /users/:user_id', () => {
    it('Deve atualizar um usuário', async () => {
      const updateUserDto: IUpdateUserDTO = {
        nome: 'Alice Updated',
        email: 'alice.updated@example.com',
        rua: 'Rua Exemplo Updated',
        numero: '123 Updated',
        bairro: 'Centro Updated',
        complemento: 'Apto 4 Updated',
        cidade: 'São Paulo Updated',
        estado: 'SP Updated',
        cep: '12345-678 Updated',
        status: 'ativo',
      };

      const response = await request(app.getHttpServer())
        .put('/users/1')
        .send(updateUserDto)
        .expect(200);

      console.log(response.body);
      console.log({ ...mockUser, ...updateUserDto });

      expect(response.body).toEqual({ ...mockUser, ...updateUserDto });
    });
  });

  describe('DELETE /users/:user_id', () => {
    it('Deve deletar um usuário', async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/1')
        .expect(200);

      expect(response.body).toEqual({ id: '1', deleted: true });
    });
  });

  describe('PATCH /users/:user_id', () => {
    it('Deve atualizar o status de um usuário', async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/1')
        .send({ status: 'inactive' })
        .expect(200);

      expect(response.body).toEqual({ ...mockUser, status: 'inactive' });
    });
  });
});
