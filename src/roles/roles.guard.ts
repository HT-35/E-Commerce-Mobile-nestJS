import { Roles_Key } from "@/public/DecoratorCustom";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const RolesArr = this.reflector.get<string[]>(
      Roles_Key,
      context.getHandler(),
    );
    if (!RolesArr) {
      return true; // Không yêu cầu quyền cụ thể
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      user &&
      user.role &&
      RolesArr.some((item) => user.role.includes(item))
    ) {
      return true;
    } else {
      throw new UnauthorizedException("Bạn không có quyền truy cập !!");
    }
  }
}
