import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ email, password });

    if (!user) {
      throw new UnauthorizedException("Không tìm thấy tài khoản !");
    }
    if (user.isActive === false) {
      throw new UnauthorizedException({
        message: {
          _idUser: user._id,
          error: "Tài Khoản Chưa Được Active  !!",
        },
        //id: user._id,
      });
    }
    return user;
  }
}
