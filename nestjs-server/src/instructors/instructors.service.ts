import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Instructors } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { encryptPassword } from 'src/utils/encrypt-password';
import { randomPassword } from 'src/utils/random-password';
import { CreateInstructorDto } from './dtos/create-instructor.dto';
import { checkExpiredToken } from 'src/auth/lib/token-expired';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstructorsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private prisma: PrismaService,
    private mailService: MailService,
    private configService: ConfigService
  ) { }

  /* create new instructors */
  async createNewInstructor(instructorData: CreateInstructorDto, subdomain: string) {
    const {workspace_id} = await this.prisma.workspaces.findUnique({
      where: {
        subdomain
      },
      select: {
        workspace_id: true
      }
    })

    if(!workspace_id) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Workspace not found!`,
          data: {}
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const instructor = await this.instructorByEmail(instructorData.email);
    /* If instructor is not found in the database - we create one */
    if (!instructor) {
      /* hash password */
      const random_password = randomPassword();
      const hashedPassword = await encryptPassword(random_password);
      const workspaces = [{ workspace_id }];
      const { email, instructor_name } = await this.prisma.instructors.create({
        data: {
          password: hashedPassword,
          workspaces,
          ...instructorData
        },
        select: {
          email: true,
          instructor_name: true,
        }
      })

      if (!email) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `An error has occured creating new instructor!`,
            data: {}
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const workspace = await this.updateWorkspaceActiveInstructors(email, workspace_id);

      /* send a welcome email and tell he's added to a new workspace */
      await this.mailService.sendInstructorWelcomeEmail(
        { email, password: random_password, instructor_name },
        workspace.name
      )

      return {
        status: HttpStatus.CREATED,
        message: `Instructor created successfully!`,
        data: { email }
      }
    }

    /* check instructor in workspace */
    const { email } = await this.checkInstructorInWorkspace(instructorData.email, workspace_id);

    if (email && email !== null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Instructor with this email already exists in this workspace!`,
          data: {}
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    /* update worksapces in instructors model */
    await this.updateInstructorWorkspaces(instructorData.email, workspace_id);

    /* update active instructors */
    const workspace = await this.updateWorkspaceActiveInstructors(instructorData.email, workspace_id);

    /* if instructor in inactive_instructors remove it from there */
    for (const inactive_instructor of workspace.inactive_instructors) {
      if (instructorData.email === inactive_instructor) {
        await this.updateWorkspaceInactiveInstructors("remove", instructorData.email, workspace_id);
      }
    }

    /* send a welcome email and tell he's added to a new workspace */
    await this.mailService.sendInstructorNewWorkspace(
      { email: instructorData.email, instructor_name: instructorData.instructor_name },
      workspace.name
    )
    return {
      status: HttpStatus.CREATED,
      message: `Instructor created successfully!`,
      data: { email: instructorData.email }
    }
  }

  /* update instructor details */
  async updateInstructorDetails(email: string, data: Partial<Instructors>) {
    try {
      await this.prisma.instructors.update({
        where: {
          email
        },
        data
      })

      return {
        status: HttpStatus.OK,
        message: `Instructor details updated successfully!`,
        data: {}
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating instructor details!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* delete instructor */
  async deleteInstructor(instructor_id: string, subdomain: string) {
    const {workspace_id} = await this.prisma.workspaces.findUnique({
      where: {
        subdomain
      },
      select: {
        workspace_id: true
      }
    })

    if(!workspace_id) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Workspace not found!`,
          data: {}
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const instructor = await this.prisma.instructors.findUnique({
      where: {
        instructor_id,
        workspaces: {
          some: {
            workspace_id
          }
        }
      }
    });
    if (!instructor) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Instructor not found!`,
          data: {}
        },
        HttpStatus.NOT_FOUND,
      );
    }
    /* delete instructor from assigned courses */
    const { workspaces } = await this.prisma.instructors.findUnique({
      where: {
        instructor_id,
        workspaces: {
          some: {
            workspace_id
          },
        }
      },
      select: {
        workspaces: {
          select: {
            workspace_id: true,
            courses: true
          }
        }
      }
    })

    for (const workspace of workspaces) {
      const { courses } = workspace;
      if (workspace_id === workspace.workspace_id && courses.length !== 0) {
        for (const courseSlug of workspace.courses) {
          const courseData = await this.prisma.courses.findUnique({ where: { slug: courseSlug }, select: { course_id: true, assigned_instructors: true } })

          await this.prisma.courses.update({
            where: {
              course_id: courseData.course_id,
              workspace_id
            },
            data: {
              assigned_instructors: {
                set: courseData.assigned_instructors.filter(instructor => instructor.instructor_id !== instructor_id)
              }
            }
          })
        }
      }
    }

    /* delete instructor from workspace */
    try {
      await this.prisma.instructors.update({
        where: {
          instructor_id
        },
        data: {
          workspaces: {
            set: instructor.workspaces.filter(workspace => workspace.workspace_id !== workspace_id)
          }
        }
      })
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong deleting instructor!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    /** set instructor to inactive */
    await this.updateWorkspaceInactiveInstructors("add", instructor.email, workspace_id);

    return {
      status: HttpStatus.OK,
      message: `Instructor deleted successfully!`,
      data: {}
    }
  }

  /* get all instructor by worskspace */
  async getWorkspaceInstructors(
    subdomain: string,
    search_query?: string,
    sort_by?: string,
    take?: number
  ) {
    const {workspace_id} = await this.prisma.workspaces.findUnique({
      where: {
        subdomain
      },
      select: {
        workspace_id: true
      }
    })

    if(!workspace_id) {
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

    const instructors_list = await this.prisma.instructors.findMany({
      where: {
        workspaces: {
          some: {
            workspace_id
          }
        },
        instructor_name: {
          mode: 'insensitive',
          contains: search_query,
        }
      },
      orderBy,
      take,
      select: {
        email: true,
        instructor_id: true,
        instructor_name: true,
        profession: true,
        last_login: true,
        workspaces: true
      }
    });

    const count = instructors_list.length;
    const instructors = instructors_list.map(instructor => {
      return {
        ...instructor,
        workspace_id
      }
    });

    return {
      status: HttpStatus.OK,
      data: {
        "instructors": instructors,
        "total": count
      },
      message: count === 0 ? "No Instructors were found" : "List of Instructors returned successfully"
    };
  }


  /* get instructor by email */
  async instructorByEmail(
    email: string,
  ) {
    const instructor = await this.prisma.instructors.findUnique({
      where: { email },
    });

    if(!instructor) return null

    const {created_at, forget_password_token, ...rest} = instructor

    return rest;
  }

  /* check instructor in workspace */
  async checkInstructorInWorkspace(
    instructor_email: string,
    workspace_id: string,
  ) {
    try {
      const { email } = await this.prisma.instructors.findFirst({
        where: {
          email: instructor_email,
          workspaces: { some: { workspace_id } }, // check if the instructor is in the workspace
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

  async updateInstructorWorkspaces(instructor_email: string, workspace_id: string) {
    try {
      await this.prisma.instructors.update({
        where: {
          email: instructor_email
        },
        data: {
          workspaces: {
            push: {
              workspace_id
            }
          }
        }
      })
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating instructor workspace!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }
  }
  async updateWorkspaceActiveInstructors(instructor_email: string, workspace_id: string) {
    try {
      const { name, active_instructors, inactive_instructors } = await this.prisma.workspaces.update({
        where: { workspace_id },
        data: {
          active_instructors: {
            push: instructor_email
          }
        },
        select: {
          name: true,
          active_instructors: true,
          inactive_instructors: true
        }
      })
      return { name, active_instructors, inactive_instructors };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating active instructors in workspace!`,
          data: {}
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateWorkspaceInactiveInstructors(type: "add" | "remove", instructor_email: string, workspace_id: string) {
    const workspace = await this.prisma.workspaces.findUnique({
      where: { workspace_id },
      select: {
        active_instructors: true,
        inactive_instructors: true
      }
    })

    if (!workspace) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Workspace not found!`,
          data: {}
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (type === "add") {
      if (!workspace.active_instructors.includes(instructor_email)) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: `Instructor is not in this workspace!`,
            data: {}
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.workspaces.update({
        where: { workspace_id },
        data: {
          active_instructors: {
            set: workspace.active_instructors.filter(instructor => instructor !== instructor_email)
          }
        }
      })

      try {
        await this.prisma.workspaces.update({
          where: { workspace_id },
          data: {
            inactive_instructors: {
              push: instructor_email
            }
          }
        })
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `Something went wrong updating inactive instructors in workspace!`,
            data: {}
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      if (workspace.inactive_instructors.includes(instructor_email)) {
        await this.prisma.workspaces.update({
          where: { workspace_id },
          data: {
            inactive_instructors: {
              set: workspace.inactive_instructors.filter(instructor => instructor !== instructor_email)
            }
          }
        })
      }
    }
  }

  async updateLastLogin(instructor_email: string) {
    await this.prisma.instructors.update({
      where: {
        email: instructor_email
      },
      data: {
        last_login: new Date()
      }
    })
  }

  async incrementLoginAttempts(instructor_email: string) {
    await this.prisma.instructors.update({
      where: {
        email: instructor_email
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

    if(!workspace) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Workspace not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    const instructor = await this.prisma.instructors.findUnique({
      where: {
        email,
        workspaces: {
          some: {
            workspace_id: workspace.workspace_id
          }
        }
      }
    });

    if (!instructor) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Instructor with email ${email} not found`,
          data: {}
        },
        HttpStatus.NOT_FOUND
      );
    }

    const forget_password_token = await this.authService.generate_reset_password_token(email);
    /* update forget_password_token in student */
    try {
      await this.prisma.instructors.update({
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
      const reset_password_url = `${this.configService.get("FRONTEND_URL")}/app/${subdomain}/forget-password/instructors/?modalopen=reset_password&forget_password_token=${forget_password_token}`;

      await this.mailService.sendForgetPasswordEmail({ name: instructor.instructor_name, email: instructor.email }, reset_password_url)
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
      const instructor = await this.prisma.instructors.update({
        where: {
          email: payload.email
        },
        data: {
          password,
          forget_password_token: null
        }
      })

      await this.mailService.sendResetPasswordEmail({ name: instructor.instructor_name, email: instructor.email, role: "instructor", password: new_password });

    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Something went wrong updating instructor!`,
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
    const instructor = await this.prisma.instructors.findUnique({
      where: {
        email
      }
    });
    if (!instructor) {
      throw new HttpException(
        `Instructor with email ${email} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    if (!instructor.forget_password_token) {
      throw new HttpException(
        `Forget password token not found`,
        HttpStatus.NOT_FOUND
      );
    }

    /* send forget password email */
    try {
      const reset_password_url = `${this.configService.get("APP_URL")}/api/v1/instructors/reset-password/${instructor.forget_password_token}`;

      await this.mailService.sendForgetPasswordEmail({ name: instructor.instructor_name, email: instructor.email }, reset_password_url)
    } catch (error) {
      throw new HttpException(
        `Something went wrong sending forget password email`,
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

