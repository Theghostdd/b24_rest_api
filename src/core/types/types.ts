export enum AppObjectResultEnum {
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  RESULT = 'RESULT',
}

export type APIErrorMessageType = {
  error: string;
  message: string;
};

export type AppResultType<T = null, D = null> = {
  appResult: AppObjectResultEnum;
  data: T;
  error: D;
};

export interface In2Words {
  (number: number, options: { lang: string }): string;
}
