import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { B24RestApiController } from './features/b24-rest-api/api/b24-rest-api-controller';
import { B24RestApiService } from './features/b24-rest-api/application/b24-rest-api-service';
import { configModule } from './settings/configuration/config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AppResult } from './core/application-object-result/application-object-result';
import { RequestCommandHandler } from './features/b24-rest-api/application/command/request.command';
import { ApplicationGuardStrategy } from './core/guards/application-guard/application-guard-strategy';
import { LoggerMiddleware } from './core/middleware/log-request.middleware';
import { NumberToWordController } from './features/number-to-word/api/number-to-word-controller';
import { CloseEventB24EventHandler } from './features/b24-api/applucation/event/close.event';
import { B24ApiMapper } from './features/b24-api/api/models/output/b24-api-output.models';
import { NumberToWordService } from './features/number-to-word/application/number-to-word-service';
import { B24ApiRepositories } from './features/b24-api/infrastructure/b24-api-repositories';
import jsonpath from 'jsonpath';

export const N2WORDS_PROVIDER: Provider = {
  provide: 'N2WORDS',
  useFactory: async () => {
    return (await import('n2words')).default;
  },
};

export const JSON_PATH_PROVIDER: Provider = {
  provide: 'JSONPATH',
  useValue: jsonpath,
};

@Module({
  imports: [configModule, CqrsModule, HttpModule],
  controllers: [B24RestApiController, NumberToWordController],
  providers: [
    N2WORDS_PROVIDER,
    JSON_PATH_PROVIDER,
    B24RestApiService,
    AppResult,
    RequestCommandHandler,
    ApplicationGuardStrategy,
    LoggerMiddleware,
    B24ApiRepositories,
    CloseEventB24EventHandler,
    B24ApiMapper,
    NumberToWordService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
