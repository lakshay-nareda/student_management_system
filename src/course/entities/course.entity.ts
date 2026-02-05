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
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @Column()
  public credits: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, {
    onDelete: 'CASCADE',
  })
  public enrollments: Enrollment[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public updated_at: Date;

  @OneToMany(() => Mark, (mark) => mark.course)
  public marks: Mark[];

  @OneToMany(() => Attendance, (attendance) => attendance.course, {
    onDelete: 'CASCADE',
  })
  public attendances: Attendance[];
}
