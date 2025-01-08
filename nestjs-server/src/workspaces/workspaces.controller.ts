import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
    constructor(
        private workspacesService: WorkspacesService
    ){}

    @ApiBody({
        type: CreateWorkspaceDto
    })
    @Post('create')
    async createWorkspace(manager_id: string, @Body() workspace_data: CreateWorkspaceDto){
        return await this.workspacesService.create_workspace(manager_id, workspace_data)
    }

    @UseGuards(AuthGuard)
    @ApiBody({
        type: UpdateWorkspaceDto
    })
    @Patch('update/:id')
    async updateWorkspace(@Param('id') workspace_id: string, @Body() workspace_data: UpdateWorkspaceDto) {
        return await this.workspacesService.update_workspace(workspace_id, workspace_data)
    }

    @Get(':subdomain')
    async getWorkspaceInfo(@Param('subdomain') subdomain: string) {
        return await this.workspacesService.get_workspace_by_subdomain(subdomain)
    }

    @UseGuards(AuthGuard)
    @Get("/:subdomain/metrics")
    async getWorkspaceKpis(@Req() request, @Param("subdomain") subdomain: string) {  
        const current_user = request.user

        const manager_id = current_user.user_id;

        return await this.workspacesService.getManagerWorkspaceKpis(subdomain, manager_id);
    }
}
