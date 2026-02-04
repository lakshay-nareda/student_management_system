import {
  IsEnum,
  IsUUID,
  IsString, // ✅ Changed from IsDateString
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

  @IsString() // ✅ Allows "25/02/2024" or "2024-02-25"
  @IsNotEmpty()
  public enrolled_on: string; // ✅ Type changed to string

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  public status: EnrollmentStatus;

  public constructor(values: CreateEnrollmentDto) {
    Object.assign(this, values);
  }
}
