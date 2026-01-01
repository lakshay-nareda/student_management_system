import {
  IsEnum,
  IsUUID,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  public student_id: string;

  @IsUUID()
  @IsNotEmpty()
  public course_id: string;

  @IsDateString()
  public enrolled_on: string;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  public status: EnrollmentStatus;

  public constructor(values: CreateEnrollmentDto) {
    Object.assign(this, values);
  }
}
