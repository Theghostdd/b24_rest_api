import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import { INestApplication } from '@nestjs/common';
import { ITestManger, ITestModels, ITestSettings } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../src/settings/types/types';

export const initSettings = async (): Promise<ITestSettings> => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  setGlobalMock(testingModuleBuilder);

  const testingAppModule: TestingModule = await testingModuleBuilder.compile();
  const app: INestApplication = testingAppModule.createNestApplication();
  applyAppSettings(app);
  await app.init();

  const testManager: ITestManger = getTestManagers(app);

  const testModels: ITestModels = getTestModel();

  const configService = app.get(ConfigService<ConfigurationType, true>);

  return {
    app,
    testingAppModule,
    testManager,
    testModels,
    configService,
  };
};

const getTestModel = (): ITestModels => {
  return {};
};

const getTestManagers = (app: INestApplication): ITestManger => {
  return {};
};

const setGlobalMock = async (testingModule: TestingModuleBuilder) => {
  const mockN2Words = jest.fn();
  testingModule.overrideProvider('N2WORDS').useValue(mockN2Words);
};
