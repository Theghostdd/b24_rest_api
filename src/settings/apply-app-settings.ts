import { INestApplication, ValidationPipe } from '@nestjs/common';
import { apiPrefixSettings } from './app-prefix-settings';
import { ValidationPipeOption } from '../core/pipes/validation-pipe/validation-pipe-options';
import { HttpExceptionFilter } from '../core/exception-filters/http-exception-filters/http-exception-filters';

export const applyAppSettings = (app: INestApplication) => {
  //setApiPrefix(app);

  setPipes(app);

  setExceptionFilter(app);

  enableCors(app);
};

const setApiPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(apiPrefixSettings.API_PREFIX);
};

const enableCors = (app: INestApplication) => {
  app.enableCors();
};

const setPipes = (app: INestApplication) => {
  const validationPipeOptions: ValidationPipeOption =
    new ValidationPipeOption();
  const validationPipe: ValidationPipe = new ValidationPipe(
    validationPipeOptions,
  );
  app.useGlobalPipes(validationPipe);
};

const setExceptionFilter = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
