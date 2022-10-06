import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CurrentUser, IAuthUser } from '../../auth/currtent-user';
import { EnrollmentsService } from '../../../services/enrollments.services';
import { StudentsService } from '../../../services/students.services';
import { Student } from '../models/student';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(
    private studentsService: StudentsService,
    private enrollmentsSerivce: EnrollmentsService,
  ) {}

  @Query(() => [Student])
  @UseGuards(AuthorizationGuard)
  students() {
    return this.studentsService.listAllStudents();
  }

  // @Query(() => Student)
  // @UseGuards(AuthorizationGuard)
  // me(@CurrentUser() user: IAuthUser) {
  //   return this.studentsService.getStudentsByAuthUserId(user.sub);
  // }

  @ResolveField()
  enrollments(@Parent() students: Student) {
    return this.enrollmentsSerivce.listEnrollmentsByStudent(students.id);
  }
}
