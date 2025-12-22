import { IsEnum, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { ExamType } from '../entities/mark.entity';

export class CreateMarkDto {
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  @IsEnum(ExamType)
  @IsNotEmpty()
  exam_type: ExamType;

  @IsNotEmpty()
  @Min(0)
  score: number;

  @IsNotEmpty()
  @Min(1)
  max_score: number;
}
