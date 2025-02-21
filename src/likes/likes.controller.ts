import { Controller, Param, Post, Req, UseGuards, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { Request } from 'src/users/users.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { BanGuard } from 'src/guards/ban.guard';

@UseGuards(AuthGuard)
@UseGuards(BanGuard)
@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Get('/:postId/users')
  async seeWhoLikes(@Param('postId') postId: string) {
    return await this.likesService.seeWhoLikes(postId);
  }

  @Post('/:postId')
  async likePost(@Param('postId') postId: string, @Req() req: Request) {
    const userId = req.currentUser.id;
    const likeData = { postId, userId };
    const likePost = await this.likesService.likePost(likeData);
    return likePost;
  }

  @Post('/:postId/toggle')
  async unlikePost(@Param('postId') postId: string, @Req() req: Request) {
    const userId = req.currentUser.id;
    const likeData = { postId, userId };
    const likePost = await this.likesService.unlikePost(likeData);
    return likePost;
  }
}
