import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ThreadData, ThreadsRepository } from './threads.repository';
import { isUUID } from 'class-validator';
import { CategoriesService } from 'src/categories/categories.service';
import { AdminRepository } from 'src/admin/admin.repository';
import { ThreadModel } from './models/thread.model';
import { PostsRepository } from 'src/posts/posts.repository';
import validator from 'validator';

@Injectable()
export class ThreadsService {
  constructor(
    private threadsRepository: ThreadsRepository,
    private categoriesService: CategoriesService,
    private adminRepository: AdminRepository,
    private postsRepository: PostsRepository,
  ) {}

  async getAllThreads() {
    const threads = await this.threadsRepository.fetchAll();
    if (threads.length === 0) {
      return 'There are no threads';
    }
    for (const thread of threads) {
      await this.threadsRepository.updateById(thread.id, {
        views: thread.views + 1,
      });
    }
    return threads;
  }

  async create(threadData: ThreadData) {
    const categoryId = threadData.categoryId;
    await this.categoriesService.findById(categoryId);
    const sanitizedTitle = validator.escape(threadData.title);
    const sanitizedContent = validator.escape(threadData.content);

    // Optionally, remove control characters

    const newThread = {
      ...threadData,
      title: sanitizedTitle,
      content: sanitizedContent,
    };

    // Save to the repository
    return await this.threadsRepository.create(newThread);
  }

  async deleteThread(threadId: string, userId: string) {
    const thread = await this.threadsRepository.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');
    const adminCheck = await this.adminRepository.findByUserId(userId);
    if (!adminCheck) {
      if (thread.userId !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to delete this thread',
        );
      }
    }
    await this.threadsRepository.deleteById(threadId);
    return { message: 'Thread was deleted successfully' };
  }

  async updateThread(threadData: ThreadData, threadId: string, userId: string) {
    if (!isUUID(threadId)) throw new BadRequestException('invalid uuid format');
    const thread = await this.threadsRepository.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');
    const isAdmin = await this.adminRepository.findByUserId(userId);
    if (!isAdmin && thread.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this thread',
      );
    }

    const updatedThread = await this.threadsRepository.updateById(
      threadId,
      threadData,
    );
    return updatedThread;
  }

  async findById(threadId: string) {
    if (!isUUID(threadId)) throw new BadRequestException('Invalid uuid format');
    const thread = await this.threadsRepository.findById(threadId);
    if (!thread) throw new NotFoundException('thread not found');
    await this.threadsRepository.updateById(threadId, {
      views: thread.views + 1,
    });
    const incrementedThread = await this.threadsRepository.findById(threadId);
    const associatedPosts = await this.postsRepository.findByThreadId(threadId);
    return { incrementedThread, associatedPosts };
  }

  async lockThread(threadId: string, userId: string) {
    if (!isUUID(threadId)) throw new BadRequestException('Invalid uuid format');
    const thread = await this.threadsRepository.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');

    const isAdmin = await this.adminRepository.findByUserId(userId);
    if (!isAdmin && thread.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to lock this thread',
      );
    }
    if (thread.isLocked) {
      throw new BadRequestException('Thread is already locked');
    }
    const lockThread = await this.threadsRepository.updateById(threadId, {
      isLocked: true,
    });
    return lockThread;
  }

  async unlockThread(threadId: string, userId: string) {
    if (!isUUID(threadId)) throw new BadRequestException('Invalid uuid format');
    const thread = await this.threadsRepository.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');

    const isAdmin = await this.adminRepository.findByUserId(userId);
    if (!isAdmin && thread.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to unlock this thread',
      );
    }
    if (!thread.isLocked) {
      throw new BadRequestException('Thread is already unlocked');
    }
    const unlockThread = await this.threadsRepository.updateById(threadId, {
      isLocked: false,
    });
    return unlockThread;
  }

  async searchThreads(query: string) {
    return await ThreadModel.query()
      .where('title', 'ilike', `%${query}%`)
      .orWhere('content', 'ilike', `%${query}%`);
  }
}
