import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { checkExpiredToken } from 'src/auth/lib/token-expired';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) { }

  async studentByEmail(email: string) {
    try {
      const student = await this.prisma.students.findUnique({
        where: {
          email
        }
      })

      return student;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong getting student by email!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /* check student in workspace */
  async checkStudentInWorkspace(
    student_email: string,
    workspace_id: string,
  ) {
    try {
      const { email } = await this.prisma.students.findFirst({
        where: {
          email: student_email,
          workspaces: {
            some: {
              workspace_id,
            }
          }, // check if the student is in the workspace
        },
        select: {
          email: true
        }
      });

      return { email };
    } catch (error) {
      return { email: null };
    }
  }

  async getWorkspaceStudents(
    subdomain: string,
    search_query?: string,
    sort_by?: string,
    take?: number
  ) {
    const { workspace_id } = await this.prisma.workspaces.findUnique({
      where: {
        subdomain
      },
      select: {
        workspace_id: true
      }
    })

    if (!workspace_id) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Workspace not found!`,
          data: {}
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Make a conditional orderBy parameter
    const orderBy = [];

    if (sort_by === "most-recent") {
      orderBy.push({ created_at: 'desc' });
    } else if (sort_by === "least-recent") {
      orderBy.push({ created_at: 'asc' });
    } else if (sort_by === "last-login-asc") {
      orderBy.push({ last_login: 'asc' }, { created_at: 'asc' });
    } else if (sort_by === "last-login-desc") {
      orderBy.push({ last_login: 'desc' }, { created_at: 'desc' });
    }
    else {
      // Default sorting 
      orderBy.push({ created_at: 'desc' });
    }

    try {
      const students_list = await this.prisma.students.findMany({
        where: {
          workspaces: {
            some: {
              workspace_id
            }
          },
          student_name: {
            mode: 'insensitive',
            contains: search_query,
          }
        },
        orderBy,
        take,
        select: {
          student_id: true,
          student_name: true,
          email: true,
          workspaces: true,
          last_login: true
        }
      })
      
      const count = students_list.length;
      const students = students_list.map(student => {
        return {
          ...student,
          workspace_id
        }
      });

      return {
        status: HttpStatus.OK,
        data: {
          "students": students,
          "total": count
        },
        message: count === 0 ? "No students were found" : "List of students returned successfully"
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong getting workspace students!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async updateLastLogin(student_email: string) {
    await this.prisma.students.update({
      where: {
        email: student_email
      },
      data: {
        last_login: new Date()
      }
    })
  }

  async incrementLoginAttempts(student_email: string) {
    await this.prisma.students.update({
      where: {
        email: student_email
      },
      data: {
        login_attempts: {
          increment: 1
        }
      }
    })
  }

  async requestForgetPassword(email: string, subdomain: string) {
    const workspace = await this.prisma.workspaces.findUnique({
      where: {
        subdomain
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

    const student = await this.prisma.students.findUnique({
      where: {
        email,
        workspaces: {
          some: {
            workspace_id: workspace.workspace_id
          }
        }
      }
    });

    if (!student) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Student with email ${email} not found`,
          data: {}
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const forget_password_token = await this.authService.generate_reset_password_token(email);
    /* update forget_password_token in student */
    try {
      await this.prisma.students.update({
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
      const reset_password_url = `${this.configService.get("FRONTEND_URL")}/app/${subdomain}/forget-password/students/?modalopen=reset_password&forget_password_token=${forget_password_token}`;

      await this.mailService.sendForgetPasswordEmail({ name: student.student_name, email: student.email }, reset_password_url)
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
      const student = await this.prisma.students.update({
        where: {
          email: payload.email
        },
        data: {
          password,
          forget_password_token: null
        }
      })

      await this.mailService.sendResetPasswordEmail({ name: student.student_name, email: student.email, role: "student", password: new_password });

    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating student!`,
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
    const student = await this.prisma.students.findUnique({
      where: {
        email
      }
    });
    if (!student) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Student with email ${email} not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    if (!student.forget_password_token) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Forget password token not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    /* send forget password email */
    try {
      const reset_password_url = `${this.configService.get("APP_URL")}/api/v1/students/reset-password/${student.forget_password_token}`;

      await this.mailService.sendForgetPasswordEmail({ name: student.student_name, email: student.email }, reset_password_url)
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
}
