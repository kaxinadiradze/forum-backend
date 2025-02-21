import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const checkIfPostExist = await this.postsService.findById(likeData.postId);
    if (!checkIfPostExist) throw new NotFoundException('Post does not exist');
    const checkIfLiked = await this.likesRepository.checkIfLiked(likeData);
    if (checkIfLiked) throw new BadRequestException('You already liked post');
    await this.likesRepository.create(likeData);
    const updatedPost = await this.postsService.findById(likeData.postId);
    return updatedPost;
  }

  async unlikePost(likeData: LikeData) {
    if (!isUUID(likeData.postId))
      throw new BadRequestException('Invalid uuid format');
    const checkIfPostExist = await this.postsService.findById(likeData.postId);
    if (!checkIfPostExist) throw new NotFoundException('Post does not exist');
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
    const post = await this.postsService.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const likes = await this.likesRepository.seeWhoLikes(postId);
    return likes;
  }
}
