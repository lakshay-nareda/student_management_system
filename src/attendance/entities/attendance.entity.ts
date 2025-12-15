import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}
@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  public readonly attendance_id: string;

  @ManyToOne(() => Student, (student) => student.attendances)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.attendances)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column()
  remarks: string;
}
