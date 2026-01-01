import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { MarkDto } from './dto/mark.dto';

@UseGuards(AuthGuard)
@Controller('marks')
export class MarksController {
  public constructor(private readonly marksService: MarksService) {}

  @Post()
  public async assignMarks(
    @Body() createMarkDto: CreateMarkDto,
  ): Promise<MarkDto> {
    return await this.marksService.addMarks(createMarkDto);
  }

  @Get('student/:student_id')
  public async getMarksByStudent(
    @Param('student_id') student_id: string,
  ): Promise<MarkDto[]> {
    return await this.marksService.findMarksByStudent(student_id);
  }

  @Get('course/:course_id')
  public async getMarksByCourse(
    @Param('course_id') course_id: string,
  ): Promise<MarkDto[]> {
    return await this.marksService.findMarksByCourse(course_id);
  }
}
