import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthUserResponse {
    @ApiProperty({
        description: "User's first name",
        example: "John"
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: "User's username",
        example: "john123"
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: "User's email address",
        example: "john@example.com"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "Hashed user password",
        example: "$2b$10$X3OLB.YwgQJjj7rvP7P8GOaqjY9rBsGlUz2GOo8z5/uIjP6RV8c.u",
        writeOnly: true
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: "JWT token for authorization",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    })
    @IsString()
    token: string;
}