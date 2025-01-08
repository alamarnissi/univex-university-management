import { ApiProperty } from "@nestjs/swagger"

export class CreateWorkspaceDto {
    @ApiProperty()
    name: string
}