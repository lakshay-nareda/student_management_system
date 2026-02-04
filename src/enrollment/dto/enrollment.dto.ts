import { Expose, Type } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { CourseDto } from 'src/course/dto/course.dto';
import {
  Enrollment,
  EnrollmentStatus,
} from 'src/enrollment/entities/enrollment.entity';
import { StudentDto } from 'src/student/dto/student.dto';

export class EnrollmentDto {
  @Expose()
  @IsUUID()
  public readonly enrollment_id: string;

  @Expose()
  @Type(() => StudentDto)
  @IsUUID()
  public readonly student: StudentDto | null;

  @Expose()
  @Type(() => CourseDto)
  @IsUUID()
  public readonly course: CourseDto | null;

  @Expose()
  @IsString()
  public readonly enrolled_on: Date;

  @Expose()
  @IsEnum(EnrollmentStatus)
  public readonly status: string;

  public constructor(valuse: EnrollmentDto) {
    Object.assign(this, valuse);
  }
  public static createFromEntity(entity: Enrollment): EnrollmentDto {
    return new EnrollmentDto({
      enrollment_id: entity.enrollment_id,
      student: entity.student
        ? StudentDto.createFromEntity(entity.student)
        : null,
      course: entity.course ? CourseDto.createFromEntity(entity.course) : null,
      enrolled_on: entity.enrolled_on,
      status: entity.status,
    });
  }
}
