import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  async create(createGenreDto: CreateGenreDto) {
    const slug = createGenreDto.slug || this.toSlug(createGenreDto.name);
    return this.prisma.genre.create({
      data: {
        name: createGenreDto.name,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);
    const data: { name?: string; slug?: string } = { ...updateGenreDto };
    if (updateGenreDto.name && !updateGenreDto.slug) {
      data.slug = this.toSlug(updateGenreDto.name);
    }
    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genre.delete({ where: { id } });
  }
}