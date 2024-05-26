import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Pool } from 'pg';
import * as request from 'supertest';

let app: INestApplication;
let pool: Pool;
let jwtToken: string;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'libreriatest',
  });

  await pool.query(`
    TRUNCATE TABLE users, libros RESTART IDENTITY CASCADE;
  `);

  // Crear usuario de prueba a través de una solicitud HTTP
  await request(app.getHttpServer())
    .post('/users')
    .send({ username: 'testuser', password: 'password' })
    .expect(201);

  // Autenticar al usuario de prueba para obtener el token JWT
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ username: 'testuser', password: 'password' });

  jwtToken = loginResponse.body.access_token;

  await pool.query(`
    INSERT INTO libros (titulo, autor, publicacion) VALUES
    ('Libro de Prueba 1', 'Autor de Prueba 1', 2021),
    ('Libro de Prueba 2', 'Autor de Prueba 2', 2022);
  `);
});

afterAll(async () => {
  await pool.query('TRUNCATE TABLE users, libros RESTART IDENTITY CASCADE;');
  await pool.end();
  await app.close();
});

export { jwtToken };
