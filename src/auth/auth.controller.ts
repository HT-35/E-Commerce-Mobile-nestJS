import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";

import { LocalAuthGuard } from "@/auth/passport/login/local-auth.guard";
import { IsPublic, ResponseMessage } from "@/public/DecoratorCustom";
import { ActiveAccount } from "@/auth/dto/activeAccount.dto";
import { NewPasswordDto } from "@/auth/dto/NewPasswordDto.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Khi Register thì CodeId sẽ gửi về email
  @Post("register")
  @IsPublic()
  @ResponseMessage("User Register !")
  registerUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.registerUser(createAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ResponseMessage("User Login !")
  @IsPublic()
  login(@Request() req: any) {
    const user = req.user;

    return this.authService.login(user);
  }

  // Active Account
  @Post("active")
  @IsPublic()
  @ResponseMessage("User Acctive Account !!")
  async activeAccount(@Body() data: ActiveAccount) {
    return this.authService.activeAccount(data);
  }

  // ================= re-send Otp =======================
  @Get("re-send-codeid")
  @IsPublic()
  @ResponseMessage("Re-Send OTP")
  ReSendCodeId(@Query("email") email: string) {
    return this.authService.ReSendCodeId(email);
  }

  // ===== get new Password =================================================================================
  @Post("reset-password")
  @IsPublic()
  @ResponseMessage("Reset Password")
  async forgotPassword(@Body("email") email: string) {
    return await this.authService.resetPassword(email);
  }

  @Post("new-password")
  @IsPublic()
  @ResponseMessage("Get New Password")
  async NewPassword(@Body() data: NewPasswordDto) {
    return await this.authService.NewPassword(data);
  }

  // ============================================================================================================
  @ResponseMessage("Get Profile")
  @Get("me")
  getProfile(@Request() req: any) {
    return req.user;
  }
}
