import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async create(dto: CreateTagDto) {
    await this.ensureTagUnique(dto.name, dto.slug);

    return this.prisma.tag.create({
      data: {
        name: dto.name,
        slug: dto.slug,
      },
    });
  }

  async update(id: string, dto: UpdateTagDto) {
    await this.findOne(id);
    await this.ensureTagUnique(dto.name, dto.slug, id);

    return this.prisma.tag.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.tag.delete({ where: { id } });
  }

  private async ensureTagUnique(
    name: string,
    slug: string,
    excludeId?: string,
  ) {
    const duplicate = await this.prisma.tag.findFirst({
      where: {
        OR: [{ name }, { slug }],
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (duplicate) {
      throw new ConflictException('Tag name or slug already exists');
    }
  }
}
