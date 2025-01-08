import { ApiProperty } from "@nestjs/swagger";

export enum InstructorRole {
    Presenter = "Presenter",
    Editor = "Editor"
}

export class AssignInstructorToCourseDto {
    @ApiProperty()
    instructor_id: string

    @ApiProperty()
    role: InstructorRole
}