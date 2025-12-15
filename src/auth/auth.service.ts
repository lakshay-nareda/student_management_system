import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // Login Logic
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    // Security Tip: User enumeration attack se bachne ke liye generic error message use karein
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Note: Make sure aapke database entity mein field ka naam 'password_hash' hi ho
    const isMatch = await bcrypt.compare(pass, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 'sub' (Subject) standard claim hai user ID ke liye
    const payload = { sub: user.user_id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  signOut() {
    return { message: 'Sign out successful' };
  }
}
