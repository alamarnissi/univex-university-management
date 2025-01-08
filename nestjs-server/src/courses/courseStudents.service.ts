import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AssignNewStudentDto } from "./dtos/assign-student.dto";
import { randomPassword } from "src/utils/random-password";
import { encryptPassword } from "src/utils/encrypt-password";
import { MailService } from "src/mail/mail.service";
import { CoursesService } from "./courses.service";

@Injectable()
export class CoursesStudentsService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private courseService: CoursesService
    ) { }

    async update_students_registered_courses(type: "add" | "remove", workspace_id: string, email: string, slug: string) {
        try {
            const { workspaces } = await this.prisma.students.findUnique({
                where: {
                    email,
                    workspaces: {
                        some: {
                            workspace_id
                        }
                    }
                },
                select: {
                    workspaces: true
                }
            })

            // Update courses in the target workspace
            let updatedWorkspaces = []
            if (type === "add") {
                updatedWorkspaces = workspaces.map((workspace) =>
                    workspace.workspace_id === workspace_id
                        ? {
                            ...workspace,
                            registered_courses: workspace.registered_courses.filter(
                                (course) => course !== slug
                            ).concat(slug)
                        }
                        : workspace
                );
            } else {
                updatedWorkspaces = workspaces.map((workspace) =>
                    workspace.workspace_id === workspace_id
                        ? {
                            ...workspace,
                            registered_courses: workspace.registered_courses.filter(
                                (course) => course !== slug
                            )
                        }
                        : workspace
                );
            }

            const student = await this.prisma.students.update({
                where: {
                    email,
                    workspaces: {
                        some: {
                            workspace_id
                        }
                    }
                },
                data: {
                    workspaces: {
                        set: updatedWorkspaces
                    }
                }
            });

            return student
        } catch (error) {
            throw new HttpException("Something went wrong updating student registered courses", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateWorkspaceActiveStudents(workspace_id: string, student_email: string) {
        try {
            const workspace = await this.prisma.workspaces.update({
                where: {
                    workspace_id,
                },
                data: {
                    active_students: {
                        push: student_email
                    }
                },
                select: {
                    active_students: true
                }
            })

            return workspace
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: `Something went wrong updating workspace active students!`,
                    data: {}
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

    }

    async create_new_student(workspace_id: string, student_data: AssignNewStudentDto) {
        try {
            const password = randomPassword();
            const hashedPassword = await encryptPassword(password)

            const workspace = {
                workspace_id,
                registered_courses: []
            }

            const student = await this.prisma.students.create({
                data: { ...student_data, password: hashedPassword, workspaces: { set: workspace } },
                select: {
                    workspaces: true,
                    student_id: true,
                    student_name: true,
                    email: true
                }
            })

            await this.updateWorkspaceActiveStudents(workspace_id, student.email)

            return { ...student, password };
        } catch (error) {
            throw new HttpException("Something went wrong creating student", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async assign_student(subdomain: string, slug: string, student_data: AssignNewStudentDto) {
        const { student_name, email } = student_data;

        const workspace_id = await this.courseService.check_get_workspace_by_subdomain(subdomain);

        const {course_name, students} = await this.prisma.courses.findUnique({
            where: {
                slug
            },
            select: {
                course_access: true,
                course_name: true,
                students: true
            }
        })

        // Check if student already assigned to course 
        if(students && students.length > 0) {

            const checkInCourse = await this.prisma.courses.count({
                where: {
                    slug,
                    students: {
                        some: {
                            email
                        },
                    },
                },
            });

            if (checkInCourse) {
                return {
                    status: HttpStatus.CONFLICT,
                    data: {},
                    message: `Student already assigned to this course`
                }
            }
        }

        // Check student exist
        let student = await this.prisma.students.findUnique({
            where: { email }
        })

        if (student) {
            // check student in workspace
            const studentInWorkspace = await this.prisma.students.findUnique({
                where: {
                    email,
                    workspaces: {
                        some: {
                            workspace_id
                        }
                    }
                }
            })
            if (!studentInWorkspace) {
                // add student to workspace and update courses in student workspace
                const new_workspace_data = {
                    workspace_id,
                    registered_courses: [slug],
                    feedback: []
                }
                student = await this.prisma.students.update({
                    where: {
                        email
                    },
                    data: {
                        workspaces: {
                            push: new_workspace_data
                        }
                    }
                })

            } else {
                student = await this.update_students_registered_courses("add", workspace_id, email, slug)
                await this.mailService.sendAssignementOldStudent(course_name, student_data, student.password)
            }

            await this.updateWorkspaceActiveStudents(workspace_id, email)
        } else {
            // create new student with updated courses
            const new_student = await this.create_new_student(workspace_id, student_data)

            if (new_student) {
                student = await this.update_students_registered_courses("add", workspace_id, email, slug)

                await this.mailService.sendNewAssignementStudent(course_name, student_data, new_student.password)
            }
        }

        try {
            let { number_of_students, course_access, price } = await this.prisma.courses.findUnique({
                where: {
                    slug,
                    workspace_id
                },
                select: {
                    number_of_students: true,
                    course_access: true,
                    price: true
                }
            })
            await this.prisma.courses.update({
                where: {
                    slug,
                    workspace_id
                },
                data: {
                    number_of_students: number_of_students + 1,
                    students: { push: { ...student_data, student_id: student.student_id, added_at: new Date(), amount_paid: course_access === "Paid" ? price : 0  } }
                }
            })

            await this.courseService.updateCourseWorkspaceSalesKpis(slug, workspace_id)

            return {
                status: HttpStatus.OK,
                data: {},
                message: "Student assigned successfully"
            }
        } catch (error) {
            throw new HttpException("Something went wrong adding student to course", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async unassign_student(subdomain: string, slug: string, email: string) {
        const workspace_id = await this.courseService.check_get_workspace_by_subdomain(subdomain);
        
        try {
            // Get the assigned instrcutors of course
            let { students, number_of_students } = await this.prisma.courses.findUnique({ where: { slug }, select: { students: true, number_of_students: true } });

            // Remove the instructor from the courses assigned instructors
            await this.prisma.courses.update({
                where: { slug, workspace_id },
                data: {
                    number_of_students: number_of_students - 1,
                    students: { set: students.filter(student => student.email !== email) }
                },
            })
        } catch (error) {
            throw new HttpException('Something went wrong removing student from course', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        // remvoe course from student registered courses
        await this.update_students_registered_courses("remove", workspace_id, email, slug)

        return {
            status: HttpStatus.OK,
            data: {},
            message: "Student removed from course successfully"
        }
    }
}