import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CurrentUser, IAuthUser } from '../../auth/currtent-user';
import { CoursesService } from '../../../services/courses.services';
import { EnrollmentsService } from '../../../services/enrollments.services';
import { StudentsService } from '../../../services/students.services';
import { CreateCourseInput } from '../input/create-course-input';
import { Course } from '../models/course';

@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private enrollmentServices: EnrollmentsService,
    private courseServices: CoursesService,
    private studentsServices: StudentsService,
  ) {}

  @Query(() => [Course])
  @UseGuards(AuthorizationGuard)
  courses() {
    return this.courseServices.listAllCourse();
  }

  @Query(() => Course)
  @UseGuards(AuthorizationGuard)
  async course(@Args('id') id: string, @CurrentUser() user: IAuthUser) {
    const student = await this.studentsServices.getStudentsByAuthUserId(
      user.sub,
    );

    if (!student) {
      throw new Error('Student not found');
    }

    const enrollment = await this.enrollmentServices.getByCourseAndStutendId({
      courseId: id,
      studentId: student.id,
    });

    if (!enrollment) {
      throw new UnauthorizedException();
    }
    return this.courseServices.getCourseById(id);
  }

  @Mutation(() => Course)
  @UseGuards(AuthorizationGuard)
  createCourse(@Args('data') data: CreateCourseInput) {
    return this.courseServices.createCourse(data);
  }
}
