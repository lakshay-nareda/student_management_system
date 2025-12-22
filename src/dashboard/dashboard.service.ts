import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ✅ FIX: Module wali same relative paths yahan bhi honi chahiye
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import {
  Attendance,
  AttendanceStatus,
} from '../attendance/entities/attendance.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
  ) {}
  async getAdminDashboard() {
    const totalStudents = await this.studentRepository.count();
    const totalCourses = await this.courseRepository.count();
    const totalAttendances = await this.attendanceRepository.count();
    const totalEnrollments = await this.enrollmentRepository.count();

    const totalPresent = await this.attendanceRepository.count({
      where: { status: AttendanceStatus.PRESENT },
    });

    let avgAttendance = 0;
    if (totalAttendances > 0) {
      avgAttendance = (totalPresent / totalAttendances) * 100;
    }

    return {
      totalStudents,
      totalCourses,
      totalAttendances,
      totalEnrollments,
      avgAttendance,
    };
  }
}
