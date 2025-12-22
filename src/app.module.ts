import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MarksModule } from './marks/marks.module';
import { AuthModule } from './auth/auth.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    StudentModule,
    UserModule,
    CourseModule,
    EnrollmentModule,
    AttendanceModule,
    MarksModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [DashboardController],
  providers: [AppService],
})
export class AppModule {}
