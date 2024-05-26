import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LibroService } from './libro.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

@Controller('libros')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.libroService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.libroService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createLibroDto: CreateLibroDto) {
    const sanitizedLibro = {
      ...createLibroDto,
      titulo: purify.sanitize(createLibroDto.titulo),
      autor: purify.sanitize(createLibroDto.autor),
    };
    return this.libroService.create(sanitizedLibro);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateLibroDto: CreateLibroDto) {
    const sanitizedLibro = {
      ...updateLibroDto,
      titulo: updateLibroDto.titulo
        ? purify.sanitize(updateLibroDto.titulo)
        : undefined,
      autor: updateLibroDto.autor
        ? purify.sanitize(updateLibroDto.autor)
        : undefined,
    };
    return this.libroService.update(id, sanitizedLibro);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.libroService.remove(id);
  }
}
