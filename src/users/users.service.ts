import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { isUUID } from 'class-validator';
import { PostsRepository } from 'src/posts/posts.repository';
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  async seeUser(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid uuid format');
    }
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findById(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid uuid format');
    }
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteById(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Incorrect userId format');
    }
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.deleteById(userId);
  }

  async findUserPosts(userId: string) {
    const posts = await this.postsRepository.findByUserId(userId);
    if (posts.length === 0) {
      return { message: 'user has no posts' };
    }
    return posts;
  }
}
