import { EventBus } from '@nestjs/cqrs';
import { ITestSettings } from '../../../../../test/settings/interfaces';
import { initSettings } from '../../../../../test/settings/test-settings';
import { AppObjectResultEnum } from '../../../../core/types/types';
import { B24ApiOutputModel } from '../../api/models/output/b24-api-output.models';
import { CloseEventB24Event } from './close.event';
import { B24ApiRepositories } from '../../infrastructure/b24-api-repositories';

describe('CloseEventHandler', () => {
  let b24RestApiRepositories: B24ApiRepositories;
  let inputModel: B24ApiOutputModel;
  let settings: ITestSettings;
  let access_token_value: string;
  let client_endpoint_value: string;
  let eventBus: EventBus;

  beforeAll(async () => {
    settings = await initSettings();
    b24RestApiRepositories = settings.app.get(B24ApiRepositories);
    eventBus = settings.app.get(EventBus);
  });

  beforeEach(() => {
    inputModel = {
      event_token: 'eventToken',
      return_values: {
        result: [],
        result_1: null,
        result_2: null,
        result_3: null,
        result_4: null,
        result_5: null,
        result_6: null,
        result_7: null,
        result_8: null,
        result_9: null,
        result_10: null,
      },
    };
    access_token_value = 'accessToken';
    client_endpoint_value = 'clientEndpoint';
  });

  it('should return success if repository take boolean', async () => {
    const b24RestApiRepositoriesMock = jest.spyOn(
      b24RestApiRepositories,
      'closeEvent',
    );
    b24RestApiRepositoriesMock.mockReturnValueOnce(Promise.resolve(true));

    await eventBus.publish(
      new CloseEventB24Event(
        inputModel,
        access_token_value,
        client_endpoint_value,
      ),
    );
    expect(b24RestApiRepositoriesMock).toHaveBeenCalledWith(
      {
        event_token: inputModel.event_token,
        return_values: {
          result: [],
          result_1: null,
          result_2: null,
          result_3: null,
          result_4: null,
          result_5: null,
          result_6: null,
          result_7: null,
          result_8: null,
          result_9: null,
          result_10: null,
        },
      },
      access_token_value,
      client_endpoint_value,
    );
    b24RestApiRepositoriesMock.mockRestore();
  });

  it('should return bad request if repository take with error', async () => {
    const b24RestApiRepositoriesMock = jest.spyOn(
      b24RestApiRepositories,
      'closeEvent',
    );
    b24RestApiRepositoriesMock.mockReturnValueOnce(Promise.resolve(true));
    await eventBus.publish(
      new CloseEventB24Event(
        inputModel,
        access_token_value,
        client_endpoint_value,
      ),
    );
    expect(b24RestApiRepositoriesMock).toHaveBeenCalledWith(
      {
        event_token: inputModel.event_token,
        return_values: {
          result: [],
          result_1: null,
          result_2: null,
          result_3: null,
          result_4: null,
          result_5: null,
          result_6: null,
          result_7: null,
          result_8: null,
          result_9: null,
          result_10: null,
        },
      },
      access_token_value,
      client_endpoint_value,
    );
    b24RestApiRepositoriesMock.mockRestore();
  });
});
