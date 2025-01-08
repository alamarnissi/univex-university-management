import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Managers, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { DetailsManagerDto } from './dtos/details-manager.dto';
import { CreateManagerDto } from './dtos/create-manager.dto';
import { UpdateManagerDto } from './dtos/update-manager.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { MailService } from 'src/mail/mail.service';
import { checkExpiredToken } from 'src/auth/lib/token-expired';
import * as bcrypt from 'bcrypt';

export type User = any;

@Injectable()
export class ManagersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private prisma: PrismaService,
    private mailService: MailService,
    private workspacesService: WorkspacesService,
    private readonly configService: ConfigService,
  ) { }

  async managerByEmail(
    email: string,
  ): Promise<Partial<Managers> | null> {
    const manager = await this.prisma.managers.findUnique({
      where: { email },
      select: {
        manager_id: true,
        workspace_id: true,
        first_name: true,
        last_name: true,
        email: true,
        institution_type: true,
        email_verified: true,
        learning_business_name: true,
        phone_number: true,
        password: true,
      }
    });

    if (!manager) return null

    return manager;
  }

  async managerByBusinessName(
    BusinessName: string,
  ): Promise<Managers | null> {
    const manager = await this.prisma.managers.findFirst({
      where: { learning_business_name: {mode: "insensitive", contains: BusinessName} }
    });

    return manager;
  }

  async managers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ManagersWhereUniqueInput;
    where?: Prisma.ManagersWhereInput;
    orderBy?: Prisma.ManagersOrderByWithRelationInput;
  }): Promise<DetailsManagerDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.managers.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
        institution_type: true,
        learning_business_name: true
      }
    });
  }

  async createManager(data: CreateManagerDto) {

    /* create verification email token in auth.service and prepare a verif link and then create manager */
    const email_verification_token = await this.authService.generate_verify_email_token(data.email);

    const verification_url = `${this.configService.get("APP_URL")}/api/v1/managers/verify-email/${email_verification_token}`

    /* create manager */
    const new_manager = await this.prisma.managers.create({
      data: {
        ...data,
        email_verification_token: email_verification_token
      },
      select: {
        manager_id: true,
        email: true,
        learning_business_name: true
      }
    });

    let workspace_subdomain = "";

    if (new_manager) {
      try {
        /* create workspace */
        const { data } = await this.workspacesService.create_workspace(new_manager.manager_id, { name: new_manager.learning_business_name });

        workspace_subdomain = data.subdomain;

        /* update manager workspace_id using data.workspace_id */
        await this.prisma.managers.update({
          where: {
            manager_id: new_manager.manager_id
          },
          data: {
            workspace_id: data.workspace_id
          }
        });

      } catch (error) {
        throw new HttpException(
          `Something went wrong creating workspace`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }

      try {
        /* send verification email */
        await this.mailService.sendManagerEmailConfirmation({ manager_name: data.first_name, email: data.email }, workspace_subdomain, verification_url)
      } catch (error) {
        /* remove email_verification_token from created manager */
        await this.prisma.managers.update({
          where: {
            manager_id: new_manager.manager_id
          },
          data: {
            email_verification_token: null
          }
        });

        throw new HttpException(
          `Something went wrong sending verification email`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        `Something went wrong creating manager`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return new_manager
  }

  async resendVerifyEmail(email: string) {

    const manager = await this.prisma.managers.findUnique({
      where: {
        email
      },
      select: {
        workspace_id: true,
        first_name: true,
        email: true
      }
    });

    if (!manager) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Manager with this email not found`,
        },
        HttpStatus.NOT_FOUND
      );
    }

    const workspace = await this.prisma.workspaces.findUnique({
      where: {
        workspace_id: manager.workspace_id
      },
      select: {
        subdomain: true
      }
    })

    if (!workspace) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Workspace not found`,
        },
        HttpStatus.NOT_FOUND
      );
    }

    const email_verification_token = await this.authService.generate_verify_email_token(email);

    const verification_url = `${this.configService.get("APP_URL")}/api/v1/managers/verify-email/${email_verification_token}`

    await this.prisma.managers.update({
      where: {
        email
      },
      data: {
        email_verification_token,
      }
    })

    try {
      /* send verification email */
      await this.mailService.sendManagerEmailConfirmation({ manager_name: manager.first_name, email: email }, workspace.subdomain, verification_url);

      return {
        status: HttpStatus.OK,
        message: "Verification email sent successfully"
      }
    } catch (error) {
      /* remove email_verification_token from created manager */
      await this.prisma.managers.update({
        where: {
          email
        },
        data: {
          email_verification_token: null
        }
      });

      throw new HttpException(
        {
          message: `Something went wrong sending verification email`,
          status: HttpStatus.INTERNAL_SERVER_ERROR
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyManager(token: string) {
    return this.authService.verify_manager_email(token);
  }

  async updateLastLogin(manager_email: string) {
    await this.prisma.managers.update({
      where: {
        email: manager_email
      },
      data: {
        last_login: new Date()
      }
    })
  }

  /* increment login_attempt */
  async incrementLoginAttempts(manager_email: string) {
    await this.prisma.managers.update({
      where: {
        email: manager_email
      },
      data: {
        login_attempts: {
          increment: 1
        }
      }
    })
  }

  async updateManager(params: {
    where: Prisma.ManagersWhereUniqueInput;
    data: Partial<Managers>;
  }): Promise<Managers> {
    const { where, data } = params;
    return await this.prisma.managers.update({
      data,
      where,
    });
  }

  async deleteManager(where: Prisma.ManagersWhereUniqueInput): Promise<Managers> {
    return await this.prisma.managers.delete({
      where,
    });
  }

  async requestForgetPassword(subdomain: string, email: string) {
    const workspace = await this.prisma.workspaces.findUnique({
      where: {
        subdomain
      },
      select: {
        workspace_id: true
      }
    });

    if (!workspace) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Workspace not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    const manager = await this.prisma.managers.findUnique({
      where: {
        email,
        workspace_id: workspace.workspace_id
      }
    });

    if (!manager) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Manager with email ${email} not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    const forget_password_token = await this.authService.generate_reset_password_token(email);
    /* update forget_password_token in manager */
    try {
      await this.prisma.managers.update({
        where: {
          email
        },
        data: {
          forget_password_token
        }
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating forget_password_token`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    /* send forget password email */
    try {
      const reset_password_url = `${this.configService.get("FRONTEND_URL")}/?modalopen=reset_password&subdomain=${subdomain}&forget_password_token=${forget_password_token}`;

      await this.mailService.sendForgetPasswordEmail({ name: manager.first_name, email: manager.email }, reset_password_url)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong sending forget password email`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      status: HttpStatus.OK,
      message: `Forget password email sent successfully!`,
      data: {}
    }
  }

  async resetPassword(token: string, new_password: string) {
    if (!token) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: `Invalid token!`,
          data: {}
        },
        HttpStatus.FORBIDDEN,
      );
    }

    /* decode token */
    const payload = await this.authService.decode_token(token);

    /* check if token is expired */
    checkExpiredToken(payload);

    /* check if token is valid */
    if (!payload.email) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: `Invalid verification token!`,
          data: {}
        },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      /* hash password */
      const password = await bcrypt.hash(new_password, 10);

      /* update user */
      const manager = await this.prisma.managers.update({
        where: {
          email: payload.email
        },
        data: {
          password,
          forget_password_token: null
        }
      })

      await this.mailService.sendResetPasswordEmail({ name: manager.first_name, email: manager.email, role: "manager", password: new_password });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating manager!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return {
      status: HttpStatus.OK,
      message: `Password reset successfully!`,
      data: {}
    }
  }

  async resendForgetPasswordEmail(email: string) {
    const manager = await this.prisma.managers.findUnique({
      where: {
        email
      }
    });
    if (!manager) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Manager with email ${email} not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    if (!manager.forget_password_token) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Forget password token not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    /* send forget password email */
    try {
      const reset_password_url = `${this.configService.get("APP_URL")}/api/v1/managers/reset-password/${manager.forget_password_token}`;

      await this.mailService.sendForgetPasswordEmail({ name: manager.first_name, email: manager.email }, reset_password_url)
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong sending forget password email`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      status: HttpStatus.OK,
      message: `Forget password email sent successfully!`,
      data: {}
    }
  }

  async updateProfileSettings(manager_id: string, updateManagerDto: UpdateManagerDto) {
    const { email, first_name, last_name, phone_number, current_password, new_password } = updateManagerDto;

    let new_hashed_password = "";

    const manager = await this.prisma.managers.findUnique({
      where: {
        manager_id
      }
    });

    if (!manager) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: `Manager was not found`,
        data: {}
      },
        HttpStatus.NOT_FOUND
      );
    }

    if (current_password !== "" && new_password !== "") {

      const isPasswordVerified = await this.authService.verifyPassword(current_password, manager.password);

      if (!isPasswordVerified) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: `Password is incorrect!`,
          },
          HttpStatus.UNAUTHORIZED,
        )
      }

      /* hash new password */
      new_hashed_password = await bcrypt.hash(new_password, 10);
    }

    try {
      await this.prisma.managers.update({
        where: {
          manager_id
        },
        data: {
          email,
          first_name,
          last_name,
          phone_number,
          password: new_hashed_password !== "" ? new_hashed_password : manager.password
        }
      })

      return {
        status: HttpStatus.OK,
        message: `Profile settings updated successfully!`,
        data: {}
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating manager!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

}
