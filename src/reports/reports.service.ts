import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ReportArgs,
  ReportsRepository,
  ReportStatuses,
} from './reports.repository';
import { UsersRepository } from 'src/users/users.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { isUUID } from 'validator';
@Injectable()
export class ReportsService {
  constructor(
    private reportsRepository: ReportsRepository,
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  async reportUser(reportArgs: ReportArgs) {
    if (!isUUID(reportArgs.reportedUserId)) {
      throw new BadRequestException('Invalid uuid format');
    }
    const reportedUser = await this.usersRepository.findById(
      reportArgs.reporterId,
    );
    if (!reportedUser) throw new NotFoundException('user does not exist');
    if (reportArgs.reporterId == reportArgs.reportedUserId)
      throw new BadRequestException('You can not report yourself');
    if (reportArgs.reason.length > 1000)
      throw new BadRequestException('reason max length is 1000');
    const duplicateReport =
      await this.reportsRepository.checkDuplicateUserReports(
        reportArgs.reporterId,
        reportArgs.reportedUserId,
      );
    if (duplicateReport)
      throw new BadRequestException('You can only send 1 report for each user');
    const status = ReportStatuses.pending;
    const createReport = await this.reportsRepository.create({
      reporterId: reportArgs.reporterId,
      reason: reportArgs.reason,
      reportedUserId: reportArgs.reportedUserId,
      status,
    });

    return createReport;
  }

  async reportPost(reportArgs: ReportArgs) {
    if (!isUUID(reportArgs.reportedPostId)) {
      throw new BadRequestException('Invalid uuid format');
    }
    const reportedPost = await this.postsRepository.findById(
      reportArgs.reportedPostId,
    );
    if (!reportedPost) throw new NotFoundException('Post not found');
    if (reportArgs.reason.length > 1000)
      throw new BadRequestException('reason max length is 1000');
    const duplicateReport =
      await this.reportsRepository.checkDuplicatePostReports(
        reportArgs.reporterId,
        reportArgs.reportedPostId,
      );
    if (duplicateReport)
      throw new BadRequestException('You can only send 1 report for each post');
    const status = ReportStatuses.pending;
    const createReport = await this.reportsRepository.create({
      reporterId: reportArgs.reporterId,
      reason: reportArgs.reason,
      reportedPostId: reportArgs.reportedPostId,
      status,
    });

    return createReport;
  }

  async updateStatus(id: string, status: ReportStatuses) {
    if (!isUUID(id)) throw new BadRequestException('Invalid uuid format');
    const report = await this.reportsRepository.findById(id);
    if (!report) throw new NotFoundException('Report not found');
    const updateStatus = await this.reportsRepository.updateStatus(id, status);
    return updateStatus;
  }

  async getReportById(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid uuid format');
    const report = await this.reportsRepository.findById(id);
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async getAllReports() {
    const reports = await this.reportsRepository.getAllReports();
    if (reports.length === 0)
      throw new NotFoundException('There are no reports');
    return reports;
  }

  async deleteReport(id: string) {
    const report = await this.reportsRepository.findById(id);
    if (!report) throw new NotFoundException('Report not found');
    await this.reportsRepository.delete(id);
    return { message: 'report was deleted successfully' };
  }
}
