import { IsString, IsInt, Min } from 'class-validator';

export class CreateLibroDto {
  @IsString()
  titulo: string;

  @IsString()
  autor: string;

  @IsInt()
  @Min(1900)
  publicacion: number;
}
