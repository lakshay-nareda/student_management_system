import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';

export enum ExamType {
  MIDTERM = 'midterm',
  FINAL = 'final',
  QUIZ = 'quiz',
}
@Entity()
export class Mark {
  @PrimaryGeneratedColumn('uuid')
  public readonly mark_id: string;

  @ManyToOne(() => Student, (student) => student.marks)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.marks)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({
    type: 'enum',
    enum: ExamType,
    default: ExamType.MIDTERM,
  })
  exam_type: ExamType;

  @Column()
  score: number;

  @Column()
  max_score: number;

  @Column()
  graded_at: string;
}
