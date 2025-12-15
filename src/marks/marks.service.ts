import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { CreateMarkDto } from './dto/create-mark.dto';
// import { UpdateMarkDto } from './dto/update-mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark)
    private markRepository: Repository<Mark>,
  ) {}

  create(createMarkDto: CreateMarkDto): Promise<Mark> {
    const mark = this.markRepository.create(createMarkDto);
    return this.markRepository.save(mark);
  }

  // findAll() {
  //   return `This action returns all marks`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} mark`;
  // }

  // update(id: number, updateMarkDto: UpdateMarkDto) {
  //   return `This action updates a #${id} mark`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} mark`;
  // }
}
