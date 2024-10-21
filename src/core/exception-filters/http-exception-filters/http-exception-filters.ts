import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { APIErrorMessageType } from '../../types/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseMessage = {
      status: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };

    if (status === HttpStatus.UNAUTHORIZED) {
      return response.status(401).json(responseMessage);
    }

    if (status === HttpStatus.FORBIDDEN) {
      return response.status(403).json(responseMessage);
    }

    if (status === HttpStatus.BAD_REQUEST) {
      const errors: APIErrorMessageType[] = [];
      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((e: APIErrorMessageType) => {
          errors.push(e);
        });
      } else {
        errors.push(responseBody);
      }
      return response.status(status).json(errors);
    }

    response.status(status).json({
      status: status,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
