import { ApiProperty } from "@nestjs/swagger";

enum InstitutionType {
  Training_center = "Training_center",
  Corporate = "Corporate",
  Educational_institution = "Educational_institution",
  Solo_Educator = "Solo_educator"
}

export class CreateManagerDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  password: string;
  
  @ApiProperty()
  phone_number: string;
  
  @ApiProperty()
  institution_type: InstitutionType;
  
  @ApiProperty()
  learning_business_name: string
}