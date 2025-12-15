import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const enrollment = this.enrollmentRepository.create(createEnrollmentDto);
    return this.enrollmentRepository.save(enrollment);
  }
  findAll(): Promise<Enrollment[]> {
    return this.enrollmentRepository.find();
  }
  findOne(id: string) {
    return this.enrollmentRepository.findOneBy({ enrollment_id: id });
  }
  update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentRepository.update(id, updateEnrollmentDto);
  }
  remove(id: string) {
    return this.enrollmentRepository.delete(id);
  }
}
