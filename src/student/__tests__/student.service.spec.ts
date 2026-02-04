import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../student.service';
import { EntityManager } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student, StudentStatus } from '../entities/student.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('StudentService', () => {
  let service: StudentService;

  const mockStudent = {
    student_id: 'uuid-123',
    first_name: 'Rahul',
    last_name: 'Sharma',
    email: 'rahul@test.com',
    phone: '1234567890',
    dob: '2000-01-01',
    gender: 'Male',
    address: 'Delhi',
    status: StudentStatus.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  } as unknown as Student;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockStudent], 1]),
  };

  const mockEntityManager: MockType<EntityManager> = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createStudent', () => {
    it('should create a new student successfully', async () => {
      const dto: CreateStudentDto = {
        first_name: 'Rahul',
        last_name: 'Sharma',
        email: 'rahul@test.com',
        phone: '1234567890',
        dob: '2000-01-01',
        gender: 'Male',
        address: 'Delhi',
        status: StudentStatus.ACTIVE,
      };

      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(null);
      (mockEntityManager.create as jest.Mock).mockReturnValue(mockStudent);
      (mockEntityManager.save as jest.Mock).mockResolvedValue(mockStudent);

      const result = await service.createStudent(dto);

      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
      expect(result.email).toEqual(dto.email);
    });

    it('should throw error if email already exists', async () => {
      const dto: CreateStudentDto = {
        first_name: 'Rahul',
        last_name: 'Sharma',
        email: 'rahul@test.com',
        phone: '1234567890',
        dob: '2000-01-01',
        gender: 'Male',
        address: 'Delhi',
        status: StudentStatus.ACTIVE,
      } as CreateStudentDto;

      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockStudent);

      await expect(service.createStudent(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStudentsList', () => {
    it('should return a list of students with meta data', async () => {
      const result = await service.getStudentsList('Rahul', 'active', 1, 10);

      expect(mockEntityManager.createQueryBuilder).toHaveBeenCalledWith(
        Student,
        'student',
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.data[0].first_name).toBe('Rahul');
    });
  });

  describe('getStudentById', () => {
    it('should return student if found', async () => {
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockStudent);

      const result = await service.getStudentById('uuid-123');
      expect(result.first_name).toEqual('Rahul');
    });

    it('should throw NotFoundException if student not found', async () => {
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.getStudentById('wrong-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStudent', () => {
    it('should update student successfully', async () => {
      const updateDto: UpdateStudentDto = { first_name: 'Updated Name' };
      const updatedMockStudent = { ...mockStudent, ...updateDto };

      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockStudent);
      (mockEntityManager.save as jest.Mock).mockResolvedValue(
        updatedMockStudent,
      );

      const result = await service.updateStudent('uuid-123', updateDto);

      expect(result.first_name).toEqual('Updated Name');
    });

    it('should throw error if student to update not found', async () => {
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        service.updateStudent('wrong-id', {} as UpdateStudentDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteStudent', () => {
    it('should delete student successfully', async () => {
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockStudent);
      (mockEntityManager.remove as jest.Mock).mockResolvedValue(mockStudent);

      await service.deleteStudent('uuid-123');

      expect(mockEntityManager.remove).toHaveBeenCalledWith(mockStudent);
    });

    it('should throw error if student to delete not found', async () => {
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteStudent('wrong-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
