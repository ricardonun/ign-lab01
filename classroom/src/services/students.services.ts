import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

interface CreateStudentParam {
  authUserId: string;
}

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  listAllStudents() {
    return this.prisma.student.findMany();
  }

  getStudentsByAuthUserId(authUserId: string) {
    const a = this.prisma.student.findUnique({
      where: {
        authUserId,
      },
    });

    console.log(a);

    return a;
  }

  getStudentsyId(id: string) {
    return this.prisma.student.findUnique({ where: { id } });
  }

  createStudent({ authUserId }: CreateStudentParam) {
    return this.prisma.student.create({
      data: {
        authUserId,
      },
    });
  }
}
