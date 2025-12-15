import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Mark } from '../../marks/entities/mark.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  public readonly course_id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  credits: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Mark, (mark) => mark.course)
  marks: Mark[];

  @OneToMany(() => Attendance, (attendance) => attendance.course)
  attendances: Attendance[];
}
