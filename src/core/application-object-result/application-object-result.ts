import { Injectable } from '@nestjs/common';
import { AppObjectResultEnum, AppResultType } from '../types/types';

@Injectable()
export class AppResult {
  constructor() {}

  success<T>(data: T): AppResultType<T> {
    return {
      appResult: AppObjectResultEnum.SUCCESS,
      data: data,
      error: null,
    };
  }

  badRequest<T>(data: T): AppResultType<null, T> {
    return {
      appResult: AppObjectResultEnum.BAD_REQUEST,
      data: null,
      error: data,
    };
  }

  notFound(): AppResultType {
    return {
      appResult: AppObjectResultEnum.NOT_FOUND,
      data: null,
      error: null,
    };
  }

  return<T>(data: T): AppResultType<T> {
    return {
      appResult: AppObjectResultEnum.RESULT,
      data: data,
      error: null,
    };
  }
}
