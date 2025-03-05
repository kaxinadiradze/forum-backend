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
      .where('user_id', likeData.userId)
      .andWhere('post_id', likeData.postId)
      .first();
    if (!check) return null;
    return check;
  }

  async removeLike(likeData: LikeData) {
    const findLike = await this.likeModel
      .query()
      .where('user_id', likeData.userId)
      .andWhere('post_id', likeData.postId)
      .first();

    return this.likeModel.query().deleteById(findLike.id);
  }

  async seeWhoLikes(postId: string) {
    return await this.likeModel
      .query()
      .select('users.id', 'users.username')
      .join('users', 'likes.user_id', 'users.id')
      .where('post_id', postId);
  }
}

export type LikeData = {
  userId: string;
  postId: string;
};
