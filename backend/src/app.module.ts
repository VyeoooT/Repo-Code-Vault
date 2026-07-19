import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SnippetsModule } from './snippets/snippets.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [PrismaModule, SnippetsModule, CategoriesModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
