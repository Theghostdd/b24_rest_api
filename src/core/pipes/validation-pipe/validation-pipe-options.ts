import {
  BadRequestException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { APIErrorMessageType } from '../../types/types';

export class ValidationPipeOption implements ValidationPipeOptions {
  transform = true;
  stopAtFirstError = true;
  validateCustomDecorators = true;
  exceptionFactory: (errors: ValidationError[]) => any;

  constructor() {
    this.exceptionFactory = (errors: ValidationError[]) => {
      const apiError = this.processValidationErrors(errors);
      throw new BadRequestException(apiError);
    };
  }

  processValidationErrors(
    errors: ValidationError[],
    parentProperty: string = '',
  ): APIErrorMessageType[] {
    const apiError: APIErrorMessageType[] = [];

    errors.forEach((error: ValidationError) => {
      const field = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      if (error.constraints) {
        const key = Object.keys(error.constraints)[0];
        apiError.push({
          error: field,
          message: error.constraints[key],
        });
      }

      if (error.children && error.children.length > 0) {
        apiError.push(...this.processValidationErrors(error.children, field));
      }
    });

    return apiError;
  }
}
