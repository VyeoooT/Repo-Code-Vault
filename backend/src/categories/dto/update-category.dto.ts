import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends CreateCategoryDto {
  @ApiPropertyOptional({ example: 'layout' })
  declare icon?: string;
}
