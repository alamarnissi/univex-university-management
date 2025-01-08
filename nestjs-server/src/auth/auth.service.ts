import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { InstructorsService } from 'src/instructors/instructors.service';
import { CreateManagerDto } from '../managers/dtos/create-manager.dto';
import { ManagersService } from '../managers/managers.service';
import TokenPayload from './dto/tokenPayload.interface';
import { jwtConstants } from './lib/constants';
import { checkExpiredToken } from './lib/token-expired';
import { StudentsService } from 'src/students/students.service';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { PayloadType } from './lib/types';

// const accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => ManagersService))
    private managersService: ManagersService,
    @Inject(forwardRef(() => InstructorsService))
    private instructorsService: InstructorsService,
    private studentsService: StudentsService,
    private workspacesService: WorkspacesService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) { }

  public async registerManager(registrationData: CreateManagerDto) {

    /* check if manager with that email or business name exist */
    const checkByEmail = await this.managersService.managerByEmail(registrationData.email);
    const checkByBusinessName = await this.managersService.managerByBusinessName(registrationData.learning_business_name);

    /* throw error if manager with that email or business name already exists */
    if (checkByEmail) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: `Manager with this email already exists`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    
    if (checkByBusinessName) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: `Institution / Business name already exists`,
        },
        HttpStatus.CONFLICT,
      );
    }

    /* hash password */
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    const { manager_id, email, learning_business_name } = await this.managersService.createManager({
      ...registrationData,
      password: hashedPassword,
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        manager_id,
        email,
        learning_business_name,
      },
      message: `Manager created successfully! Please verify your email!`,
    }
  }

  async signInManager(email: string, pass: string, subdomain: string): Promise<any> {
    const manager = await this.getAuthenticatedUser("manager", email, pass);

    if (!manager) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid credentials!`,
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    const isPasswordVerified = await this.verifyPassword(pass, manager.password);

    if (!isPasswordVerified) {
      /* update login_attempts */
      await this.managersService.incrementLoginAttempts(manager.email);

      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid credentials!`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    /* check manager has verified email */
    const isEmailVerified = manager.email_verified;

    if (!isEmailVerified) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: `Please confirm your email first!`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    /* update last login */
    await this.managersService.updateLastLogin(manager.email);

    const { password, ...result } = manager;

    const payload = {
      sub: manager.manager_id,
      user_id: manager.manager_id,
      email: manager.email,
      first_name: manager.first_name,
      workspace_id: subdomain,
      role: "manager"
    };

    const tokens = await this.getTokens(payload);

    return {
      status: HttpStatus.OK,
      data: tokens,
      message: "Manager logged in successfully"
    };
  }

  async signInManagerWithGoogle(email: string): Promise<any> {
    const url_new_user = `/?modalopen=complete_register&email=${email}`;

    const manager = await this.managersService.managerByEmail(email);

    if (!manager) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Manager with this email does not exist`,
        data: {
          email,
          url: url_new_user
        }
      };
    }

    /* check manager has verified email */
    const isEmailVerified = manager.email_verified;

    if (!isEmailVerified) {
      await this.managersService.resendVerifyEmail(email);

      return {
        status: HttpStatus.FORBIDDEN,
        message: `Your email is not verified!`,
        data: {
          email,
          url: url_new_user
        }
      };
    }
    /* update last login */
    await this.managersService.updateLastLogin(manager.email);

    const payload = {
      sub: manager.manager_id,
      user_id: manager.manager_id,
      email: manager.email,
      first_name: manager.first_name,
      workspace_id: manager.workspace_id,
      role: "manager"
    };

    const tokens = await this.getTokens(payload);

    return {
      status: HttpStatus.OK,
      data: tokens,
      message: "Manager logged in successfully"
    };
  }

  async signInInstructor(email: string, pass: string, workspace_subdomain: string): Promise<any> {
    const workspace = await this.workspacesService.get_workspace_by_subdomain(workspace_subdomain);

    // check if workspace exists
    if (workspace?.status === 404 || workspace?.status === 500) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Workspace not found",
      }
    }

    const checkInstructorInWorkspace = await this.instructorsService.checkInstructorInWorkspace(email, workspace?.data.workspace_id);

    if (!checkInstructorInWorkspace) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: "Instructor not found in this workspace",
      }
    }

    const instructor = await this.getAuthenticatedUser("instructor", email, pass);

    if (!instructor) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid credentials!`,
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    const isPasswordVerified = await this.verifyPassword(pass, instructor.password);

    if (!isPasswordVerified) {
      /* update login_attempts */
      await this.instructorsService.incrementLoginAttempts(instructor.email);

      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid credentials!`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    /* update last login */
    await this.instructorsService.updateLastLogin(instructor.email);

    const { password, ...result } = instructor;
    const payload = {
      sub: instructor.email,
      user_id: instructor.instructor_id,
      email: instructor.email,
      first_name: instructor.instructor_name,
      workspace_id: workspace_subdomain,
      role: "instructor"
    };

    const tokens = await this.getTokens(payload);

    return {
      status: HttpStatus.OK,
      data: tokens,
      message: "Instructor logged in successfully"
    };
  }

  async signInStudent(email: string, pass: string, workspace_subdomain: string): Promise<any> {
    const workspace = await this.workspacesService.get_workspace_by_subdomain(workspace_subdomain);

    // check if workspace exists
    if (workspace?.status === 404 || workspace?.status === 500) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Workspace not found",
      }
    }

    const checkStudentInWorkspace = await this.studentsService.checkStudentInWorkspace(email, workspace?.data.workspace_id);

    if (!checkStudentInWorkspace) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: "Student not found in this workspace",
      }
    }

    const student = await this.getAuthenticatedUser("student", email, pass);

    if (!student) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid credentials!`,
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    const isPasswordVerified = await this.verifyPassword(pass, student.password);

    if (!isPasswordVerified) {
      /* update login_attempts */
      await this.studentsService.incrementLoginAttempts(student.email);

      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid credentials!`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    /* update last login */
    await this.studentsService.updateLastLogin(student.email);

    const { password, ...result } = student;
    const payload = {
      sub: student.email,
      user_id: student.student_id,
      email: student.email,
      first_name: student.student_name,
      workspace_id: workspace_subdomain,
      role: "student"
    };

    const tokens = await this.getTokens(payload);

    return {
      status: HttpStatus.OK,
      data: tokens,
      message: "Student logged in successfully"
    };
  }

  async refreshToken(token: any) {
    const { refreshToken, accessToken } = token

    if (!refreshToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid refresh token 000!`,
          data: {}
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (!payload) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: `Invalid refresh token aaa!`,
            data: {}
          },
          HttpStatus.UNAUTHORIZED,
        )
      }
      const { iat, exp, ...rest } = payload;

      const tokens = await this.getTokens(rest as PayloadType);

      return {
        status: HttpStatus.OK,
        data: tokens,
        message: "Refresh token successfully"
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `Invalid refresh token bbb!`,
          data: {}
        },
        HttpStatus.UNAUTHORIZED,
      )
    }
  }

  async getTokens(payload: PayloadType) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        payload,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
        },
      ),
    ]);
    const accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    return {
      access_token,
      refresh_token,
      accessTokenExpiry
    };
  }

  public async getAuthenticatedUser(role: string, email: string, plainTextPassword: string) {

    let user: any;
    if (role === "manager") {
      user = await this.managersService.managerByEmail(email);
    } else if (role === "instructor") {
      user = await this.instructorsService.instructorByEmail(email);
    } else if (role === "student") {
      user = await this.studentsService.studentByEmail(email);
    }
    if (!user) {
      return null;
    }

    await this.verifyPassword(plainTextPassword, user.password);
    return user;

  }

  public async getUserData(email: string, role: string) {

    let user: any;
    if (role === "manager") {
      user = await this.managersService.managerByEmail(email);
    } else if (role === "instructor") {
      user = await this.instructorsService.instructorByEmail(email);
    } else if (role === "student") {
      user = await this.studentsService.studentByEmail(email);
    }
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: "User not found",
        },
        HttpStatus.NOT_FOUND
      );
    }

    return user;

  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    return isPasswordMatching;
  }

  async generate_verify_email_token(email: string) {
    const payload = {
      sub: "email verification", email,
      expires: Date.now() + 60 * 60 * 1000
    };

    return await this.jwtService.signAsync(payload);
  }

  async generate_reset_password_token(email: string) {
    const payload = {
      sub: "reset password", email,
      expires: Date.now() + 60 * 60 * 1000
    };

    return await this.jwtService.signAsync(payload);
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  async verify_manager_email(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }

    /* decode token */
    const payload = await this.decode_token(token);

    /* check if token is expired */
    checkExpiredToken(payload);

    /* check if token is valid */
    if (!payload.email) {
      throw new HttpException(
        `Invalid verification token!`,
        HttpStatus.FORBIDDEN,
      );
    }
    /* check if user exists */
    const manager = await this.managersService.managerByEmail(payload.email);
    if (!manager) {
      throw new HttpException(
        `Invalid verification code or account already verified!`,
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      /* update user */
      await this.managersService.updateManager({
        where: {
          manager_id: manager.manager_id
        },
        data: {
          email_verified: true,
          email_verification_token: null
        }
      })
      const frontend_url = `${this.configService.get("FRONTEND_URL")}/?modalopen=verify_email&email_status=verified&submit_email=${payload.email}`

      return { url: frontend_url };
    } catch (error) {
      throw new HttpException(
        `Something went wrong updating manager!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

  }

  async decode_token(token: string) {
    const payload = await this.jwtService.verifyAsync(
      token,
      {
        secret: jwtConstants.secret
      }
    );
    return payload;
  }
}
