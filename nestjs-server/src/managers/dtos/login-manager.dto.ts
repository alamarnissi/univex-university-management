import { ApiProperty } from "@nestjs/swagger";

export class LoginManagerDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string
}