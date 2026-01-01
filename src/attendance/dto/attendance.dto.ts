import { Expose, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsString, IsUUID } from 'class-validator';
import { CourseDto } from '../../course/dto/course.dto';
import { StudentDto } from '../../student/dto/student.dto';
import { AttendanceStatus } from './create-attendance.dto';
import { Attendance } from '../entities/attendance.entity';

export class AttendanceDto {
  @Expose()
  @IsUUID()
  public readonly attendance_id: string;

  @Expose()
  @Type(() => StudentDto)
  @IsUUID()
  public readonly student: StudentDto | null;

  @Expose()
  @Type(() => CourseDto)
  @IsUUID()
  public readonly course: CourseDto | null;

  @Expose()
  @IsDateString()
  public readonly date: Date;

  @Expose()
  @IsEnum(AttendanceStatus)
  public readonly status: AttendanceStatus;

  @Expose()
  @IsString()
  public readonly remarks: string;

  public constructor(values: AttendanceDto) {
    Object.assign(this, values);
  }

  public static createFromEntity(entity: Attendance): AttendanceDto {
    return new AttendanceDto({
      attendance_id: entity.attendance_id,
      student: entity.student
        ? StudentDto.createFromEntity(entity.student)
        : null,
      course: entity.course ? CourseDto.createFromEntity(entity.course) : null,
      date: entity.date,
      status: entity.status,
      remarks: entity.remarks,
    });
  }
}
