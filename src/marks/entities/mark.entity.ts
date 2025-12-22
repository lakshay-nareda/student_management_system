import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  AfterLoad,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  graded_at: Date;

  grade: string;

  @AfterLoad()
  calculateGrade() {
    const percentage = (this.score / this.max_score) * 100;
    if (percentage >= 90) {
      this.grade = 'A';
    } else if (percentage >= 80) {
      this.grade = 'B';
    } else if (percentage >= 70) {
      this.grade = 'C';
    } else if (percentage >= 60) {
      this.grade = 'D';
    } else {
      this.grade = 'F';
    }
  }
}
