import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class LibroService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM libros');
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findOne(id: number) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM libros WHERE id = $1', [
        id,
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async create(libro: { titulo: string; autor: string; publicacion: number }) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO libros (titulo, autor, publicacion) VALUES ($1, $2, $3) RETURNING *',
        [libro.titulo, libro.autor, libro.publicacion],
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async update(
    id: number,
    libro: { titulo?: string; autor?: string; publicacion?: number },
  ) {
    const client = await this.pool.connect();
    try {
      const fields = Object.keys(libro);
      const values = Object.values(libro);
      const query = `
        UPDATE libros
        SET ${fields.map((field, index) => `${field} = $${index + 1}`).join(', ')}
        WHERE id = ${id}
        RETURNING *;
      `;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async remove(id: number) {
    const client = await this.pool.connect();
    try {
      await client.query('DELETE FROM libros WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
}
