import { Response_Key } from '@/public/DecoratorCustom';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

// tạo interface cho dữ liệu trả về
export interface Response<T> {
  statusCode: any;
  message?: any;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const message = this.reflector.getAllAndOverride<boolean>(Response_Key, [
      context.getHandler(),
      context.getClass(),
    ]);

    const handleInterceptor = next.handle().pipe(
      map((data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: message || '',
          data,
        };
      }),
    );
    return handleInterceptor;
  }
}
