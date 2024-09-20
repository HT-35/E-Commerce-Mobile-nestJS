import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";

import { UserService } from "@/modules/user/user.service";
import { LoginAuthDto } from "@/auth/dto/LoginAuth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ActiveAccount } from "@/auth/dto/activeAccount.dto";
import { NewPasswordDto } from "@/auth/dto/NewPasswordDto.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findOneByEmail(loginAuthDto.email);
    if (!user) {
      throw new UnauthorizedException("not found user !!");
    }
    return user;
  }

  registerUser(createAuthDto: CreateAuthDto) {
    return this.userService.registerUser(createAuthDto);
  }

  async login(user: any) {
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };

    const access_token = this.jwtService.sign(payload);

    const refesh_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get("JWT_Refesh_Token_EXPIRATION_TIME"),
    });

    return {
      access_token,
      refesh_token,
      user: {
        name: user.name,
        _id: user._id,
        roles: user.roles,
      },
    };
  }

  async activeAccount(data: ActiveAccount) {
    return this.userService.activeAccount(data);
  }

  async ReSendCodeId(email: string) {
    return this.userService.ReSendCodeId(email);
  }

  async resetPassword(email: string) {
    return await this.userService.resetPassword(email);
  }

  async NewPassword(data: NewPasswordDto) {
    return await this.userService.NewPassword(data);
  }
}
