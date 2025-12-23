import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudentResponse, StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Student } from './entities/student.entity';

@UseGuards(AuthGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentsService: StudentService) {}

  @Post()
  public async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<Student> {
    return await this.studentsService.create(createStudentDto);
  }

  @Get()
  public async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<StudentResponse> {
    return await this.studentsService.findAll(search, status, page, limit);
  }

  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Student> {
    return await this.studentsService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return await this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.studentsService.remove(id);
  }
}
