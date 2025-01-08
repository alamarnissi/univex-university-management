import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, Req, Res, UseGuards, forwardRef } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { CreateManagerDto } from './dtos/create-manager.dto';
import { DetailsManagerDto } from './dtos/details-manager.dto';
import { LoginManagerDto } from './dtos/login-manager.dto';
import { ManagersService } from './managers.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateManagerDto } from './dtos/update-manager.dto';

@ApiTags('Managers')
@Controller('managers')
export class ManagersController {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private configService: ConfigService,
        private readonly managersService: ManagersService,
    ) { }


    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreateManagerDto,
        description: 'Json structure for manager object',
    })
    @Post('create')
    createManager(
        @Body() createManagerDTO: CreateManagerDto
    ) {
        return this.authService.registerManager(createManagerDTO)
    }

    @Get('verify-email/:token')
    async verifyManagerEmail(
        @Res() res,
        @Param('token') token: string,
    ) {
        const {url} = await this.managersService.verifyManager(token)
        if (url) {
            res.redirect(url)
        }
    }

    @Post("logingoogle")
    async loginGoogle(
        @Res() res,
        @Body('manager_email') email: string,
    ) {
        const response = await this.authService.signInManagerWithGoogle(email);

        if(response.status === 404) {
            return res.redirect(response.data.url);
        }else {
            return response
        }
        
    }

    @Post('resend-verification-email')
    async resendVerificationEmail(@Body('email') email: string) {
        return this.managersService.resendVerifyEmail(email)
    }

    @ApiQuery({name: "take", required: false, description: "How many manager to return", type: "number"})
    @ApiQuery({name: "email", required: false, description: "Find by email", type: "string"})
    @Get('list')
    async getManagers(
        @Query('take') take?: number,
        @Query('email') email?: string
        ): Promise<DetailsManagerDto[]> {

        return this.managersService.managers({
            take: take | 5,
            where: {
                email
            }
        })
    }

    @Post('forget-password')
    async requestForgetPasswordToken(@Body('email') email: string, @Body('subdomain') subdomain: string) {
        return this.managersService.requestForgetPassword(subdomain, email)
    }

    @Post('reset-password/:token')
    async resetPassword(@Param('token') token: string, @Body('password') password: string) {
        return this.managersService.resetPassword(token, password)
    }

    @Post('forget-password/resendemail')
    async resendForgetPasswordEmail(@Body('email') email: string) {
        return this.managersService.resendForgetPasswordEmail(email)
    }

    @UseGuards(AuthGuard)
    @Put('update-profile')
    async updateManager(@Req() request, @Body() updateManagerDto: UpdateManagerDto) {
        const current_user = request.user;
        const manager_id = current_user.user_id;

        return this.managersService.updateProfileSettings(manager_id, updateManagerDto)
    }
}
