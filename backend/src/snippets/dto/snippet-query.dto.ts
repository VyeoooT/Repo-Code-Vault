import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

const toOptionalInt = (value: unknown, fallback: number): number => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

export class SnippetQueryDto {
  @ApiPropertyOptional({ example: '3fcb0e96-a9f2-48e0-aac6-9008b188f8c6' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'ui-elements' })
  @IsOptional()
  @IsString()
  tagSlug?: string;

  @ApiPropertyOptional({ example: 'button' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Transform(({ value }) => toOptionalInt(value, 1))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 12, default: 12 })
  @Transform(({ value }) => toOptionalInt(value, 12))
  @IsInt()
  @Min(1)
  limit = 12;
}
