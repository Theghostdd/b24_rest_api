import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-settings';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './settings/types/types';
import { EnvSettings } from './settings/env-settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyAppSettings(app);
  const configService = app.get(ConfigService<ConfigurationType, true>);
  const envSettings: EnvSettings = configService.get('environmentSettings', {
    infer: true,
  });
  await app.listen(envSettings.PORT, () => {
    console.log(`App started on port ${envSettings.PORT}`);
    console.log(`Env ${envSettings.ENV}`);
  });
}
bootstrap();
