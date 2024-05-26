import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword],
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async findOne(username: string): Promise<any | undefined> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
