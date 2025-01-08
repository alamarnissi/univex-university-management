import { ApiProperty } from "@nestjs/swagger";


export class AssignNewStudentDto {
    @ApiProperty()
    student_name: string

    @ApiProperty()
    email: string

}