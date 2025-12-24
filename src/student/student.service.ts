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
import { StudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentDto> {
    const { email } = createStudentDto;
    const existingStudent = await this.entityManager.findOne(Student, {
      where: { email: email },
    });
    if (existingStudent) {
      throw new BadRequestException('Student with this email already exists');
    }
    const student = this.entityManager.create(Student, createStudentDto);
    return this.entityManager.save(student);
  }

  public async getStudentsList(
    search?: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: StudentDto[];
    meta: { total: number; page: number; limit: number; last_page: number };
  }> {
    const skip = (page - 1) * limit;

    const query = this.entityManager.createQueryBuilder(Student, 'student');

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

  public async getStudentById(student_id: string): Promise<StudentDto> {
    const student = await this.entityManager.findOne(Student, {
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${student_id} not found`);
    }
    return student;
  }

  public async updateStudent(
    student_id: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.getStudentById(student_id);
    Object.assign(student, updateStudentDto);
    return await this.entityManager.save(student);
  }

  public async deleteStudent(student_id: string): Promise<void> {
    const student = await this.getStudentById(student_id);
    await this.entityManager.remove(student);
  }
}
