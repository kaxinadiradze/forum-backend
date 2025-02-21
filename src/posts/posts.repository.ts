import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { PostModel } from './models/post.model';

@Injectable()
export class PostsRepository {
  constructor(@Inject('PostModel') private postModel: ModelClass<PostModel>) {}

  async create(data: PostData) {
    const post = await this.postModel.query().insert(data);
    if (!post) return null;
    return post;
  }

  async fetchAll() {
    return await this.postModel
      .query()
      .select('posts.*')
      .count('likes.id as likeCount')
      .leftJoin('likes', 'posts.id', 'likes.post_id')
      .groupBy('posts.id');
  }

  async findById(id: string) {
    const post = await this.postModel.query().findById(id);
    if (!post) return null;
    return post;
  }

  async findByUserId(userId: string) {
    const posts = await this.postModel.query().where('userId', userId);
    return posts;
  }

  async incrementViewCount(postId: string) {
    const post = await this.postModel.query().findById(postId);
    await this.postModel
      .query()
      .patchAndFetchById(postId, { views: post.views + 1 });

    return await this.postModel
      .query()
      .select('posts.*')
      .count('likes.id as likeCount')
      .leftJoin('likes', 'posts.id', 'likes.post_id')
      .where('posts.id', postId)
      .groupBy('posts.id')
      .first();
  }

  async findByThreadId(id: string) {
    const posts = await this.postModel
      .query()
      .select('posts.*') // Select all columns from the posts table
      .count('likes.id as likeCount') // Count the number of likes for each post
      .leftJoin('likes', 'posts.id', 'likes.post_id') // Join with the likes table
      .where('posts.threadId', id) // Filter by the threadId
      .groupBy('posts.id');
    return posts;
  }

  async deletePost(id: string) {
    await this.postModel.query().deleteById(id);
  }

  async updateById(postId: string, postData: Partial<PostModel>) {
    return await this.postModel.query().patchAndFetchById(postId, postData);
  }
}

export type PostData = {
  content: string;
  threadId: string;
  userId: string;
  parentPostId?: string;
};
