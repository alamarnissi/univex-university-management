import { ApiProperty } from "@nestjs/swagger"


export class CreateCourseModuleDto {
    @ApiProperty()
    course_id: string

    @ApiProperty()
    module_name: string

    @ApiProperty()
    order: number
}