import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { AssignInstructorToCourseDto } from './dtos/assign-instructor.dto';
import { AssignNewStudentDto } from './dtos/assign-student.dto';
import { CoursesStudentsService } from './courseStudents.service';
import { CreateCourseModuleDto } from './dtos/course-modules.dto';
import { File } from 'src/utils/interfaces/file.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateLessonDto, createProjectlessonDto } from './dtos/create-lesson.dto';
import { ReorderLessonsDto } from './dtos/reorder-lesson.dto';
import { parse } from 'path';
import slugify from 'slugify';

@ApiTags("Courses")
@Controller('courses')
export class CoursesController {
    constructor(
        private coursesService: CoursesService,
        private coursesStudentService: CoursesStudentsService,
    ) { }

    @UseGuards(AuthGuard)
    @ApiBody({
        type: CreateCourseDto
    })
    @Post("create")
    async createCourse(@Body() course_data: CreateCourseDto, @Req() request) {
        const current_user = request.user

        const subdomain = current_user.workspace_id;

        return await this.coursesService.create_course(subdomain, course_data)
    }

    @UseGuards(AuthGuard)
    @ApiBody({
        type: UpdateCourseDto
    })
    @Put('update/:course_id')
    async courseUpdate(@Param('course_id') course_id: string, @Body() course_data: UpdateCourseDto) {
        return await this.coursesService.update_course(course_id, course_data);
    }

    @UseGuards(AuthGuard)
    @Patch("partial-update/:course_id")
    async partialCourseUpdate(@Param('course_id') course_id: string, @Body() course_data: Partial<UpdateCourseDto>) {
        return await this.coursesService.update_course(course_id, course_data);
    }

    @UseGuards(AuthGuard)
    @Patch('delete/:slug')
    async courseSoftDelete(@Req() request, @Param('slug') slug: string) {
        const current_user = request.user

        const subdomain = current_user.workspace_id;

        return await this.coursesService.soft_delete_course(subdomain, slug)
    }

    @UseGuards(AuthGuard)
    @Patch("assign-instructor/:slug")
    async assignInstructor(@Req() request, @Param("slug") slug: string, @Body() instructor_data: AssignInstructorToCourseDto) {
        const current_user = request.user

        const subdomain = current_user.workspace_id;

        return await this.coursesService.assign_instructor_course(subdomain, slug, instructor_data)
    }

    @UseGuards(AuthGuard)
    @Patch("delete-instructor/:slug")
    async unassignInstructor(@Req() request, @Param("slug") slug: string, @Body("instructor_id") instructor_id: string) {
        const current_user = request.user

        const subdomain = current_user.workspace_id;
        return await this.coursesService.unassign_instructor_course(subdomain, slug, instructor_id)
    }

    @UseGuards(AuthGuard)
    @Patch("assign-student/:slug")
    assignStudent(@Req() request, @Param("slug") slug: string, @Body() student_data: AssignNewStudentDto) {
        const current_user = request.user

        const subdomain = current_user.workspace_id;

        return this.coursesStudentService.assign_student(subdomain, slug, student_data)
    }

    @UseGuards(AuthGuard)
    @Patch("delete-student/:slug")
    async unassignStudent(@Req() request, @Param("slug") slug: string, @Body("email") student_email: string) {
        const current_user = request.user

        const subdomain = current_user.workspace_id;

        return await this.coursesStudentService.unassign_student(subdomain, slug, student_email)
    }

    @UseGuards(AuthGuard)
    @Patch('change-status/:slug')
    async changeStatus(@Param('slug') slug: string, @Body("course_status") course_status: string) {
        return await this.coursesService.change_course_status(slug, course_status)
    }

    @UseGuards(AuthGuard)
    @Get('get/:slug')
    async getSingleCourse(@Req() request, @Param('slug') slug: string) {
        const current_user = request.user;

        if (current_user) {
            return await this.coursesService.get_course_by_slug(slug)
        } else {
            throw new UnauthorizedException();
        }
    }

    @UseGuards(AuthGuard)
    @ApiQuery({ name: "status", required: false, description: "Filter courses by status (draft / published)" })
    @ApiQuery({ name: "course_name", required: false, description: "Search By course name" })
    @ApiQuery({ name: "sort_course", required: false, description: "Filter courses", example: ["most-recent", "least-recent", "most-rated", "least-rated"], })
    @ApiQuery({ name: "level", required: false, description: "Filter courses by level type", example: ["beginner", "medium", "advanced"], })
    @ApiQuery({ name: "access", required: false, description: "Filter courses by access type", example: ["paid", "free"], })
    @Get('list')
    async coursesList(
        @Req() req,
        @Query("status") status?: string,
        @Query("course_name") course_name?: string,
        @Query("sort_course") sort_course?: string,
        @Query("level") level?: string,
        @Query("access") access?: string,
    ) {
        const current_user = req.user;

        const subdomain = current_user.workspace_id;
        const user_id = current_user.user_id;
        const role = current_user.role;

        return await this.coursesService.get_courses_workspaces(
            subdomain,
            role,
            user_id,
            status,
            sort_course,
            course_name,
            level,
            access
        );
    }


