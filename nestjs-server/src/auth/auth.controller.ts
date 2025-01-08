import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ManagerResponseDto } from 'src/managers/dtos/response-manager.dto';
import { TransformDataInterceptor } from 'src/utils/transformData.interceptor';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import RequestWithManager from './interfaces/requestWithManager.interface';

@Controller()
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    // Manager Endpoint //

    @HttpCode(HttpStatus.OK)
    @Post('managers/login')
    signInManager(@Res({ passthrough: true }) response: Response, @Body() signInDto: {email: string, password: string, workspace_subdomain: string}) {
        const cookie = this.authService.getCookieWithJwtToken(signInDto.email);
        response.setHeader('Set-Cookie', cookie);
        return this.authService.signInManager(signInDto.email, signInDto.password, signInDto.workspace_subdomain);
    }

    @HttpCode(HttpStatus.OK)
    @Post('instructors/login')
    signInInstructor(@Res({ passthrough: true }) response: Response, @Body() signInDto: {email: string, password: string, workspace_subdomain: string}) {
        const cookie = this.authService.getCookieWithJwtToken(signInDto.email);
        response.setHeader('Set-Cookie', cookie);
        return this.authService.signInInstructor(signInDto.email, signInDto.password, signInDto.workspace_subdomain);
    }

    @HttpCode(HttpStatus.OK)
    @Post('students/login')
    signInStudents(@Res({ passthrough: true }) response: Response, @Body() signInDto: {email: string, password: string, workspace_subdomain: string}) {
        const cookie = this.authService.getCookieWithJwtToken(signInDto.email);
        response.setHeader('Set-Cookie', cookie);
        return this.authService.signInStudent(signInDto.email, signInDto.password, signInDto.workspace_subdomain);
    }

    @Post("refresh-token")
    refreshToken(@Body() data: any) {
        return this.authService.refreshToken(data?.token);
    }

    @UseGuards(AuthGuard)
    @Get('users/profile')
    getUserProfile(@Request() req) {
        const current_user = req.user;
        const email = current_user.email;
        const role = current_user.role;

        return this.authService.getUserData(email, role);
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(new TransformDataInterceptor(ManagerResponseDto))
    @Get("auth/credentials")
    authenticate(@Req() request: RequestWithManager) {
        return request.user;
    }
}
