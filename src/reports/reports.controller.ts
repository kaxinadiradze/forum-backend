import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateStatusDto } from './dtos/updateStatus.dto';
import { DeleteReportDto } from './dtos/deleteReport.dto';

@UseGuards(AdminGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('')
  async seeReports() {
    const reports = await this.reportsService.getAllReports();
    return reports;
  }

  @Get('/:id')
  async getReport(@Param('id') id: string) {
    const report = await this.reportsService.getReportById(id);
    return report;
  }

  @Post('/delete')
  async deleteReport(@Body() body: DeleteReportDto) {
    return await this.reportsService.deleteReport(body.id);
  }

  @Put('/:id')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    const updateStatus = await this.reportsService.updateStatus(
      id,
      body.status,
    );
    return updateStatus;
  }
}
