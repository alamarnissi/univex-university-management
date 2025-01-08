import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { MailModule } from 'src/mail/mail.module';
import { ManagersModule } from 'src/managers/managers.module';
import { PrismaService } from 'src/prisma.service';
import { StudentsModule } from 'src/students/students.module';
import { StudentsService } from 'src/students/students.service';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './lib/constants';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, StudentsService, WorkspacesService],
  exports: [AuthService],
  imports: [
    ConfigModule,
    forwardRef(() => ManagersModule),
    forwardRef(() => InstructorsModule),
    forwardRef(() => StudentsModule),
    WorkspacesModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ]
})
export class AuthModule {}
