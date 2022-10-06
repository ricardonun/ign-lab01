import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CoursesService } from '../services/courses.services';
import { EnrollmentsService } from '../services/enrollments.services';
import { StudentsService } from '../services/students.services';
import { PurchaseController } from './controllers/purchases.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PurchaseController],
  providers: [StudentsService, CoursesService, EnrollmentsService],
})
export class MessagingModule {}
