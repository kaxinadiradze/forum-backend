import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dtos/createThread.dto';
import { Request } from 'src/users/users.controller';
import { BanGuard } from 'src/guards/ban.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeleteThreadDto } from './dtos/deleteThread';

@UseGuards(BanGuard)
@UseGuards(AuthGuard)
@Controller('threads')
export class ThreadsController {
  constructor(private threadsService: ThreadsService) {}

  @Get('')
  async getAllThreads() {
    const threads = await this.threadsService.getAllThreads();
    return threads;
  }

  @Get('/search')
  async search(@Query('q') q: string) {
    return await this.threadsService.searchThreads(q);
  }

  @Get(':id')
  async getThreadById(@Param('id') id: string) {
    const thread = await this.threadsService.findById(id);
    return thread;
  }

  @Post('')
  async createThread(@Body() body: CreateThreadDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    const threadData = {
      title: body.title,
      content: body.content,
      categoryId: body.categoryId,
      userId: userId,
    };
    return await this.threadsService.create(threadData);
  }

  @Post('/delete')
  async deleteThread(@Body() body: DeleteThreadDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.threadsService.deleteThread(body.id, userId);
  }

  @Post('/lock')
  async lockThread(@Body() body: DeleteThreadDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.threadsService.lockThread(body.id, userId);
  }

  @Post('/unlock')
  async unlockThread(@Body() body: DeleteThreadDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.threadsService.unlockThread(body.id, userId);
  }

  @Post('/:threadId/update')
  async updateThread(
    @Body() body: CreateThreadDto,
    @Param('threadId') threadId: string,
    @Req() req: Request,
  ) {
    const userId = req.currentUser.id;
    const threadData = {
      title: body.title,
      content: body.content,
      categoryId: body.categoryId,
    };
    return await this.threadsService.updateThread(threadData, threadId, userId);
  }
}
