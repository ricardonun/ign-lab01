import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

interface IGetByCourseAndStutendIdParams {
  courseId: string;
  studentId: string;
}

interface CreateEnrollmentParams {
  courseId: string;
  studentId: string;
}

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  getByCourseAndStutendId({
    courseId,
    studentId,
  }: IGetByCourseAndStutendIdParams) {
    return this.prisma.enrollment.findFirst({
      where: {
        studentId,
        canceledAt: null,
        courseId,
      },
    });
  }

  listAllEnrollments() {
    return this.prisma.enrollment.findMany({
      where: {
        canceledAt: null,
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  listEnrollmentsByStudent(id: string) {
    return this.prisma.enrollment.findMany({
      where: {
        studentId: id,
        canceledAt: null,
      },
    });
  }

  createEnrollment({ courseId, studentId }: CreateEnrollmentParams) {
    return this.prisma.enrollment.create({
      data: {
        courseId,
        studentId,
      },
    });
  }
}
