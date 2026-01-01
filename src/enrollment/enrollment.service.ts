import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Equal } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentDto } from './dto/enrollment.dto';

@Injectable()
export class EnrollmentService {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async addEnrollment(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentDto> {
    return await this.entityManager.transaction(async (enrollAddManage) => {
      const { student_id, course_id } = createEnrollmentDto;

      const student = await enrollAddManage.findOne(Student, {
        where: { student_id: Equal(student_id) },
      });

      if (!student) {
        throw new NotFoundException(`Student Id ${student_id} is not found.`);
      }

      const course = await enrollAddManage.findOne(Course, {
        where: { course_id: Equal(course_id) },
      });

      if (!course) {
        throw new NotFoundException(`Course ID ${course_id} is not found.`);
      }

      const exists = await enrollAddManage.findOne(Enrollment, {
        where: {
          student: { student_id: Equal(student_id) },
          course: { course_id: Equal(course_id) },
        },
      });

      if (!exists) {
        throw new NotFoundException(
          'Student is alreday enrolled in this course',
        );
      }

      const enrollment = enrollAddManage.create(Enrollment, {
        student,
        course,
      });

      const saveEnrollment = await enrollAddManage.save(enrollment);

      return EnrollmentDto.createFromEntity(saveEnrollment);
    });
  }

  public async getStudentEnrollmentByCourses(
    student_ID: string,
  ): Promise<EnrollmentDto[]> {
    const enrollment = await this.entityManager.find(Enrollment, {
      where: { student: { student_id: Equal(student_ID) } },
      relations: ['course', 'student'],
    });
    return enrollment.map((e) => EnrollmentDto.createFromEntity(e));
  }

  public async getCourseEnrollmentByStudents(
    course_ID: string,
  ): Promise<EnrollmentDto[]> {
    const enrollment = await this.entityManager.find(Enrollment, {
      where: { course: { course_id: Equal(course_ID) } },
      relations: ['student', 'course'],
    });
    return enrollment.map((e) => EnrollmentDto.createFromEntity(e));
  }

  public async deleteEnrollment(enrollment_id: string): Promise<void> {
    const enrollment = await this.entityManager.findOne(Enrollment, {
      where: { enrollment_id: enrollment_id },
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollment_id} not found`,
      );
    }
    await this.entityManager.remove(enrollment);
  }
}
