import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from '../database/database.module';
import path from 'node:path';
import {
  ApolloDriver,
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { CourseResolver } from './graphql/resolver/course.resolver';
import { EnrollmentResolver } from './graphql/resolver/enrollment.resolver';
import { StudentsResolver } from './graphql/resolver/students.resolver';
import { CoursesService } from '../services/courses.services';
import { EnrollmentsService } from '../services/enrollments.services';
import { StudentsService } from '../services/students.services';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    //Resolver
    CourseResolver,
    EnrollmentResolver,
    StudentsResolver,

    //Services
    CoursesService,
    EnrollmentsService,
    StudentsService,
  ],
})
export class HttpModule {}
