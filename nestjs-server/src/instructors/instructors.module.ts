import { Module, forwardRef } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { PrismaService } from 'src/prisma.service';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [InstructorsService, PrismaService],
  exports: [InstructorsService],
  controllers: [InstructorsController],
  imports: [forwardRef(() => AuthModule), ConfigModule, MailModule],
})
export class InstructorsModule {}
