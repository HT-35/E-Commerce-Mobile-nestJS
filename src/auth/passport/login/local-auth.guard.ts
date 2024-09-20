import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const req = context.switchToHttp().getRequest();

    const { email, password } = req.body;

    if (!email) {
      throw new BadRequestException("missing email !");
    } else if (!password) {
      throw new BadRequestException("missing password !");
    } else if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
