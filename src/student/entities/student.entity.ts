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
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: StudentStatus })
  status: StudentStatus;

  @OneToOne(() => Enrollment, (enrollment) => enrollment.student)
  enrollment: Enrollment;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Mark, (mark) => mark.student)
  marks: Mark[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];
}
