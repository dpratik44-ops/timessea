import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(details: any) {
    // Check if user exists by Google ID
    const userByGoogleId = await this.usersService.findOne({
      googleId: details.googleId,
    });
    if (userByGoogleId) return userByGoogleId;

    // Check if user exists by email
    const userByEmail = await this.usersService.findOne({
      email: details.email,
    });
    if (userByEmail) {
      // Connect googleId to existing user if not present
      // For now just return the user, assuming implied linking
      // Ideally we would update the user to add googleId here
      // But define update in UsersService first?
      // Let's just return the user for now to avoid complexity without update method
      return userByEmail;
    }

    // Create new user
    return this.usersService.create({
      email: details.email,
      name: `${details.firstName} ${details.lastName}`,
      picture: details.picture,
      googleId: details.googleId,
      provider: 'google',
    });
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
