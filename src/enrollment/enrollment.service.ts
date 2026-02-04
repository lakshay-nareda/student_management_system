import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Equal } from 'typeorm';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
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

  // 👇 FIXED: Argument type changed to 'string'
  private parseDate(dateString: string): Date {
    if (!dateString) return new Date();

    // ✅ Case 1: YYYY-MM-DD
    if (dateString.includes('-')) {
      return new Date(dateString);
    }

    // ✅ Case 2: DD/MM/YYYY (Indian Format)
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }

    return new Date(dateString);
  }

  public async addEnrollment(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentDto> {
    return await this.entityManager.transaction(async (manager) => {
      const { student_id, course_id, enrolled_on, status } =
        createEnrollmentDto;

      const student = await manager.findOne(Student, {
        where: { student_id: student_id },
      });
      if (!student) {
        throw new NotFoundException(`Student Id ${student_id} is not found.`);
      }

      const course = await manager.findOne(Course, {
        where: { course_id: course_id },
      });
      if (!course) {
        throw new NotFoundException(`Course ID ${course_id} is not found.`);
      }

      const exists = await manager.findOne(Enrollment, {
        where: {
          student: { student_id: student_id },
          course: { course_id: course_id },
        },
      });
      if (exists) {
        throw new NotFoundException(
          'Student is already enrolled in this course',
        );
      }

      // ✅ Convert String Date to Date Object
      const finalDate = this.parseDate(enrolled_on);

      const enrollment = manager.create(Enrollment, {
        student,
        course,
        enrolled_on: finalDate,
        status: status || EnrollmentStatus.ACTIVE,
      });

      const saveEnrollment = await manager.save(enrollment);

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
      throw new NotFoundException(`Enrollment ID ${enrollment_id} not found`);
    }
    await this.entityManager.remove(enrollment);
  }
}
