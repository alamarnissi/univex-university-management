import { ApiProperty } from "@nestjs/swagger";

export class DetailsManagerDto {
    @ApiProperty()
    first_name: string

    @ApiProperty()
    last_name: string

    @ApiProperty()
    email: string

    @ApiProperty()
    phone_number: string

    @ApiProperty()
    institution_type: string

    @ApiProperty()
    learning_business_name: string

    email_verified?: boolean

    manager_id?: string

    workspace_id?: string
}