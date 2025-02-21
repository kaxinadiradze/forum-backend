import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { LikeModel } from './models/like.model';

@Injectable()
export class LikesRepository {
  constructor(@Inject('LikeModel') private likeModel: ModelClass<LikeModel>) {}

  async create(likeData: LikeData) {
    const like = await this.likeModel.query().insert(likeData);
    return like;
  }

  async checkIfLiked(likeData: LikeData) {
    const check = await this.likeModel
      .query()
      .where('userId', likeData.userId)
      .andWhere('postId', likeData.postId)
      .first();
    if (!check) return null;
    return check;
  }

  async removeLike(likeData: LikeData) {
    const findLike = await this.likeModel
      .query()
      .where('userId', likeData.userId)
      .andWhere('postId', likeData.postId)
      .first();

    await this.likeModel.query().deleteById(findLike.id);
  }

  async seeWhoLikes(postId: string) {
    return await this.likeModel
      .query()
      .select('users.id', 'users.username')
      .join('users', 'likes.userId', 'users.id')
      .where('postId', postId);
  }
}

export type LikeData = {
  userId: string;
  postId: string;
};
