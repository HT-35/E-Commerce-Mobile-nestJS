import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { UserModule } from "@/modules/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "@/auth/passport/login/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "@/auth/passport/verify token/jwt.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("JWT_SECRET_KEY"),
          signOptions: {
            expiresIn: config.get<string | number>(
              "JWT_Access_Token_EXPIRATION_TIME",
            ),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, ConfigService, JwtStrategy],
})
export class AuthModule {}
