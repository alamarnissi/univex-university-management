import { ApiProperty } from "@nestjs/swagger";

export class CreateInstructorDto {
  @ApiProperty()
  instructor_name: string;
  
  @ApiProperty()
  email: string;
}