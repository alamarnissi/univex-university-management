import { ApiProperty } from "@nestjs/swagger";

export class UpdateInstructorDto {
  @ApiProperty()
  instructor_name: string;

  @ApiProperty()
  profession: string;
  
  @ApiProperty()
  email: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  linkedin_profile: string;
  
}