    /////////////////////////
    // Course Modules Endpoints
    ////////////////////////
    @UseGuards(AuthGuard)
    @Post('modules/create')
    async createModule(@Body() ModuleData: CreateCourseModuleDto) {
        const { course_id, module_name, order } = ModuleData;
        return this.coursesService.add_module_to_course(course_id, module_name, order);
    }

    @UseGuards(AuthGuard)
    @Delete('modules/delete/:module_id')
    async deleteModule(@Body("course_id") course_id: string, @Param("module_id") module_id: string) {

        return this.coursesService.delete_module(course_id, module_id);
    }

    @UseGuards(AuthGuard)
    @Put('modules/update/:module_id')
    async updateModule(@Param("module_id") module_id: string, @Body("module_name") module_name: string) {

        return this.coursesService.update_module(module_id, module_name);
    }

    @UseGuards(AuthGuard)
    @Put(':courseId/modules/reorder')
    async reorderModules(@Param('courseId') courseId: string, @Body() newModuleOrder: { module_id: string, module_name: string, order: number }[]) {
        return await this.coursesService.reorder_modules(courseId, newModuleOrder);
    }


    /////////////////////////
    // Lessons Endpoints
    ////////////////////////
    @UseGuards(AuthGuard)
    @Get('module-lessons/:module_id/get/:lesson_id')
    async getSingleLesson(@Param("lesson_id") lesson_id: string, @Param("module_id") module_id: string) {

        return this.coursesService.get_single_lesson(module_id, lesson_id);
    }

    @UseGuards(AuthGuard)
    @Post('module-lessons/create')
    async createLesson(@Body() LessonData: CreateLessonDto) {

        return this.coursesService.add_lesson_to_module(LessonData);
    }

    @UseGuards(AuthGuard)
    @Post('module-lessons/project/create')
    async createProjectLesson(@Body() LessonData: createProjectlessonDto) {

        return this.coursesService.add_project_lesson_to_module(LessonData);
    }

    @UseGuards(AuthGuard)
    @Delete('modules-lessons/delete/:lesson_id')
    async deleteLesson(@Body("courseId") course_id: string, @Body("moduleId") module_id: string, @Param("lesson_id") lesson_id: string) {

        return this.coursesService.delete_lesson_from_module(course_id, module_id, lesson_id);
    }

    @UseGuards(AuthGuard)
    @Put('module-lessons/update/:lesson_id')
    async updateLesson(@Param("lesson_id") lesson_id: string, @Body() lessonData: Partial<CreateLessonDto>) {

        return this.coursesService.update_lesson(lesson_id, lessonData);
    }

    @UseGuards(AuthGuard)
    @Put('module-lessons/:moduleId/reorder')
    async reorderLessons(@Param('moduleId') moduleId: string, @Body() newLessonOrder: ReorderLessonsDto[]) {
        return await this.coursesService.reorder_lessons(moduleId, newLessonOrder);
    }

    /////////////////////////
    // Upload File Endpoints
    ////////////////////////
    
    @UseGuards(AuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 2097152 }, // 2MB --- 2*2^20
            fileFilter: (req, file, callback) => {
                return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
                    ? callback(null, true)
                    : callback(new BadRequestException('Only image files are allowed'), false);
            }
        })
    )
    @Post("upload")
    async uploadFile(@Req() req, @UploadedFile() file: File, @Body("course_slug") courseSlug: string, @Body("filetype") filetype: string) {
        const current_user = req.user;
        const subdomain = current_user.workspace_id;

        return await this.coursesService.upload_course_thumbnail(file, courseSlug, filetype, subdomain);
    }


    @UseGuards(AuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        })
    )
    @Post("module-lessons/upload")
    async uploadLessonFile(@Req() req, @UploadedFile() file: File, @Body("course_slug") courseSlug: string, @Body("workspace_id") workspace_id: string) {

        return await this.coursesService.upload_lesson_files(file, courseSlug, workspace_id);
    }

    @UseGuards(AuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        })
    )
    @Post("module-lessons/bunny-upload")
    async uploadVideoLessonToBunny(@Req() req, @UploadedFile() file: File, @Body("lesson_name") lesson_name: string) {
        const Buffer = file.buffer;
        const fileName = parse(file.originalname);

        const path = `${slugify(lesson_name, { lower: true })}-${Date.now()}${fileName.ext}`;
        
        return await this.coursesService.upload_to_bunnyStream(Buffer, path);
    }
    
}
