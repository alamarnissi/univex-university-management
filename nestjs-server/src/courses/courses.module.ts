import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { CoursesStudentsService } from './courseStudents.service';
import { MailModule } from 'src/mail/mail.module';
import { CloudStorageService } from '../cloud-storage.service';
import { BunnyCDNStorageService } from 'src/bunnycdn-storage.service';

@Module({
  imports: [ConfigModule, JwtModule, WorkspacesModule, MailModule],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CoursesStudentsService,
    PrismaService,
    WorkspacesService,
    CloudStorageService,
    BunnyCDNStorageService
  ]
})
export class CoursesModule { }
