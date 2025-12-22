import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { CreateMarkDto } from './dto/create-mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark)
    private markRepository: Repository<Mark>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // private calculateGrade(score: number, maxScore: number): string {
  //   const percentage = (score / maxScore) * 100;
  //   if (percentage >= 90) {
  //     return 'A';
  //   } else if (percentage >= 80) {
  //     return 'B';
  //   } else if (percentage >= 70) {
  //     return 'C';
  //   } else if (percentage >= 60) {
  //     return 'D';
  //   } else {
  //     return 'F';
  //   }
  // }

  async create(createMarkDto: CreateMarkDto) {
    const { student_id, course_id, exam_type, score, max_score } =
      createMarkDto;

    const student = await this.studentRepository.findOne({
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.courseRepository.findOne({
      where: { course_id: course_id },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const mark = this.markRepository.create({
      student,
      course,
      exam_type,
      score,
      max_score,
    });

    return await this.markRepository.save(mark);
  }

  async findByStudent(student_id: string) {
    return await this.markRepository.find({
      where: { student: { student_id: student_id } },
      relations: ['course'],
    });
  }

  async findByCourse(course_id: string) {
    return await this.markRepository.find({
      where: { course: { course_id: course_id } },
      relations: ['student'],
    });
  }
}
