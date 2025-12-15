import { Injectable } from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
// import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendenceRepository: Repository<Attendance>,
  ) {}
  create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const attendance = this.attendenceRepository.create(createAttendanceDto);
    return this.attendenceRepository.save(attendance);
  }
  // findAll() {
  //   return `This action returns all attendance`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} attendance`;
  // }

  // update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
  //   return `This action updates a #${id} attendance`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} attendance`;
  // }
}
