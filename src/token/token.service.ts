import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async generateJwtToken(user: { name: string; email: string; userId: number }): Promise<string> {
        const payload = { user };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('secret_jwt'),
            expiresIn: this.configService.get('expire_jwt'),
        });
    }

    async generateResetToken(email: string): Promise<string> {
        const payload = { email };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('secret_jwt'),
            expiresIn: '1h',
        });
    }

    async verifyResetToken(token: string): Promise<{ email: string }> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('secret_jwt'),
            });
        } catch (error) {
            throw new BadRequestException('Invalid or expired reset token');
        }
    }
}