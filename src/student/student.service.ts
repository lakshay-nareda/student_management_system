import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

export interface StudentResponse {
  data: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
    last_page: number;
  };
}

@Injectable()
export class StudentService {
  constructor(
    @InjectEntityManager()
    private readonly entityManagerStudent: EntityManager,
  ) {}

  public async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const { email } = createStudentDto;
    const existingStudent = await this.entityManagerStudent.findOne(Student, {
      where: { email: email },
    });
    if (existingStudent) {
      throw new BadRequestException('Student with this email already exists');
    }
    const student = this.entityManagerStudent.create(Student, createStudentDto);
    return this.entityManagerStudent.save(student);
  }

  public async findAll(
    search?: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<StudentResponse> {
    const skip = (page - 1) * limit;

    const query = this.entityManagerStudent.createQueryBuilder(
      Student,
      'student',
    );

    if (status) {
      query.andWhere('student.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(student.first_name LIKE :search OR student.last_name LIKE :search OR student.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.skip(skip).take(limit);

    query.orderBy('student.created_at', 'DESC');

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  public async findOne(student_id: string): Promise<Student> {
    const student = await this.entityManagerStudent.findOne(Student, {
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${student_id} not found`);
    }
    return student;
  }

  public async update(student_id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(student_id);
    Object.assign(student, updateStudentDto);
    return await this.entityManagerStudent.save(student);
  }

  public async remove(student_id: string): Promise<void> {
    const student = await this.findOne(student_id);
    await this.entityManagerStudent.remove(student);
  }
}
