import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  credits: number;
}
