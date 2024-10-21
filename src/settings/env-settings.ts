import { EnvState } from './types/enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EnvVariableType } from './types/types';
import { Trim } from '../core/decorators/transform/trim';

export class EnvSettings {
  @IsEnum(EnvState)
  public readonly ENV: EnvState;
  @Trim()
  @IsNotEmpty()
  @IsNumber()
  public readonly PORT: number;

  constructor(envVariable: EnvVariableType) {
    this.ENV = (envVariable.ENV as EnvState) || EnvState.DEVELOPMENT;
    this.PORT = this.getNumberOrDefaultValue(envVariable.PORT, 3000);
  }

  getEnvState() {
    return this.ENV;
  }

  isTestingState() {
    return this.ENV === EnvState.TESTING;
  }

  isProductionState() {
    return this.ENV === EnvState.PRODUCTION;
  }

  isDevelopmentState() {
    return this.ENV === EnvState.DEVELOPMENT;
  }

  isStagingState() {
    return this.ENV === EnvState.STAGING;
  }

  protected getNumberOrDefaultValue(value: string, defaultValue: number) {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      return defaultValue;
    }
    return parsedValue;
  }
}
