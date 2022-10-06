import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CoursesService } from '../../../services/courses.services';
import { EnrollmentsService } from '../../../services/enrollments.services';
import { StudentsService } from '../../../services/students.services';
import { Enrollment } from '../models/enrollment';

@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(
    private enrollmentServices: EnrollmentsService,
    private courseServices: CoursesService,
    private studentsServices: StudentsService,
  ) {}

  @Query(() => [Enrollment])
  @UseGuards(AuthorizationGuard)
  enrollment() {
    return this.enrollmentServices.listAllEnrollments();
  }

  @ResolveField()
  student(@Parent() enrollment: Enrollment) {
    return this.studentsServices.getStudentsyId(enrollment.studentId);
  }

  @ResolveField()
  course(@Parent() enrollment: Enrollment) {
    return this.courseServices.getCourseById(enrollment.courseId);
  }
}
