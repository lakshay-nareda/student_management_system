import {
  IsEnum,
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string; // <--- Yahan change kiya hai (password_hash -> password)
}
