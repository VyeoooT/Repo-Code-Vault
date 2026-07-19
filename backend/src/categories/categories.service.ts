import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    await this.ensureCategoryUnique(dto.name, dto.slug);

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        icon: dto.icon,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    await this.ensureCategoryUnique(dto.name, dto.slug, id);

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        icon: dto.icon,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const snippetsCount = await this.prisma.snippet.count({
      where: { categoryId: id },
    });

    if (snippetsCount > 0) {
      throw new BadRequestException(
        'Cannot delete category that is used by snippets',
      );
    }

    await this.prisma.category.delete({ where: { id } });
  }

  private async ensureCategoryUnique(
    name: string,
    slug: string,
    excludeId?: string,
  ) {
    const duplicate = await this.prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (duplicate) {
      throw new ConflictException('Category name or slug already exists');
    }
  }
}
