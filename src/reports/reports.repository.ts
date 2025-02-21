import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ReportModel } from './models/report.model';
@Injectable()
export class ReportsRepository {
  constructor(
    @Inject('ReportModel') private reportModel: ModelClass<ReportModel>,
  ) {}

  async create(createReportArgs: CreateReportArgs) {
    const report = await this.reportModel.query().insert(createReportArgs);
    return report;
  }

  async checkDuplicateUserReports(reporterId: string, reportedUserId: string) {
    const report = await this.reportModel
      .query()
      .where('reporter_id', reporterId)
      .andWhere('reported_user_id', reportedUserId)
      .andWhere('status', ReportStatuses.pending)
      .first();
    if (!report) return null;
    return report;
  }

  async checkDuplicatePostReports(reporterId: string, reportedPostId: string) {
    const report = await this.reportModel
      .query()
      .where('reporter_id', reporterId)
      .andWhere('reported_post_id', reportedPostId)
      .andWhere('status', ReportStatuses.pending)
      .first();
    if (!report) return null;
    return report;
  }

  async getAllReports() {
    const reports = await this.reportModel.query();
    return reports;
  }

  async updateStatus(id: string, status: ReportStatuses) {
    const report = await this.reportModel
      .query()
      .patchAndFetchById(id, { status, updatedAt: new Date() });
    return report;
  }

  async delete(id: string) {
    await this.reportModel.query().deleteById(id);
  }

  async findById(id: string) {
    const report = await this.reportModel.query().findById(id);
    if (!report) return null;
    return report;
  }
}

export type CreateReportArgs = {
  reporterId: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reason: string;
  status: string;
};

export type ReportArgs = {
  reporterId: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reason: string;
};

export enum ReportStatuses {
  pending = 'pending',
  reviewed = 'reviewed',
  resolved = 'resolved',
}
