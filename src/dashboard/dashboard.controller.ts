import {
  Controller,
  UseGuards,
  Get,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  public constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  public getAdminDashboard(@Request() req: { user: { role: string } }) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException(
        'Access denied: only admins can access this dashboard.',
      );
    }
    return this.dashboardService.getAdminDashboard();
  }
}
