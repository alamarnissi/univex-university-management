import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { AssignNewStudentDto } from 'src/courses/dtos/assign-student.dto';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService
  ) { }

  async sendManagerEmailConfirmation(manager, workspace_subdomain: string, confirmation_url: string) {
    try {
      await this.mailerService.sendMail({
        to: manager.email,
        from: '"Univex Team"', // override default from
        subject: 'Welcome to Univex! Please Confirm Your Email',
        template: './managers/manager_confirm_email', // `.ejs` extension is appended automatically
        context: { // filling <%= %> brackets with content
          name: manager.manager_name,
          subdomain: workspace_subdomain,
          url: confirmation_url,
        },
      });
    } catch (error) {
      throw new HttpException('Error while sending email', 500)
    }
  }


  /**
   * @param instructor 
   * @param workspace_name 
   */
  async sendInstructorWelcomeEmail(
    instructor: { email: string, password: string, instructor_name: string },
    workspace_name: string
  ) {
    try {
      await this.mailerService.sendMail({
        to: instructor.email,
        from: '"Univex Team"', // override default from
        subject: 'Welcome to Univex! New Workspace Credentials',
        template: './instructors/welcome_new_instructors', // `.ejs` extension is appended automatically
        context: { // filling <%= %> brackets with content
          name: instructor.instructor_name,
          workspace_name: workspace_name,
          email: instructor.email,
          password: instructor.password
        },
      });
    } catch (error) {
      throw new HttpException('Error while sending email', 500)
    }
  }

  async sendInstructorNewWorkspace(
    instructor: { email: string, instructor_name: string },
    workspace_name: string
  ) {
    try {
      await this.mailerService.sendMail({
        to: instructor.email,
        from: '"Univex Team"', // override default from
        subject: 'Univex | Welcome to Your New Workspace',
        template: './instructors/instructor_add_new_workspace', // `.ejs` extension is appended automatically
        context: { // filling <%= %> brackets with content
          name: instructor.instructor_name,
          workspace_name: workspace_name,
          email: instructor.email,
        },
      });
    } catch (error) {
      throw new HttpException('Error while sending email', 500)
    }
  }

  async sendForgetPasswordEmail(
    user: { name: string, email: string },
    reset_password_url: string
  ) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: '"Univex Team"', // override default from
        subject: 'Univex | Reset Password',
        template: './forget_password', // `.ejs` extension is appended automatically
        context: { // filling <%= %> brackets with content
          name: user.name,
          url: reset_password_url
        },
      });
    } catch (error) {
      throw new HttpException('Error while sending email', 500)
    }
  }

  async sendResetPasswordEmail(
    user: { name: string, email: string, role: string, password: string },
  ) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: '"Univex Team"', // override default from
        subject: 'Univex | New Credentials',
        template: './reset_password', // `.ejs` extension is appended automatically
        context: { // filling <%= %> brackets with content
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password
        },
      });
    } catch (error) {
      throw new HttpException('Error while sending email', 500)
    }
  }


  /***
   * Course Management Emails
   */
  async sendNewAssignementStudent(course_name: string, student: AssignNewStudentDto, password: string) {
    await this.mailerService.sendMail({
      to: student.email,
      from: '"Univex Team"', // override default from
      subject: 'Welcome to Univex! Enjoy learning',
      template: './new-assign-student', // `.ejs` extension is appended automatically
      context: { // filling <%= %> brackets with content
        course_name,
        name: student.student_name,
        email: student.email,
        password
      },
    });
  }

  async sendAssignementOldStudent(course_name: string, student: AssignNewStudentDto, password: string) {
    await this.mailerService.sendMail({
      to: student.email,
      from: '"Univex Team"',
      subject: 'Welcome Back! Enjoy learning',
      template: './old-assign-student',
      context: {
        course_name,
        name: student.student_name,
      },
    });
  }
}
