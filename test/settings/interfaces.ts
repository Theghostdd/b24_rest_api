import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../src/settings/types/types';

export interface ITestSettings {
  app: INestApplication;
  testingAppModule: TestingModule;
  testManager: ITestManger;
  testModels: ITestModels;
  configService: ConfigService<ConfigurationType, true>;
}

export interface ITestModels {}

export interface ITestManger {}
