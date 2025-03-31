import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface ResetCodeEntry {
  code: string;
  expiresAt: number;
}

interface UserPayload {
  name: string;
  email: string;
  userId: number;
}

@Injectable()
export class TokenService {
  private readonly resetCodes: Map<string, ResetCodeEntry> = new Map();
  private readonly ONE_HOUR_MS = 3600000;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwtToken(user: UserPayload): Promise<string> {
    const payload = { user };
    
    return this.jwtService.sign(payload, {
      secret: this.configService.get('secret_jwt'),
      expiresIn: this.configService.get('expire_jwt'),
    });
  }

  async generateResetToken(email: string, resetCode: string): Promise<string> {
    const expiresAt = Date.now() + this.ONE_HOUR_MS;
    this.resetCodes.set(email, { code: resetCode, expiresAt });

    return this.jwtService.sign(
      { email, resetCode },
      {
        secret: this.configService.get('secret_jwt'),
        expiresIn: '1h',
      },
    );
  }

  async verifyResetToken(email: string, resetCode: string): Promise<boolean> {
    const storedResetCode = this.resetCodes.get(email);

    if (!storedResetCode) {
      return false;
    }
    
    if (Date.now() > storedResetCode.expiresAt) {
      this.resetCodes.delete(email);
      return false;
    }

    const isValid = storedResetCode.code === resetCode;
    
    if (isValid) {
      this.resetCodes.delete(email);
    }

    return isValid;
  }
}