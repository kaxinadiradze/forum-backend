import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostData, PostsRepository } from './posts.repository';
import { ThreadsRepository } from 'src/threads/threads.repository';
import { AdminRepository } from 'src/admin/admin.repository';
import { isUUID } from 'validator';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private threadsRepository: ThreadsRepository,
    private adminRepository: AdminRepository,
  ) {}

  async create(postData: PostData) {
    const thread = await this.threadsRepository.findById(postData.threadId);
    if (!thread) throw new NotFoundException('Thread not found');
    if (thread.isLocked) throw new BadRequestException('Thread is locked');
    if (postData.parentPostId) {
      const post = await this.postsRepository.findById(postData.parentPostId);
      if (!post) throw new NotFoundException('Parent post not found');
      if (post.isLocked) throw new BadRequestException('Post is locked');
      if (post.threadId !== postData.threadId) {
        throw new BadRequestException(
          'Parent post does not belong to the same thread',
        );
      }
    }
    const post = await this.postsRepository.create(postData);
    return post;
  }

  async getAllPosts() {
    const posts = await this.postsRepository.fetchAll();
    for (const post of posts) {
      await this.postsRepository.incrementViewCount(post.id);
    }
    return posts;
  }

  async findById(id: string) {
    const post = await this.postsRepository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    const thread = await this.threadsRepository.findById(post.threadId);
    await this.threadsRepository.updateById(thread.id, {
      views: thread.views + 1,
    });
    return await this.postsRepository.incrementViewCount(id);
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postsRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const isAdmin = await this.adminRepository.findByUserId(userId);
    if (!isAdmin && post.userId !== userId) {
      throw new UnauthorizedException('unauthorized!');
    }
    await this.postsRepository.deletePost(postId);
    return { message: 'Post was deleted successfully' };
  }

  async lockPost(postId: string, userId: string) {
    const post = await this.postsRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const isAdmin = await this.adminRepository.findByUserId(userId);
    if (!isAdmin && post.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to lock this post',
      );
    if (post.isLocked) throw new BadRequestException('Post is already locked');
    const lockPost = await this.postsRepository.updateById(post.id, {
      isLocked: true,
    });
    return lockPost;
  }

  async unlockPost(postId: string, userId: string) {
    const post = await this.postsRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const isAdmin = await this.adminRepository.findByUserId(userId);
    if (!isAdmin && post.userId !== userId)
      throw new UnauthorizedException(
        'You are not authorized to unlock this post',
      );
    if (!post.isLocked)
      throw new BadRequestException('Post is already unlocked');
    const unlockPost = await this.postsRepository.updateById(post.id, {
      isLocked: false,
    });
    return unlockPost;
  }

  async updatePost(postId: string, content: string, userId: string) {
    if (!isUUID(postId)) {
      throw new BadRequestException('Invalid uuid format');
    }
    const post = await this.postsRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const isAdmin = await this.adminRepository.findByUserId(userId);
    if (!isAdmin && post.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to edit this post',
      );
    }
    const updatePost = await this.postsRepository.updateById(postId, {
      content,
    });

    return updatePost;
  }
}
