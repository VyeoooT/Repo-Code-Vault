import { ApiProperty } from '@nestjs/swagger';
import { CreateSnippetDto } from './create-snippet.dto';

export class UpdateSnippetDto extends CreateSnippetDto {
  @ApiProperty({ example: 'Updated snippet title' })
  declare title: string;
}
