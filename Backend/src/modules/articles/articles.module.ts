import { Module } from '@nestjs/common';
import { ArticlesService } from '../../services/articles.service';
import { ArticlesController } from '../../controllers/articles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
