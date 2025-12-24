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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { StudentDto } from './dto/student.dto';

@UseGuards(AuthGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentsService: StudentService) {}

  @Post()
  public async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentDto> {
    return await this.studentsService.createStudent(createStudentDto);
  }

  @Get()
  public async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<{
    data: StudentDto[];
    meta: { total: number; page: number; limit: number; last_page: number };
  }> {
    return await this.studentsService.getStudentsList(
      search,
      status,
      page,
      limit,
    );
  }

  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentDto> {
    return await this.studentsService.getStudentById(id);
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    return await this.studentsService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.studentsService.deleteStudent(id);
  }
}
