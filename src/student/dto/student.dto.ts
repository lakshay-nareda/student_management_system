import { Expose } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Student, StudentStatus } from '../entities/student.entity';

export class StudentDto {
  @Expose()
  @IsUUID()
  public readonly student_id: string;

  @Expose()
  @IsString()
  public readonly first_name: string;

  @Expose()
  @IsString()
  public readonly last_name: string;

  @Expose()
  @IsEmail()
  public readonly email: string;

  @Expose()
  @IsString()
  public readonly phone: string;

  @Expose()
  @IsDateString()
  public readonly dob: Date;

  @Expose()
  @IsString()
  public readonly gender: string;

  @Expose()
  @IsString()
  public readonly address: string;

  @Expose()
  @IsEnum(StudentStatus)
  public readonly status: StudentStatus;

  public constructor(valuse: StudentDto) {
    Object.assign(this, valuse);
  }

  public static createFromEntity(entity: Student): StudentDto {
    return new StudentDto({
      student_id: entity.student_id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      email: entity.email,
      phone: entity.phone,
      dob: entity.dob,
      gender: entity.gender,
      address: entity.address,
      status: entity.status,
    });
  }
}
