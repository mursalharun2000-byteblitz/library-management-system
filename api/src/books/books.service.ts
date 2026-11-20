import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

interface FindAllBooksQuery {
  genreId?: string | number;
  search?: string;
  page?: string | number;
  limit?: string | number;
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });
    if (!genre) {
      throw new NotFoundException(
        `Genre with ID ${createBookDto.genreId} not found`,
      );
    }

    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        description:
          createBookDto.description ??
          `${createBookDto.title} by ${createBookDto.author}.`,
        coverImage: createBookDto.coverImage,
        totalCopies: createBookDto.totalCopies,
        availableCopies:
          createBookDto.availableCopies ?? createBookDto.totalCopies,
        genreId: createBookDto.genreId,
      },
      include: { genre: true },
    });
  }

  async findAll(query: FindAllBooksQuery = {}) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {};

    if (query.genreId !== undefined && query.genreId !== '') {
      const parsedGenreId = Number(query.genreId);
      if (!Number.isNaN(parsedGenreId)) {
        where.genreId = parsedGenreId;
      }
    }

    if (query.search && query.search.trim().length > 0) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { author: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: { genre: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    if (updateBookDto.genreId !== undefined) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: updateBookDto.genreId },
      });
      if (!genre) {
        throw new NotFoundException(
          `Genre with ID ${updateBookDto.genreId} not found`,
        );
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}