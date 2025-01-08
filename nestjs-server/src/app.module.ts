import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ManagersModule } from './managers/managers.module';
import { ConfigModule } from '@nestjs/config';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { MailModule } from './mail/mail.module';
import { InstructorsModule } from './instructors/instructors.module';
import { StudentsModule } from './students/students.module';
import config from './config/config';
import { CoursesModule } from './courses/courses.module';

@Module({
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env'],
    }),
    AuthModule, 
    CoursesModule,
    ManagersModule, 
    WorkspacesModule, 
    MailModule, InstructorsModule, StudentsModule,
  ],
})
export class AppModule {}
