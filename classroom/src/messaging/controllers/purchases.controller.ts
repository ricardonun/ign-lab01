import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CoursesService } from '../../services/courses.services';
import { EnrollmentsService } from '../../services/enrollments.services';
import { StudentsService } from '../../services/students.services';

export interface PurchaseCreatePayload {
  customer: Customer;
  product: Product;
}

export interface Customer {
  authUserId: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
}

@Controller()
export class PurchaseController {
  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService,
  ) {}
  @EventPattern('purchases.new-purchase')
  async purchaseCreate(@Payload('value') payload: PurchaseCreatePayload) {
    let student = await this.studentsService.getStudentsByAuthUserId(
      payload.customer.authUserId,
    );

    if (!student) {
      student = await this.studentsService.createStudent({
        authUserId: payload.customer.authUserId,
      });
    }

    let course = await this.coursesService.getCourseBySlug(
      payload.product.slug,
    );

    if (!course) {
      await this.coursesService.createCourse({
        title: payload.product.slug,
      });
    }
    console.log(`Craido com sucesso ${student.authUserId} ${course.slug}`);

    await this.enrollmentsService.createEnrollment({
      courseId: course.id,
      studentId: student.id,
    });
  }
}
