import { ApiProperty } from "@nestjs/swagger";
import { CourseCurrency } from "@prisma/client";

export class CreateCourseDto {
    
    @ApiProperty()
    course_name: string

    @ApiProperty()
    course_type: string

    @ApiProperty()
    course_description: string
    
    @ApiProperty()
    course_level: string

    @ApiProperty()
    course_access: string

    @ApiProperty()
    course_duration: number

    @ApiProperty()
    price: number

    @ApiProperty()
    preferred_currency: CourseCurrency

    @ApiProperty()
    promotional_image: string

    @ApiProperty()
    promotional_video: string
}