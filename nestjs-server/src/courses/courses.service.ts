import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { CloudStorageService } from 'src/cloud-storage.service';
import { File } from 'src/utils/interfaces/file.interface';
import { PrismaError } from 'src/utils/prisma-error';
import { slugify_title } from 'src/utils/slugify-title';
import { PrismaService } from '../prisma.service';
import { AssignInstructorToCourseDto } from './dtos/assign-instructor.dto';
import { CreateCourseDto } from './dtos/create-course.dto';
import { CreateLessonDto, createProjectlessonDto } from './dtos/create-lesson.dto';
import { ReorderLessonsDto } from './dtos/reorder-lesson.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { BunnyCDNStorageService } from 'src/bunnycdn-storage.service';

@Injectable()
export class CoursesService {
    constructor(
        private prisma: PrismaService,
        private readonly configService: ConfigService,
        private cloudStorageService: CloudStorageService,
        private bunnyCDNStorageService: BunnyCDNStorageService
    ) { }

    async check_get_workspace_by_subdomain(subdomain: string) {
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
                    data: {},
                    message: "Workspace not found"
                },
                HttpStatus.NOT_FOUND
            )
        }

        return workspace_id;
    }

    /**
     * @description Create new course & update workspace courses
     * @param workspace_id 
     * @param course_data 
     * @returns details of newely created course
     */
    async create_course(
        subdomain: string,
        course_data: CreateCourseDto
    ) {
        // make a slug for course 
        const { course_name, ...rest } = course_data
        const slug = slugify_title(course_name)

        const workspace_id = await this.check_get_workspace_by_subdomain(subdomain);

        try {
            const course = await this.prisma.courses.create({
                data: { ...course_data, workspace_id, slug },
                select: {
                    course_id: true,
                    course_name: true,
                    slug: true
                }
            })

            if (course) {
                const workspace = await this.prisma.workspaces.update({
                    data: { courses: { push: course.slug } },
                    where: { subdomain }
                })

                if (workspace) {
                    return {
                        status: HttpStatus.CREATED,
                        data: course,
                        message: "Course created successfully"
                    }
                }
            }
        } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * @description Get course details by slug
     * @param workspace_id 
     * @param slug 
     * @returns single course details
     */
    async get_course_by_slug(
        slug: string
    ) {
        try {
            const course = await this.prisma.courses.findUnique({
                where: {
                    slug
                },
                include: {
                    modules: {
                        orderBy: {
                            order: 'asc'
                        },
                        select: {
                            module_id: true,
                            module_name: true,
                            order: true,
                            lessons: {
                                orderBy: {
                                    order: 'asc'
                                },
                                select: {
                                    lesson_id: true,
                                    lesson_name: true,
                                    lesson_status: true,
                                    lesson_type: true,
                                    order: true
                                }
                            }
                        },
                    },
                }
            })

            if (course.deleted_at === null) {
                return {
                    status: HttpStatus.OK,
                    data: course,
                    message: "Course details returned successfully"
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    data: {},
                    message: `Course was not found or deleted`
                }
            }

        } catch (error) {
            return {
                status: HttpStatus.NOT_FOUND,
                data: {},
                message: `Course was not found`
            }
        }
    }

    /**
     * @description Update course by ID
     * @param course_id 
     * @param course_data 
     * @returns slug of updated course
     */
    async update_course(
        course_id: string,
        course_data: Partial<UpdateCourseDto>
    ) {
        const getCourse = await this.prisma.courses.findUnique({
            where: {
                course_id
            },
            select: {
                promotional_image: true
            }
        })
        if (!getCourse) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Course not found"
            });
        }

        // check if user selected a new image to upload
        if (getCourse.promotional_image && course_data.promotional_image) {
            // validate the name of image is not passed as the previous one
            if(getCourse.promotional_image !== course_data.promotional_image){
                try {
                    await this.cloudStorageService.removeFile(getCourse.promotional_image);
                } catch (error) {
                    throw new HttpException(
                        {
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            message: "Can't remove image, not found"
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }
        }

        try {
            const course = await this.prisma.courses.update({
                data: course_data,
                where: {
                    course_id,
                },
            });

            return {
                status: HttpStatus.OK,
                data: course,
                message: "Course updated successfully"
            }
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === PrismaError.RecordDoesNotExist
            ) {
                throw new NotFoundException(`Course with this slug : ${course_id} not found`);
            }
            throw error;
        }
    }


    /**
     * @description Get list of courses filtred by multiple params
     * @param subdomain 
     * @param status 
     * @param sort_by 
     * @param search_query 
     * @param level 
     * @param access 
     * @returns list of courses
     */
    async get_courses_workspaces(
        subdomain: string,
        user_role?: string,
        user_id?: string,  // used for instructor & students
        status?: string,
        sort_by?: string,
        search_query?: string,
        level?: string, // beginner / medium / advanced
        access?: string  // paid / free
    ) {
        const workspace_id = await this.check_get_workspace_by_subdomain(subdomain);

        if (user_role === "student") {
            // if student get only published courses
            status = "published";
        }
        // Make a custom & dynamic where parameter for our prisma request
        const where = {
            workspace_id,
            ...(status && {
                OR: [
                    // Get all courses if "all" is specified
                    status === "all" && { course_status: { in: ["draft", "published", "in-review"] } },
                    // Get only draft courses
                    status === "draft" && { course_status: "draft" },
                    // Get only published courses
                    status === "published" && { course_status: "published" },
                    // Get only in reivew courses
                    status === "in-review" && { course_status: "in-review" },
                ].filter(Boolean),
            }),
            ...(level && {
                OR: [
                    // Get only beginner courses
                    level === "beginner" && { course_level: "Beginner" },
                    // Get only medium type courses
                    level === "medium" && { course_level: "Medium" },
                    // Get only medium type courses
                    level === "advanced" && { course_level: "Advanced" },
                ].filter(Boolean),
            }),
            ...(access && {
                OR: [
                    // Get only Paid courses
                    access === "paid" && { course_access: "Paid" },
                    // Get only Free courses
                    access === "free" && { course_access: "Free" },
                ].filter(Boolean),
            }),
        }

        // Make a conditional orderBy parameter
        const orderBy = [];

        if (sort_by === "most-recent") {
            orderBy.push({ updated_at: 'desc' });
        } else if (sort_by === "least-recent") {
            orderBy.push({ updated_at: 'asc' });
        } else if (sort_by === "most-rated") {
            orderBy.push({ number_of_ratings: 'desc' }, { updated_at: 'desc' });
        } else if (sort_by === "least-rated") {
            orderBy.push({ number_of_ratings: 'asc' }, { updated_at: 'desc' });
        } else if (sort_by === "price-asc") {
            orderBy.push({ price: 'asc' }, { updated_at: 'desc' });
        } else if (sort_by === "price-desc") {
            orderBy.push({ price: 'desc' }, { updated_at: 'desc' });
        }
        else {
            // Default sorting 
            orderBy.push({ updated_at: 'desc' });
        }

        // Get all courses request with filters (including soft deleted courses)
        const courses_list = await this.prisma.courses.findMany({
            where: {
                ...where,
                ...((user_role === "instructor" && user_id) && {
                    assigned_instructors: {
                        some: {
                            instructor_id: user_id
                        }
                    }
                }),
                ...((user_role === "student" && user_id) && {
                    students: {
                        some: {
                            student_id: user_id
                        }
                    }
                }),
                course_name: { mode: "insensitive", contains: search_query }
            },
            orderBy,
            select: {
                course_id: true,
                course_name: true,
                course_type: true,
                total_modules_number: true,
                overall_rating: true,
                promotional_image: true,
                slug: true,
                course_status: true,
                deleted_at: true
            },
        });
        // Remove soft deleted courses from courses list
        const activeCourses = courses_list.filter(course => course.deleted_at === null);
        // Get count of returned courses
        const count = activeCourses.length;

        return {
            status: HttpStatus.OK,
            data: {
                "courses": activeCourses,
                "total": count
            },
            message: count === 0 ? "No courses were found" : "List of courses returned successfully"
        }
    }

    /**
     * @description Soft delete a course by slug from workspace
     * @param workspace_id 
     * @param slug 
     * @returns slug of deleted course
     */
    async soft_delete_course(subdomain: string, course_slug: string) {
        const workspace_id = await this.check_get_workspace_by_subdomain(subdomain);

        try {
            // Get the courses of workspace
            const { courses } = await this.prisma.workspaces.findUnique({ where: { subdomain }, select: { courses: true } });

            // Remove the course to delete from the workspace courses list
            await this.prisma.workspaces.update({
                where: { subdomain },
                data: { courses: { set: courses.filter(id => id !== course_slug) } },
            })

            // soft delete course by slug, by adding deleted_at date
            const { slug, assigned_instructors, students } = await this.prisma.courses.update({
                where: { slug: course_slug },
                data: { deleted_at: new Date() },
                select: {
                    slug: true,
                    assigned_instructors: true,
                    students: true
                }
            })

            let updatedInstructors = [];

            if (assigned_instructors?.length > 0) {
                // Loop through assigned instructors and remove course slug from workspaces
                await Promise.all(assigned_instructors.map(async assignedInstructor => {
                    const instructor = await this.prisma.instructors.findUnique({
                        where: { instructor_id: assignedInstructor.instructor_id },
                        select: { workspaces: true, instructor_id: true }
                    });

                    if (instructor) {
                        const { workspaces } = await this.prisma.instructors.findUnique({
                            where: { instructor_id: instructor.instructor_id },
                            select: { workspaces: true }
                        })
                        const targetWorkspaceIndex = workspaces.findIndex(
                            workspace => workspace.workspace_id === workspace_id
                        );

                        if (targetWorkspaceIndex !== -1) {
                            workspaces[targetWorkspaceIndex].courses = workspaces[targetWorkspaceIndex].courses.filter(
                                course => course !== course_slug
                            );
                        }

                        updatedInstructors.push(
                            await this.prisma.instructors.update({
                                where: { instructor_id: instructor.instructor_id },
                                data: {
                                    workspaces
                                },
                                select: {
                                    instructor_id: true,
                                    email: true
                                }
                            })
                        );
                    }
                }));
            }

            return {
                status: HttpStatus.OK,
                data: {
                    slug,
                    "updated_instructors": updatedInstructors
                },
                message: "Course deleted successfully"
            }
        } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * @description Toggle course status draft/published
     * @param slug
     * @param status
     */
    async change_course_status(slug: string, status: string) {
        try {
            const course = await this.prisma.courses.update({
                where: { slug },
                data: {
                    course_status: status
                },
                select: {
                    slug: true,
                    course_status: true
                }
            });

            return {
                status: HttpStatus.OK,
                data: course,
                message: course.course_status === "draft" ? "Course updated to draft mode" : course.course_status === "published" ? "Course updated to published" : "Course updated to in-review"
            }
        } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * @description assign an instructor to course
     * @param workspace_id 
     * @param slug 
     * @param instructor_data 
     * @returns 
     */
    async assign_instructor_course(subdomain: string, slug: string, instructor_data: AssignInstructorToCourseDto) {
        const workspace_id = await this.check_get_workspace_by_subdomain(subdomain);

        // check if instructor already assigned
        const checkAssignedInstructor = await this.prisma.courses.count({
            where: {
                slug,
                assigned_instructors: {
                    some: {
                        instructor_id: instructor_data.instructor_id
                    }
                }
            }
        })
        if (checkAssignedInstructor >= 1) {
            return {
                status: HttpStatus.CONFLICT,
                data: {},
                message: "Instructor already assigned to the course!"
            }
        }

        // update course "assigned_instructors"
        try {
            const { instructor_name, profession } = await this.prisma.instructors.findUnique({
                where: {
                    instructor_id: instructor_data.instructor_id
                },
                select: {
                    instructor_name: true,
                    profession: true
                }
            })

            await this.prisma.courses.update({
                where: { slug },
                data: {
                    assigned_instructors: {
                        push: { ...instructor_data, instructor_name, profession }
                    }
                }
            })

        } catch (error) {
            throw new HttpException('Something went wrong assigning the instructor', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        // update instructor "InstructorWorkspace => courses"
        const { workspaces } = await this.prisma.instructors.findUnique({
            where: {
                instructor_id: instructor_data.instructor_id,
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
        if (workspaces) {
            // Update courses in the target workspace
            const updatedWorkspaces = workspaces.map((workspace) =>
                workspace.workspace_id === workspace_id
                    ? { ...workspace, courses: [...workspace.courses, slug] }
                    : workspace
            );

            if (updatedWorkspaces) {

                await this.prisma.instructors.update({
                    where: {
                        instructor_id: instructor_data.instructor_id,
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
                    },

                });

            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    data: {},
                    message: "Workspace not found for the instructor!"
                }
            }
        } else {
            return {
                status: HttpStatus.NOT_FOUND,
                data: {},
                message: "Instructor not found"
            }
        }
        return {
            status: HttpStatus.OK,
            data: {},
            message: "Instructor assigned successfully"
        }
    }


    async unassign_instructor_course(subdomain: string, slug: string, instructor_id: string) {
        const workspace_id = await this.check_get_workspace_by_subdomain(subdomain);

        try {
            // Get the assigned instrcutors of course
            const { assigned_instructors } = await this.prisma.courses.findUnique({ where: { slug }, select: { assigned_instructors: true } });

            // Remove the instructor from the courses assigned instructors
            await this.prisma.courses.update({
                where: { slug, workspace_id },
                data: { assigned_instructors: { set: assigned_instructors.filter(instructor => instructor.instructor_id !== instructor_id) } },
            })
        } catch (error) {
            throw new HttpException('Something went wrong removing instructor from course', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        try {
            // Get the instructor object
            const { workspaces } = await this.prisma.instructors.findUnique({
                where: {
                    instructor_id,
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
            const updatedWorkspaces = workspaces.map((workspace) =>
                workspace.workspace_id === workspace_id
                    ? { ...workspace, courses: workspace.courses.filter((course) => course !== slug) }
                    : workspace
            );

            // remove course from workspaces -> courses
            await this.prisma.instructors.update({
                where: {
                    instructor_id,
                    workspaces: {
                        some: {
                            workspace_id
                        }
                    }
                },
                data: {
                    workspaces: updatedWorkspaces
                }
            })
        } catch (error) {
            throw new HttpException('Something went wrong removing course from instructor courses', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            status: HttpStatus.OK,
            data: {},
            message: "Instructor removed from course successfully"
        }
    }

    /////////////////////////
    // Course Modules Methods
    ////////////////////////
    async get_module_by_id(module_id: string): Promise<any> {
        const module = await this.prisma.modules.findUnique({
            where: { module_id },
        });

        if (!module) {
            throw new NotFoundException('Module not found');
        }

        return module;
    }
    async add_module_to_course(course_id: string, module_name: string, order: number) {
        const course = await this.prisma.courses.findUnique({
            where: { course_id },
        });

        if (!course) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Course not found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const module = await this.prisma.modules.create({
            data: {
                module_name,
                order,
                course: { connect: { course_id } },
            },
        });

        if (module) {
            // Increment total_modules_number by 1
            const updatedCourse = await this.prisma.courses.update({
                where: { course_id },
                data: { total_modules_number: course.total_modules_number + 1 },
            });

            if (!updatedCourse) {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Failed to update course total_modules_number',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                )
            }
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to add module to course',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            status: HttpStatus.OK,
            data: module,
            message: 'Module added successfully',
        }
    }

    async delete_module(course_id: string, module_id: string): Promise<any> {
        const module = await this.get_module_by_id(module_id);
        const course = await this.prisma.courses.findUnique({
            where: { course_id },
        })

        if (!module) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Module not found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        if (!course) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Course not found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        // Check if the module has associated lessons
        const lessonsCount = await this.prisma.lessons.count({
            where: { moduleId: module_id },
        });

        if (lessonsCount > 0) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Cannot delete module with associated lessons',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const deleteModule = await this.prisma.modules.delete({
            where: { module_id }
        });

        if (!deleteModule) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete module',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        // Decrement total_modules_number by 1
        const { modules } = await this.prisma.courses.update({
            where: { course_id: course.course_id },
            data: { total_modules_number: course.total_modules_number - 1 },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    select: {
                        module_id: true,
                        module_name: true,
                        order: true,
                    }
                }

            }
        })

        return {
            status: HttpStatus.OK,
            data: modules,
            message: 'Module deleted successfully',
        }
    }

    async update_module(module_id: string, module_name: string): Promise<any> {
        const module = await this.get_module_by_id(module_id);

        if (!module) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Module not found',
                },
                HttpStatus.NOT_FOUND,
            );
        }
        try {

            await this.prisma.modules.update({
                where: { module_id },
                data: { module_name },
            });

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update module',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        return {
            status: HttpStatus.OK,
            data: {},
            message: 'Module updated successfully',
        }
    }

    async reorder_modules(courseId: string, newModuleOrder: { module_id: string, module_name: string, order: number }[]): Promise<any> {
        // Fetch all modules for the given course ID
        const modules = await this.prisma.modules.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
        });

        if (modules.length !== newModuleOrder.length) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: "length of newModuleOrder and modules don't match",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        // Update module order based on the new order specified
        const updatedModules = await Promise.all(
            newModuleOrder.map(async (newOrder) => {
                const module = modules.find((m) => m.module_id === newOrder.module_id);
                if (!module || module.courseId !== courseId) {
                    throw new HttpException(
                        {
                            status: HttpStatus.BAD_REQUEST,
                            message: 'Invalid module order data',
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }

                await this.prisma.modules.update({
                    where: { module_id: module.module_id },
                    data: { order: newOrder.order },
                });

            }),
        );

        if (updatedModules.length !== modules.length) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to reorder modules',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            status: HttpStatus.OK,
            message: 'Modules reordered successfully',
        }
    }

    /////////////////////////
    // Modules Lessons Methods
    ////////////////////////
    async get_single_lesson(moduleId: string, lessonId: string) {
        const module = await this.prisma.modules.findUnique({
            where: { module_id: moduleId },
            include: { lessons: true },
        });
        if (!module) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Module not found',
            });
        }

        const lesson = module.lessons.find((l) => l.lesson_id === lessonId);
        if (!lesson) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Lesson not found',
            });
        }

        return {
            status: HttpStatus.OK,
            data: lesson,
            message: 'Lesson returned successfully',
        };
    }

    async add_lesson_to_module(
        createLessonDto: CreateLessonDto,
    ) {
        const { courseId, moduleId, ...rest } = createLessonDto;
        // Check if the module exists
        const module = await this.prisma.modules.findUnique({
            where: { module_id: moduleId },
            include: { course: true },
        });
        if (!module) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Module not found',
            });
        }

        // Check if the course ID matches the module's course ID
        if (module.courseId !== courseId) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Course ID does not match the module',
            }, HttpStatus.BAD_REQUEST);
        }

        // Create the Lesson first
        const lesson = await this.prisma.lessons.create({
            data: {
                ...rest,
                module: { connect: { module_id: moduleId } },
            },
        });

        if (!lesson) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create lesson',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            status: HttpStatus.OK,
            data: lesson,
            message: 'Lesson created successfully',
        }
    }

    async delete_lesson_from_module(courseId: string, moduleId: string, lessonId: string) {
        // Check if the module exists
        const module = await this.prisma.modules.findUnique({
            where: { module_id: moduleId },
            include: {
                course: true,
                lessons: {
                    select: {
                        lesson_id: true,
                        lesson_type: true,
                        file_url: true,
                        order: true
                    }
                }
            },
        });
        if (!module) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Module not found',
            });
        }

        // Check if the course ID matches the module's course ID
        if (module.courseId !== courseId) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Course ID does not match the module',
            }, HttpStatus.BAD_REQUEST);
        }

        // Find the lesson in the module's lessons
        const lessonToDelete = module.lessons.find((lesson) => lesson.lesson_id === lessonId);
        if (!lessonToDelete) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Lesson not found in the module',
            });
        }

        if (lessonToDelete.file_url && lessonToDelete.file_url !== '') {
            // Delete the file if it exists
            if (lessonToDelete.lesson_type !== "Video") {
                await this.cloudStorageService.removeFile(lessonToDelete.file_url);
            } else {
                await this.bunnyCDNStorageService.removeVideo(lessonToDelete.file_url);
            }
        }

        try {
            // Delete the lesson
            await this.prisma.lessons.delete({
                where: { lesson_id: lessonId },
            });
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete lesson',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        const filterLessonsData = []
        // push only lesson_id and order in filterLessonsData list 
        module.lessons.filter((lesson) => lesson.lesson_id !== lessonId).map((lesson) => {
            filterLessonsData.push({ lesson_id: lesson.lesson_id, order: lesson.order })
        });

        return {
            status: HttpStatus.OK,
            data: filterLessonsData,
            message: 'Lesson deleted successfully',
        };
    }

    async update_lesson(lessonId: string, updateLessonDto: Partial<CreateLessonDto>): Promise<any> {

        // Check if the module exists
        const module = await this.prisma.modules.findUnique({
            where: { module_id: updateLessonDto.moduleId },
            include: { course: true, lessons: true },
        });

        if (!module) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Module not found',
            });
        }

        // Check if the course ID matches the module's course ID
        if (module.courseId !== updateLessonDto.courseId) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Course ID does not match the module',
            }, HttpStatus.BAD_REQUEST);
        }

        // Find the lesson in the module's lessons
        const lessonToUpdate = module.lessons.find((lesson) => lesson.lesson_id === lessonId);
        if (!lessonToUpdate) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Lesson not found in the module',
            });
        }

        // Delete the file if it exists
        if (updateLessonDto.file_url) {
            if (updateLessonDto.file_url !== lessonToUpdate.file_url) {
                if (lessonToUpdate.file_url && lessonToUpdate.file_url !== '') {
                    if (updateLessonDto.lesson_type !== "Video") {
                        await this.cloudStorageService.removeFile(lessonToUpdate.file_url);
                    } else {
                        await this.bunnyCDNStorageService.removeVideo(lessonToUpdate.file_url);
                    }
                }
            }
        }

        try {
            const { moduleId, courseId, ...rest } = updateLessonDto;
            // Update the lesson
            const updatedLesson = await this.prisma.lessons.update({
                where: { lesson_id: lessonId },
                data: rest,
            });

            return {
                status: HttpStatus.OK,
                data: updatedLesson,
                message: 'Lesson updated successfully',
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update lesson',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

    }

    async reorder_lessons(moduleId: string, newLessonOrder: ReorderLessonsDto[]) {
        const module = await this.prisma.modules.findUnique({
            where: { module_id: moduleId },
            include: { lessons: true },
        });
        if (!module) {
            throw new NotFoundException('Module not found');
        }

        try {
            // Update lesson order in the module
            await Promise.all(
                newLessonOrder.map(async (lessonData) => {
                    const lesson = module.lessons.find((l) => l.lesson_id === lessonData.lesson_id);
                    if (!lesson) {
                        throw new NotFoundException({
                            status: HttpStatus.NOT_FOUND,
                            message: 'Lesson not found in the module',
                        });
                    }
                    await this.prisma.lessons.update({
                        where: { lesson_id: lessonData.lesson_id },
                        data: { order: lessonData.order },
                    });
                }),
            );
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to reorder lessons',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        return {
            status: HttpStatus.OK,
            message: 'Lessons reordered successfully'
        };
    }

    async add_project_lesson_to_module(
        createProjectlessonDto: createProjectlessonDto,
    ) {
        const { courseId, moduleId, ...rest } = createProjectlessonDto;
        const { order, isFree, xpPoints, ...restProject } = rest

        // Check if the module exists
        const module = await this.prisma.modules.findUnique({
            where: { module_id: moduleId },
            include: { course: true },
        });
        if (!module) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'Module not found',
            });
        }

        // Check if the course ID matches the module's course ID
        if (module.courseId !== courseId) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Course ID does not match the module',
            }, HttpStatus.BAD_REQUEST);
        }

        // Create the Lesson first
        const lesson = await this.prisma.lessons.create({
            data: {
                lesson_name: restProject.project_name,
                lesson_type: "Project",
                order,
                isFree,
                xpPoints,
                module: { connect: { module_id: moduleId } },
            },
        });

        if (!lesson) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create lesson',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const project = await this.prisma.projects.create({
            data: {
                ...restProject,
                lesson: { connect: { lesson_id: lesson.lesson_id } },
            },
        })

        if (!project) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create project',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            status: HttpStatus.OK,
            data: project,
            message: 'Project created successfully',
        }
    }


    /////////////////////////
    // Upload files Methods
    ////////////////////////
    async upload_course_thumbnail(file: File, filename: string, filetype: string, subdomain: string): Promise<any> {
        if (file) {
            const uploadedFile = await this.cloudStorageService.uploadFile(file, `${subdomain}/courses/${filename}`, filename, filetype);

            return {
                status: HttpStatus.OK,
                data: uploadedFile,
                message: 'File uploaded successfully',
            }
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to upload file',
                },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    async upload_lesson_files(file: File, course_slug: string, workspace_id: string): Promise<any> {
        if (file) {
            const uploadedFile = await this.cloudStorageService.uploadFile(file, `${workspace_id}/courses/${course_slug}`);

            return {
                status: HttpStatus.OK,
                data: uploadedFile,
                message: 'File uploaded successfully',
            }
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to upload file',
                },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    async upload_to_bunnyStorage(file: Buffer, path: string): Promise<any> {
        const BUNNY_STORAGE_API_HOST = "storage.bunnycdn.com";
        const BUNNYCDN_STORAGE_ZONE = this.configService.get('BUNNYCDN_STORAGE_ZONE');
        const BUNNYCDN_API_KEY = this.configService.get('BUNNYCDN_API_KEY');

        const uploadFileUrl = new URL(
            `/${BUNNYCDN_STORAGE_ZONE}/${path}`,
            `https://${BUNNY_STORAGE_API_HOST}`,
        );

        const res = await fetch(uploadFileUrl, {
            method: "PUT",
            headers: {
                AccessKey: BUNNYCDN_API_KEY as string,
                "Content-Type": "application/octet-stream", // Set the correct content type for the video
            },
            body: file,
        });

        const response = await res.json();

        return { ...response, path };

    }

    async upload_to_bunnyStream(file: Buffer, path: string): Promise<any> {

        const res = await this.bunnyCDNStorageService.uploadVideo(file, path);

        return res;
    }

    /////////////////////////
    // Course Utils Methods
    ////////////////////////
    async updateCourseWorkspaceSalesKpis(course_slug: string, workspace_id: string) {
        const {course_access, total_sales, last_month_sales, current_month_sales, price} = await this.prisma.courses.findUnique({
            where: {
                slug: course_slug,
                workspace_id
            },
            select: {
                course_access: true,
                total_sales: true,
                last_month_sales: true,
                current_month_sales: true,
                price: true
            }
        })

        const workspace = await this.prisma.workspaces.findUnique({
            where: {
                workspace_id
            },
            select: {
                total_sales: true,
                current_month_sales: true
            }
        })

        if(course_access === "Paid") {
            try {
                const course = await this.prisma.courses.update({
                    where: {
                        slug: course_slug,
                        workspace_id
                    },
                    data: {
                        total_sales: total_sales + price,
                        current_month_sales: current_month_sales + price
                    }
                })

                if (course) {
                    await this.prisma.workspaces.update({
                        where: {
                            workspace_id
                        },
                        data: {
                            total_sales: workspace.total_sales + price,
                            current_month_sales: workspace.current_month_sales + price
                        }
                    })
                }

                return {
                    status: HttpStatus.OK,
                    message: 'Course sales KPIs updated successfully',
                    data: {
                        total_sales: total_sales + price,
                        current_month_sales: current_month_sales + price
                    }
                }
            } catch (error) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update course sales KPIs',
                    data: {}
                }
            }
        }

        return {
            status: HttpStatus.OK,
            message: 'Free courses have no sales KPIs',
            data: {}
        }
    }
}
