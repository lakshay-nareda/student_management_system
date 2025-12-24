import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Mark } from 'src/marks/entities/mark.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  public readonly student_id: string;

  @Column({ length: 50 })
  public first_name: string;

  @Column({ length: 50 })
  public last_name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public phone: string;

  @Column({ type: 'date' })
  public dob: Date;

  @Column()
  public gender: string;

  @Column()
  public address: string;

  @Column({ type: 'enum', enum: StudentStatus })
  public status: StudentStatus;

  @OneToOne(() => Enrollment, (enrollment) => enrollment.student)
  public enrollment: Enrollment;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  public updated_at: Date;

  @OneToMany(() => Mark, (mark) => mark.student)
  public marks: Mark[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  public attendances: Attendance[];
}
