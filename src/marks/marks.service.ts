import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Equal } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { CreateMarkDto } from './dto/create-mark.dto';
import { MarkDto } from './dto/mark.dto';

@Injectable()
export class MarksService {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async addMarks(createMarkDto: CreateMarkDto): Promise<MarkDto> {
    return await this.entityManager.transaction(async (markAddManage) => {
      const { student_id, course_id, exam_type, score, max_score } =
        createMarkDto;

      const student = await markAddManage.findOne(Student, {
        where: { student_id: Equal(student_id) },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const course = await markAddManage.findOne(Course, {
        where: { course_id: Equal(course_id) },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }

      const mark = markAddManage.create(Mark, {
        student,
        course,
        exam_type,
        score,
        max_score,
      });

      const saveMarks = await this.entityManager.save(mark);

      return MarkDto.createFromEntity(saveMarks);
    });
  }

  public async findMarksByStudent(student_id: string): Promise<MarkDto[]> {
    const markList = await this.entityManager.find(Mark, {
      where: { student: { student_id: Equal(student_id) } },
      relations: ['course', 'student'],
    });
    return markList.map((e) => MarkDto.createFromEntity(e));
  }

  public async findMarksByCourse(course_id: string): Promise<MarkDto[]> {
    const markList = await this.entityManager.find(Mark, {
      where: { course: { course_id: course_id } },
      relations: ['student', 'course'],
    });

    return markList.map((e) => MarkDto.createFromEntity(e));
  }
}
