import {
  Controller,
  UseGuards,
  Get,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard'; // ✅ Ensure correct relative path

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  public constructor(private readonly dashboardService: DashboardService) {}

  // ✅ Route matches frontend: /dashboard/stats
  @Get('stats')
  public async getDashboardStats(@Request() req: { user: { role: string } }) {
    // Optional: Security check (only admin can see)
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException(
        'Access denied: only admins can access this dashboard.',
      );
    }
    return await this.dashboardService.getDashboardStats();
  }
}
