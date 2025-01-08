import { HttpException, HttpStatus } from "@nestjs/common";

export const checkExpiredToken = (token: any) => {
    if (token.expires < Date.now()) {
        throw new HttpException(
            `Token expired!`,
            HttpStatus.FORBIDDEN,
        );
    }
}