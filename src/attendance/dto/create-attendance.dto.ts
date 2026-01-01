import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export class CreateAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  public student_id: string;

  @IsUUID()
  @IsNotEmpty()
  public course_id: string;

  @IsDateString()
  @IsNotEmpty()
  public date: Date;

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  public status: AttendanceStatus;

  @IsString()
  @IsOptional()
  public remarks: string;

  public constructor(values: CreateAttendanceDto) {
    Object.assign(this, values);
  }
}
