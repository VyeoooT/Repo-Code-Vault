import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSnippetDto } from './dto/create-snippet.dto';
import type { SnippetQueryDto } from './dto/snippet-query.dto';
import type { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SnippetQueryDto) {
    const { page = 1, limit = 12, categoryId, tagSlug, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.SnippetWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: tagSlug,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.snippet.findMany({
        where,
        include: {
          category: true,
          author: true,
          files: {
            orderBy: {
              order: 'asc',
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.snippet.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const snippet = await this.prisma.snippet.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        files: {
          orderBy: {
            order: 'asc',
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        versions: {
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    return snippet;
  }

  async create(dto: CreateSnippetDto, user: DecodedIdToken) {
    const userEmail = user.email;
    if (!userEmail) {
      throw new BadRequestException('Authenticated user email is required');
    }

    const userName = typeof user.name === 'string' ? user.name : undefined;
    const userAvatar =
      typeof user.picture === 'string' ? user.picture : undefined;

    await this.validateCategoryAndTags(dto.categoryId, dto.tagIds);

    const uniqueTagIds = this.uniqueTagIds(dto.tagIds);
    const files = dto.files.map((file, index) => ({
      language: file.language,
      content: file.content,
      order: file.order ?? index,
    }));

    return this.prisma.$transaction(async (tx) => {
      const author = await tx.user.upsert({
        where: { firebaseUid: user.uid },
        update: {
          email: userEmail,
          name: userName,
          avatar: userAvatar,
        },
        create: {
          firebaseUid: user.uid,
          email: userEmail,
          name: userName,
          avatar: userAvatar,
        },
      });

      return tx.snippet.create({
        data: {
          title: dto.title,
          description: dto.description,
          thumbnail: dto.thumbnail,
          categoryId: dto.categoryId,
          authorId: author.id,
          files: {
            createMany: {
              data: files,
            },
          },
          tags: {
            createMany: {
              data: uniqueTagIds.map((tagId) => ({ tagId })),
            },
          },
        },
        include: {
          category: true,
          author: true,
          files: {
            orderBy: {
              order: 'asc',
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });
  }

  async update(id: string, dto: UpdateSnippetDto, user: DecodedIdToken) {
    const existingSnippet = await this.getOwnedSnippet(id, user.uid);
    await this.validateCategoryAndTags(dto.categoryId, dto.tagIds);

    const uniqueTagIds = this.uniqueTagIds(dto.tagIds);
    const files = dto.files.map((file, index) => ({
      language: file.language,
      content: file.content,
      order: file.order ?? index,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.snippetFile.deleteMany({
        where: {
          snippetId: existingSnippet.id,
        },
      });

      await tx.snippetTag.deleteMany({
        where: {
          snippetId: existingSnippet.id,
        },
      });

      return tx.snippet.update({
        where: { id: existingSnippet.id },
        data: {
          title: dto.title,
          description: dto.description,
          thumbnail: dto.thumbnail,
          categoryId: dto.categoryId,
          files: {
            createMany: {
              data: files,
            },
          },
          tags: {
            createMany: {
              data: uniqueTagIds.map((tagId) => ({ tagId })),
            },
          },
        },
        include: {
          category: true,
          author: true,
          files: {
            orderBy: {
              order: 'asc',
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });
  }

  async addTags(id: string, tagIds: string[], user: DecodedIdToken) {
    const snippet = await this.getOwnedSnippet(id, user.uid);
    const uniqueTagIds = this.uniqueTagIds(tagIds);

    await this.ensureTagsExist(uniqueTagIds);

    await this.prisma.snippetTag.createMany({
      data: uniqueTagIds.map((tagId) => ({
        snippetId: snippet.id,
        tagId,
      })),
      skipDuplicates: true,
    });

    return this.findOne(snippet.id);
  }

  async removeTag(id: string, tagId: string, user: DecodedIdToken) {
    const snippet = await this.getOwnedSnippet(id, user.uid);

    const relation = await this.prisma.snippetTag.deleteMany({
      where: {
        snippetId: snippet.id,
        tagId,
      },
    });

    if (relation.count === 0) {
      throw new NotFoundException('Snippet tag relation not found');
    }

    return this.findOne(snippet.id);
  }

  async remove(id: string, user: DecodedIdToken) {
    const snippet = await this.getOwnedSnippet(id, user.uid);

    await this.prisma.snippet.delete({
      where: {
        id: snippet.id,
      },
    });
  }

  private async getOwnedSnippet(id: string, firebaseUid: string) {
    const snippet = await this.prisma.snippet.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    if (snippet.author.firebaseUid !== firebaseUid) {
      throw new ForbiddenException(
        'You are not allowed to modify this snippet',
      );
    }

    return snippet;
  }

  private async validateCategoryAndTags(categoryId: string, tagIds: string[]) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new BadRequestException('Category does not exist');
    }

    await this.ensureTagsExist(this.uniqueTagIds(tagIds));
  }

  private async ensureTagsExist(tagIds: string[]) {
    if (tagIds.length === 0) {
      return;
    }

    const foundTagsCount = await this.prisma.tag.count({
      where: {
        id: {
          in: tagIds,
        },
      },
    });

    if (foundTagsCount !== tagIds.length) {
      throw new BadRequestException('One or more tags do not exist');
    }
  }

  private uniqueTagIds(tagIds: string[]): string[] {
    return Array.from(new Set(tagIds));
  }
}
