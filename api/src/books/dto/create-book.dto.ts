import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalCopies: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  availableCopies?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  genreId: number;
}