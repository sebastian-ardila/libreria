import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { jwtToken } from './setup';

describe('Libros API (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await app.close();
  });

  it('/libros (GET)', async () => {
    const res = await request(server)
      .get('/libros')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/libros/:id (GET)', async () => {
    const libroId = 1; // Ajusta el ID según los datos de prueba
    const res = await request(server)
      .get(`/libros/${libroId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', libroId);
    expect(res.body).toHaveProperty('titulo');
    expect(res.body).toHaveProperty('autor');
    expect(res.body).toHaveProperty('publicacion');
  });

  it('/libros (POST)', async () => {
    const nuevoLibro = {
      titulo: 'Nuevo Libro',
      autor: 'Nuevo Autor',
      publicacion: 2023,
    };
    const res = await request(server)
      .post('/libros')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(nuevoLibro);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.titulo).toBe(nuevoLibro.titulo);
    expect(res.body.autor).toBe(nuevoLibro.autor);
    expect(res.body.publicacion).toBe(nuevoLibro.publicacion);
  });

  it('/libros/:id (PUT)', async () => {
    const libroId = 1; // Ajusta el ID según los datos de prueba
    const actualizacionLibro = {
      titulo: 'Libro Actualizado',
      autor: 'Autor Actualizado',
      publicacion: 2024,
    };
    const res = await request(server)
      .put(`/libros/${libroId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(actualizacionLibro);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', libroId);
    expect(res.body.titulo).toBe(actualizacionLibro.titulo);
    expect(res.body.autor).toBe(actualizacionLibro.autor);
    expect(res.body.publicacion).toBe(actualizacionLibro.publicacion);
  });

  it('/libros/:id (DELETE)', async () => {
    const libroId = 1; // Ajusta el ID según los datos de prueba
    const res = await request(server)
      .delete(`/libros/${libroId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });
});
