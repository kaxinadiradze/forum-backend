import { BadRequestException, Injectable } from '@nestjs/common';
import { LikesRepository, LikeData } from './likes.repository';
import { PostsService } from 'src/posts/posts.service';
import { isUUID } from 'class-validator';

@Injectable()
export class LikesService {
  constructor(
    private likesRepository: LikesRepository,
    private postsService: PostsService,
  ) {}

  async likePost(likeData: LikeData) {
    if (!isUUID(likeData.postId))
      throw new BadRequestException('Invalid uuid format');
    const checkIfLiked = await this.likesRepository.checkIfLiked(likeData);
    if (checkIfLiked) throw new BadRequestException('You already liked post');
    try {
      await this.likesRepository.create(likeData);
    } catch (error) {
      throw new BadRequestException('Something want wrong');
    }
    const updatedPost = await this.postsService.findById(likeData.postId);
    return updatedPost;
  }

  async unlikePost(likeData: LikeData) {
    if (!isUUID(likeData.postId))
      throw new BadRequestException('Invalid uuid format');
    await this.postsService.findById(likeData.postId);
    const checkIfLiked = await this.likesRepository.checkIfLiked(likeData);
    if (!checkIfLiked) throw new BadRequestException('You have not liked post');
    await this.likesRepository.removeLike(likeData);
    const updatedPost = await this.postsService.findById(likeData.postId);
    return updatedPost;
  }

  async seeWhoLikes(postId: string) {
    if (!isUUID(postId)) {
      throw new BadRequestException('Invalid uuid format');
    }
    await this.postsService.findById(postId);
    const likes = await this.likesRepository.seeWhoLikes(postId);
    return likes;
  }
}
