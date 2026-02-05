import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Course } from '../../course/entities/course.entity';
export enum EnrollmentStatus {
  ACTIVE = 'active',
  WITHDRAWN = 'withdrawn',
}
@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  public readonly enrollment_id: string;

  @ManyToOne(() => Student, (student) => student.enrollment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  public student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  public course: Course;

  @Column({ type: 'date' })
  public enrolled_on: Date;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  public status: EnrollmentStatus;
}
