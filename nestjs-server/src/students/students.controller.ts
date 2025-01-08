import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
    constructor(
        private studentsService: StudentsService
    ) { }

    @UseGuards(AuthGuard)
    @ApiQuery({name: "take", required: false, description: "How many students to return", type: "number"})
    @ApiQuery({ name: "student_name", required: false, description: "Search By student name" })
    @ApiQuery({ name: "sort_student", required: false, description: "Filter students", example: ["most-recent", "least-recent", "last-login-asc", "last-login-desc"], })
    @Get('list')
    async instructorsList(
        @Req() req,
        @Query('take') take?: number,
        @Query("student_name") student_name?: string,
        @Query("sort_student") sort_student?: string,
    ) {
        const current_user = req.user;

        const subdomain = current_user.workspace_id;

        return await this.studentsService.getWorkspaceStudents(
            subdomain,
            student_name,
            sort_student,
            take | 10
        );
    }

    @Post('forget-password')
    async requestForgetPasswordToken(@Body('email') email: string, @Body('subdomain') subdomain: string) {
        return this.studentsService.requestForgetPassword(email, subdomain)
    }

    @Post('reset-password/:token')
    async resetPassword(@Param('token') token: string, @Body('password') password: string) {
        return this.studentsService.resetPassword(token, password)
    }

    @Post('forget-password/resendemail')
    async resendForgetPasswordEmail(@Body('email') email: string) {
        return this.studentsService.resendForgetPasswordEmail(email)
    }
}
