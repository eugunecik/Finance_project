import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto";
import { UserLoginDto } from "./dto";
import { AuthUserResponse } from "./response";
import { JwtAuthGuard } from "src/guards/jwt-guard";

@ApiTags("API")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "User registered successfully", type: CreateUserDto })
  @ApiResponse({ status: 400, description: "Bad Request - Invalid data" })
  register(@Body() dto: CreateUserDto): Promise<CreateUserDto> {
    return this.authService.registerUsers(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Log in a user" })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: "User logged in successfully", type: AuthUserResponse })
  @ApiResponse({ status: 401, description: "Unauthorized - Invalid credentials" })
  login(@Body() dto: UserLoginDto): Promise<AuthUserResponse> {
    return this.authService.loginUsers(dto);
  }

  @Post("password-reset-request")
  @ApiOperation({ summary: "Request a password reset code" })
  @ApiBody({ schema: { type: "object", properties: { email: { type: "string", example: "user@example.com" } } } })
  @ApiResponse({ status: 200, description: "Password reset code sent" })
  @ApiResponse({ status: 400, description: "Bad Request - Invalid email" })
  requestPasswordReset(@Body("email") email: string): Promise<void> {
    return this.authService.requestPasswordReset(email);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset user password" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string", example: "user@example.com" },
        resetCode: { type: "string", example: "123456" },
        newPassword: { type: "string", example: "NewPassword123" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Password reset successful" })
  @ApiResponse({ status: 400, description: "Bad Request - Invalid reset code or data" })
  resetPassword(
    @Body("email") email: string,
    @Body("resetCode") resetCode: string,
    @Body("newPassword") newPassword: string,
  ): Promise<void> {
    return this.authService.resetPassword(email, resetCode, newPassword);
  }
}