import { Module, forwardRef } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { PrismaService } from 'src/prisma.service';
import { WorkspacesController } from './workspaces.controller';
import { JwtModule } from '@nestjs/jwt';
import { ManagersModule } from 'src/managers/managers.module';

@Module({
  providers: [WorkspacesService, PrismaService],
  controllers: [WorkspacesController],
  imports: [JwtModule, forwardRef(() => ManagersModule)],
})
export class WorkspacesModule {}
