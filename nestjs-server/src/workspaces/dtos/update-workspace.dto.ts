import { ApiProperty } from "@nestjs/swagger";

export class UpdateWorkspaceDto {
    @ApiProperty()
    name: string
}