import { ApiProperty } from "@nestjs/swagger";
import { CurriculumType } from "@prisma/client";

export class UpdateCourseDto {
    @ApiProperty()
    course_name: string

    @ApiProperty()
    course_description: string

    @ApiProperty()
    course_level: string

    @ApiProperty()
    course_type: string

    @ApiProperty()
    course_duration: number

    @ApiProperty()
    course_access: string

    @ApiProperty()
    price: number

    @ApiProperty()
    slug: string

    @ApiProperty()
    promotional_image: string

    curriculum_type?: CurriculumType
}