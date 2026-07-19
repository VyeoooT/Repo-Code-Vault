import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSnippetFileDto {
  @ApiProperty({ example: 'tsx' })
  @IsString()
  @IsNotEmpty()
  language!: string;

  @ApiProperty({
    example:
      'export default function Button() { return <button>Click</button> }',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class CreateSnippetDto {
  @ApiProperty({ example: 'Animated CTA Button' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'A reusable animated CTA button for hero sections.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/snippets/button.png',
  })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ example: '3fcb0e96-a9f2-48e0-aac6-9008b188f8c6' })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['7395f997-dbee-4232-842f-7f374fba44cf'],
    default: [],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  tagIds: string[] = [];

  @ApiProperty({ type: [CreateSnippetFileDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSnippetFileDto)
  files!: CreateSnippetFileDto[];
}
