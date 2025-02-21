import {
  Controller,
  Body,
  Req,
  Post,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/createPost.dto';
import { Request } from 'src/users/users.controller';
import { BanGuard } from 'src/guards/ban.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeletePostDto } from './dtos/deletePost.dto';
import { EditPostDto } from './dtos/editPost.dto';
import { ReportPostDto } from './dtos/reportPost.dto';
import { ReportsService } from 'src/reports/reports.service';

@UseGuards(AuthGuard)
@UseGuards(BanGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private reportsService: ReportsService,
  ) {}

  @Get('')
  async getAllPosts() {
    const posts = await this.postsService.getAllPosts();
    return posts;
  }

  @Get('/:id')
  async getPost(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    return post;
  }

  @Post()
  async createPost(@Body() body: CreatePostDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.postsService.create({ ...body, userId });
  }

  @Post('delete')
  async deletePost(@Body() body: DeletePostDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.postsService.deletePost(body.id, userId);
  }

  @Post('/lock')
  async lockPost(@Body() body: DeletePostDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.postsService.lockPost(body.id, userId);
  }

  @Post('/unlock')
  async unlockPost(@Body() body: DeletePostDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.postsService.unlockPost(body.id, userId);
  }

  @Post('/:id/report')
  async reportPost(
    @Param('id') id: string,
    @Body() body: ReportPostDto,
    @Req() req: Request,
  ) {
    const reporterId = req.currentUser.id;
    const report = await this.reportsService.reportPost({
      reporterId,
      reportedPostId: id,
      reason: body.reason,
    });

    return report;
  }

  @Post('/:id/edit')
  async updatePost(
    @Param('id') id: string,
    @Body() body: EditPostDto,
    @Req() req: Request,
  ) {
    const userId = req.currentUser.id;
    return await this.postsService.updatePost(id, body.content, userId);
  }
}
