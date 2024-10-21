import { INestApplication, ValidationPipe } from '@nestjs/common';
import { apiPrefixSettings } from './app-prefix-settings';
import { ValidationPipeOption } from '../core/pipes/validation-pipe/validation-pipe-options';
import { HttpExceptionFilter } from '../core/exception-filters/http-exception-filters/http-exception-filters';
import { DomainGuard } from '../core/guards/application-guard/domain-guard';
import { DomainGuardStrategy } from '../core/guards/application-guard/domain-guard-strategy';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './types/types';
import { EnvSettings } from './env-settings';

export const applyAppSettings = (app: INestApplication) => {
  //setApiPrefix(app);

  setPipes(app);

  setExceptionFilter(app);

  enableCors(app);

  setGlobalGuard(app);
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

const setGlobalGuard = (app: INestApplication) => {
  const configService = app.get(ConfigService<ConfigurationType, true>);
  const envSettings: EnvSettings = configService.get('environmentSettings', {
    infer: true,
  });

  const domainGuardStrategy = new DomainGuardStrategy(envSettings);
  const domainGuard: DomainGuard = new DomainGuard(domainGuardStrategy);
  app.useGlobalGuards(domainGuard);
};
