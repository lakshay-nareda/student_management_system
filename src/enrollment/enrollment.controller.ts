import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { EnrollmentDto } from './dto/enrollment.dto';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('enrollments')
export class EnrollmentController {
  public constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  public async addEnrollment(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentDto> {
    return await this.enrollmentService.addEnrollment(createEnrollmentDto);
  }

  @Get('students/:student_id')
  public async getStudentEnrollByCourses(
    @Param('student_id', ParseUUIDPipe) student_id: string,
  ): Promise<EnrollmentDto[]> {
    return await this.enrollmentService.getStudentEnrollmentByCourses(
      student_id,
    );
  }

  @Get('courses/:course_id')
  public async getCourseEnrollStudents(
    @Param('course_id', ParseUUIDPipe) course_id: string,
  ): Promise<EnrollmentDto[]> {
    return await this.enrollmentService.getCourseEnrollmentByStudents(
      course_id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteEnrollment(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.enrollmentService.deleteEnrollment(id);
  }
}
