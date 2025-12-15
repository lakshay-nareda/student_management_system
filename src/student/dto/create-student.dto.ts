import {
  IsEnum,
  IsString,
  IsEmail,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { StudentStatus } from '../entities/student.entity';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsDateString()
  dob: string;

  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsEnum(StudentStatus)
  status: StudentStatus;
}
