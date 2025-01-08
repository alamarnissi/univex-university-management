import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
  providers: [StudentsService, PrismaService],
  controllers: [StudentsController],
  imports: [forwardRef(() => AuthModule), ConfigModule, MailModule],
})
export class StudentsModule {}
