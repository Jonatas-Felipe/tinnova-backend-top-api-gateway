/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/shared/infra/http/app';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import IResponseFinanceDTO from '../src/modules/finances/dtos/IResponseFinanceDTO';
import ICreateFinanceDTO from '../src/modules/finances/dtos/ICreateFinanceDTO';
import IUpdateFinanceDTO from '../src/modules/finances/dtos/IUpdateFinanceDTO';
import IResponseUserDTO from '../src/modules/users/dtos/IResponseUserDTO';

describe('FinancesController (e2e)', () => {
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
    created_at: '2025-09-05T12:41:35.681Z',
    updated_at: '2025-09-05T12:41:35.681Z',
    deleted_at: '',
    is_deleted: false,
  };

  const mockFinance: IResponseFinanceDTO = {
    id: '1',
    user_id: '1',
    valor: 100.5,
    descricao: 'Compra de material',
    is_deleted: false,
    created_at: '2025-09-05T12:41:35.681Z',
    updated_at: '2025-09-05T12:41:35.681Z',
    user: mockUser,
  };

  beforeEach(async () => {
    clientProxy = {
      send: jest.fn().mockImplementation((pattern, data) => {
        if (pattern.cmd === 'finances_find_all') {
          return of([mockFinance]);
        }
        if (pattern.cmd === 'finances_create') {
          return of(mockFinance);
        }
        if (pattern.cmd === 'finances_find') {
          if (data.finance_id === '1') {
            return of(mockFinance);
          }
          throw new Error('Finance not found');
        }
        if (pattern.cmd === 'finances_update') {
          const finance_id = data.finance_id;
          delete data.finance_id;
          return of({ ...mockFinance, ...data, id: finance_id });
        }
        if (pattern.cmd === 'finances_delete') {
          return of({ id: data.finance_id, deleted: true });
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
      .overrideProvider('FINANCES_SERVICE')
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

  describe('GET /finances', () => {
    it('Deve retornar uma lista de finanças', async () => {
      const response = await request(app.getHttpServer())
        .get('/finances')
        .query({ page: 1 })
        .expect(200);

      expect(response.body).toEqual([mockFinance]);
    });
  });

  describe('POST /finances', () => {
    it('Deve criar uma nova finança', async () => {
      const createFinanceDto: ICreateFinanceDTO = {
        user_id: '1',
        valor: 100.5,
        descricao: 'Compra de material',
      };

      const response = await request(app.getHttpServer())
        .post('/finances')
        .send(createFinanceDto)
        .expect(201);

      expect(response.body).toEqual(mockFinance);
    });

    it('Deve retornar erro ao criar uma nova finança', async () => {
      const response = await request(app.getHttpServer())
        .post('/finances')
        .send({ user_id: '', valor: 'invalid', descricao: '' })
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
    });
  });

  describe('GET /finances/:finance_id', () => {
    it('Deve retornar uma finança', async () => {
      const response = await request(app.getHttpServer())
        .get('/finances/1')
        .expect(200);

      expect(response.body).toEqual(mockFinance);
    });

    it('Deve retornar erro ao buscar uma finança inexistente', async () => {
      const response = await request(app.getHttpServer())
        .get('/finances/999')
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Finance not found',
      });
    });
  });

  describe('PUT /finances/:finance_id', () => {
    it('Deve atualizar uma finança', async () => {
      const updateFinanceDto: IUpdateFinanceDTO = {
        user_id: '2',
        valor: 200.75,
        descricao: 'Compra atualizada',
      };

      const response = await request(app.getHttpServer())
        .put('/finances/1')
        .send(updateFinanceDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: '1',
        user_id: '2',
        valor: 200.75,
        descricao: 'Compra atualizada',
        is_deleted: false,
        user: mockUser,
      });
    });
  });

  describe('DELETE /finances/:finance_id', () => {
    it('Deve deletar uma finança', async () => {
      const response = await request(app.getHttpServer())
        .delete('/finances/1')
        .expect(200);

      expect(response.body).toEqual({ id: '1', deleted: true });
    });
  });
});
