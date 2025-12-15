import { IsEnum, IsUUID, IsDateString, IsNotEmpty } from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @IsDateString()
  enrolled_on: string;

  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;
}
