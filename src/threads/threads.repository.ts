import { ModelClass } from 'objection';
import { ThreadModel } from './models/thread.model';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ThreadsRepository {
  constructor(
    @Inject('ThreadModel') private threadModel: ModelClass<ThreadModel>,
  ) {}

  async create(threadData: ThreadData) {
    const thread = await this.threadModel.query().insert(threadData);
    return thread;
  }

  async findById(id: string) {
    const thread = await this.threadModel.query().findById(id);
    if (!thread) {
      return null;
    }
    return thread;
  }

  async fetchAll() {
    const threads = await this.threadModel.query();
    return threads;
  }

  async deleteById(id: string) {
    await this.threadModel.query().deleteById(id);
    return 'thread was successfully deleted';
  }

  async updateById(threadId: string, updateData: Partial<ThreadModel>) {
    return await ThreadModel.query().patchAndFetchById(threadId, updateData);
  }
}

export type ThreadData = {
  title: string;
  content: string;
  categoryId: string;
  userId?: string;
};
