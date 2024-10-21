import { ValidateNested, validateSync } from 'class-validator';
import { APISettings } from '../api-settings';
import { EnvSettings } from '../env-settings';
import { EnvVariableType } from '../types/types';

export class Configuration {
  apiSettings: APISettings;
  @ValidateNested()
  environmentSettings: EnvSettings;
  private constructor(configuration: Configuration) {
    Object.assign(this, configuration);
  }

  static createConfig(environmentVariables: EnvVariableType): Configuration {
    const environmentSettings: EnvSettings = new EnvSettings(
      environmentVariables,
    );
    const apiSettings: APISettings = new APISettings();
    return new this({
      environmentSettings,
      apiSettings,
    });
  }
}

export function validate(environmentVariables: EnvVariableType) {
  const config = Configuration.createConfig(environmentVariables);
  const errors = validateSync(config, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return config;
}

export default () => {
  const environmentVariables = process.env as EnvVariableType;
  return Configuration.createConfig(environmentVariables);
};
