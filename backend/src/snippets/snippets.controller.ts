import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { SnippetQueryDto } from './dto/snippet-query.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetsService } from './snippets.service';

@ApiTags('snippets')
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get snippets list with optional filters' })
  @ApiResponse({ status: 200, description: 'Snippets list returned' })
  findAll(@Query() query: SnippetQueryDto) {
    return this.snippetsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get snippet detail by id' })
  @ApiResponse({ status: 200, description: 'Snippet detail returned' })
  @ApiResponse({ status: 404, description: 'Snippet not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.snippetsService.findOne(id);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create snippet' })
  @ApiResponse({ status: 201, description: 'Snippet created' })
  create(@Body() dto: CreateSnippetDto, @Req() request: AuthenticatedRequest) {
    return this.snippetsService.create(dto, request.user);
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update snippet by id' })
  @ApiResponse({ status: 200, description: 'Snippet updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Snippet not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSnippetDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.snippetsService.update(id, dto, request.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete snippet by id' })
  @ApiResponse({ status: 204, description: 'Snippet deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Snippet not found' })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.snippetsService.remove(id, request.user);
  }
}
