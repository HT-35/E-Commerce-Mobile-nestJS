import { Is_Public_Key } from "@/public/DecoratorCustom";
import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(Is_Public_Key, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const req = context.switchToHttp().getRequest();
    const [, token] = req.headers.authorization?.split(" ") ?? [];

    if (!token) {
      throw new BadRequestException("Vui Lòng Đăng Nhập !!");
    } else if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          "Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
        )
      );
    }
    return user;
  }
}
