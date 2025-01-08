import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { PrismaService } from '../prisma.service';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';

@Module({
  providers: [ManagersService, WorkspacesService, PrismaService],
  exports: [ManagersService],
  controllers: [ManagersController],
  imports: [
    forwardRef(() => AuthModule), 
    forwardRef(() => WorkspacesModule), 
    ConfigModule, 
    MailModule
  ],
})
export class ManagersModule {}

