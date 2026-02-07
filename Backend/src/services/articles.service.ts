import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersService } from './users.service';
import { Article, Prisma } from '../generated/prisma/client';
import { CreateArticleDto } from '../modules/articles/dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async createFromDto(dto: CreateArticleDto): Promise<Article> {
    // Find or create author
    let author = await this.usersService.findOne({ email: dto.author?.email });

    if (!author) {
      // Create new user if doesn't exist
      author = await this.usersService.create({
        email: dto.author?.email || 'anonymous@example.com',
        name: dto.author?.name || 'Anonymous',
        picture: dto.author?.avatar,
      });
    }

    // Create article with authorId
    return this.prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: author.id,
      },
      include: { author: true },
    });
  }

  create(data: Prisma.ArticleCreateInput): Promise<Article> {
    return this.prisma.article.create({ data });
  }

  findAll(): Promise<Article[]> {
    return this.prisma.article.findMany({
      include: { author: true },
    });
  }

  findOne(id: string): Promise<Article | null> {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.ArticleUpdateInput): Promise<Article> {
    return this.prisma.article.update({ where: { id }, data });
  }

  remove(id: string): Promise<Article> {
    return this.prisma.article.delete({ where: { id } });
  }
}
