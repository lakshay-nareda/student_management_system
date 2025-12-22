import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module'; // ✅ Relative Path

// ✅ FIX: 'src/...' ki jagah Relative Path '../' use karein
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Course, Attendance, Enrollment]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
