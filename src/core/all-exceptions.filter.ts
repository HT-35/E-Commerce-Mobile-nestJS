import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private reflector: Reflector) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    //const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorAll: any =
      exception instanceof HttpException && exception.getResponse();

    const error = errorAll.response ?? 'Internal server error';

    response.status(status).json({
      statusCode: status,
      error: error,
    });
  }
}
