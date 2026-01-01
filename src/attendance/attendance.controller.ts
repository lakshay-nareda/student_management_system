import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AttendanceDto } from './dto/attendance.dto';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('attendance')
export class AttendanceController {
  public constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  public async markAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDto> {
    return await this.attendanceService.addAttendance(createAttendanceDto);
  }

  @Get('student/:student_id')
  public async getAttendanceByStudent(
    @Param('student_id') student_id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<AttendanceDto[]> {
    return await this.attendanceService.findAttendanceByStudent(
      student_id,
      from,
      to,
    );
  }

  @Get('course/:course_id')
  public async getAttendanceByCourse(
    @Param('course_id') course_id: string,
    @Query('date') date?: string,
  ): Promise<AttendanceDto[]> {
    return await this.attendanceService.findAttendanceByCourse(course_id, date);
  }
}
