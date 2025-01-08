import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dtos/create-instructor.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateInstructorDto } from './dtos/update-instructor.dto';

@Controller('instructors')
export class InstructorsController {
    constructor(
        private instructorService: InstructorsService
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreateInstructorDto,
        description: 'Json structure for instructor object',
    })
    @UseGuards(AuthGuard)
    @Post('create')
    async registerInstructor(@Req() request, @Body() instructorData: CreateInstructorDto) {
        const current_user = request.user

        const subdomain = current_user.workspace_id;

        return await this.instructorService.createNewInstructor(instructorData, subdomain);
    }

    /* update instructor details endpoint */
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UpdateInstructorDto,
        description: 'Json structure for instructor object',
    })
    @UseGuards(AuthGuard)
    @Post('update')
    async updateInstructorDetails(@Req() request, @Body() instructorData: UpdateInstructorDto) {
        const current_user = request.user
        const user_email = current_user.email;
        return await this.instructorService.updateInstructorDetails(user_email, instructorData);
    }

    /* delete instructor endpoint */
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseGuards(AuthGuard)
    @Post('delete/:instructor_id')
    async deleteInstructor(@Req() request, @Param('instructor_id') instructor_id: string) {
        const current_user = request.user
        const subdomain = current_user.workspace_id;
        return await this.instructorService.deleteInstructor(instructor_id, subdomain);
    }

    @UseGuards(AuthGuard)
    @ApiQuery({name: "take", required: false, description: "How many instructors to return", type: "number"})
    @ApiQuery({ name: "instructor_name", required: false, description: "Search By instructor name" })
    @ApiQuery({ name: "sort_instructor", required: false, description: "Filter instructors", example: ["most-recent", "least-recent", "last-login-asc", "last-login-desc"], })
    @Get('list')
    async instructorsList(
        @Req() req,
        @Query('take') take?: number,
        @Query("instructor_name") instructor_name?: string,
        @Query("sort_instructor") sort_instructor?: string,
    ) {
        const current_user = req.user;

        const subdomain = current_user.workspace_id;

        return await this.instructorService.getWorkspaceInstructors(
            subdomain,
            instructor_name,
            sort_instructor,
            take | 10,
        );
    }

    @Post('forget-password')
    async requestForgetPasswordToken(@Body('email') email: string, @Body('subdomain') subdomain: string) {
        return this.instructorService.requestForgetPassword(email, subdomain)
    }

    @Post('reset-password/:token')
    async resetPassword(@Param('token') token: string, @Body('password') password: string) {
        return this.instructorService.resetPassword(token, password)
    }

    @Post('forget-password/resendemail')
    async resendForgetPasswordEmail(@Body('email') email: string) {
        return this.instructorService.resendForgetPasswordEmail(email)
    }
}
