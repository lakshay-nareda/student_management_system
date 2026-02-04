import { IsEnum, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { ExamType } from '../entities/mark.entity';

export class CreateMarkDto {
  @IsUUID()
  @IsNotEmpty()
  public student_id: string;

  @IsUUID()
  @IsNotEmpty()
  public course_id: string;

  @IsString()
  @IsEnum(ExamType)
  @IsNotEmpty()
  public exam_type: ExamType;

  @IsNotEmpty()
  @Min(0)
  public score: number;

  @IsNotEmpty()
  @Min(1)
  public max_score: number;

  public constructor(values: CreateMarkDto) {
    Object.assign(this, values);
  }
}
