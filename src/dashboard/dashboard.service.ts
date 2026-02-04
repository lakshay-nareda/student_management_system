import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ✅ Imports from other modules
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import {
  Attendance,
  AttendanceStatus,
} from '../attendance/entities/attendance.entity';
import {
  Enrollment,
  EnrollmentStatus,
} from '../enrollment/entities/enrollment.entity';

@Injectable()
export class DashboardService {
  public constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async getDashboardStats() {
    // 1. Total Students
    const totalStudents = await this.studentRepository.count();

    // 2. Total Courses
    const totalCourses = await this.courseRepository.count();

    // 3. Active Enrollments Only
    const activeEnrollments = await this.enrollmentRepository.count({
      where: { status: EnrollmentStatus.ACTIVE },
    });

    // 4. Average Attendance Calculation
    const totalAttendances = await this.attendanceRepository.count();
    const totalPresent = await this.attendanceRepository.count({
      where: { status: AttendanceStatus.PRESENT },
    });

    let avgAttendance = 0;
    if (totalAttendances > 0) {
      // Calculate percentage and fix to 1 decimal place
      avgAttendance = parseFloat(
        ((totalPresent / totalAttendances) * 100).toFixed(1),
      );
    }

    // ✅ Return object matches Frontend Interface
    return {
      totalStudents,
      totalCourses,
      activeEnrollments,
      avgAttendance,
    };
  }
}
