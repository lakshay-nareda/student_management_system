import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Between, EntityManager, Equal, FindOptionsWhere } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async addAttendance(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDto> {
    return await this.entityManager.transaction(async (attendanceAddMange) => {
      const { student_id, course_id, date, status, remarks } =
        createAttendanceDto;

      const student = await attendanceAddMange.findOne(Student, {
        where: { student_id: Equal(student_id) },
      });

      if (!student) {
        throw new NotFoundException(`Student Id ${student_id} is not found`);
      }

      const course = await attendanceAddMange.findOne(Course, {
        where: { course_id: Equal(course_id) },
      });

      if (!course) {
        throw new NotFoundException(`Course ID ${course_id} is not found`);
      }

      const attendance = attendanceAddMange.create(Attendance, {
        student,
        course,
        date,
        status,
        remarks,
      });

      const saveAttendance = await this.entityManager.save(attendance);

      return AttendanceDto.createFromEntity(saveAttendance);
    });
  }

  public async findAttendanceByStudent(
    student_Id: string,
    form?: string,
    to?: string,
  ): Promise<AttendanceDto[]> {
    const whereCondition: FindOptionsWhere<Attendance> = {
      student: { student_id: student_Id },
    };
    if (form && to) {
      const startDate = new Date(form);
      const endDate = new Date(to);
      endDate.setDate(endDate.getDate() + 1);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadGatewayException('Invalid date rang');
      }
      whereCondition.date = Between(startDate, endDate);
    }
    const attendancelist = await this.entityManager.find(Attendance, {
      where: whereCondition,
      relations: ['course'],
      order: { date: 'DESC' },
    });

    return attendancelist.map((e) => AttendanceDto.createFromEntity(e));
  }

  public async findAttendanceByCourse(
    course_Id: string,
    date?: string,
  ): Promise<AttendanceDto[]> {
    const whereCondition: FindOptionsWhere<Attendance> = {
      course: { course_id: course_Id },
    };

    if (date) {
      whereCondition.date = new Date(date);
    }

    const attendanceList = await this.entityManager.find(Attendance, {
      where: whereCondition,
      relations: ['student'],
    });

    return attendanceList.map((e) => AttendanceDto.createFromEntity(e));
  }
}
