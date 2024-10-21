import { CommandBus } from '@nestjs/cqrs';
import { RequestCommand } from './request.command';
import { initSettings } from '../../../../../test/settings/test-settings';
import { ITestSettings } from '../../../../../test/settings/interfaces';
import { B24RestApiService } from '../b24-rest-api-service';
import { B24RestApiInputModel } from '../../api/models/input/b24-rest-api-input.model';
import { AppObjectResultEnum } from '../../../../core/types/types';
import { B24ApiRepositories } from '../../../b24-api/infrastructure/b24-api-repositories';
import { CloseEventB24EventHandler } from '../../../b24-api/applucation/event/close.event';

describe('RequestCommandHandler', () => {
  let b24RestApiService: B24RestApiService;
  let b24RestApiRepositories: B24ApiRepositories;
  let closeEventHandler: CloseEventB24EventHandler;
  let commandBus: CommandBus;
  let inputModel: B24RestApiInputModel;
  let settings: ITestSettings;
  beforeAll(async () => {
    settings = await initSettings();
    b24RestApiService = settings.app.get(B24RestApiService);
    b24RestApiRepositories = settings.app.get(B24ApiRepositories);
    closeEventHandler = settings.app.get(CloseEventB24EventHandler);
    commandBus = settings.app.get(CommandBus);
  });

  beforeEach(() => {
    inputModel = {
      properties: {
        method: 'someMethod',
        body: {},
        isBig: false,
        keys: ['key1', 'key2'],
      },
      event_token: 'eventToken',
      auth: {
        access_token: 'accessToken',
        client_endpoint: 'clientEndpoint',
        user_id: '1',
        application_token: 'applicationToken',
        domain: 'domain',
        expires: 'expires',
        expires_in: 'expires_in',
        member_id: '1',
        refresh_token: 'refreshToken',
        server_endpoint: 'serverEndpoint',
      },
    };
  });

  it('should return success if repository take any array or object', async () => {
    const b24RestApiRepositoriesMock = jest.spyOn(
      b24RestApiRepositories,
      'request',
    );
    b24RestApiRepositoriesMock.mockReturnValueOnce(Promise.resolve([]));

    const b24RestApiServiceMock = jest.spyOn(
      b24RestApiService,
      'createResultValues',
    );
    b24RestApiServiceMock.mockReturnValueOnce({});

    const closeEventHandlerMock = jest.spyOn(closeEventHandler, 'handle');

    const result = await commandBus.execute(new RequestCommand(inputModel));
    expect(result).toEqual({
      appResult: AppObjectResultEnum.SUCCESS,
      data: true,
      error: null,
    });
    expect(closeEventHandlerMock).toHaveBeenCalledWith({
      access_token: inputModel.auth.access_token,
      client_endpoint: inputModel.auth.client_endpoint,
      property: {
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
    });
    expect(b24RestApiRepositoriesMock).toHaveBeenCalled();
    expect(b24RestApiServiceMock).toHaveBeenCalled();
    b24RestApiRepositoriesMock.mockRestore();
    b24RestApiServiceMock.mockRestore();
    closeEventHandlerMock.mockRestore();
  });

  it('should return bad request if repository take "error"', async () => {
    const b24RestApiRepositoriesMock = jest.spyOn(
      b24RestApiRepositories,
      'request',
    );
    b24RestApiRepositoriesMock.mockReturnValueOnce(
      Promise.resolve({ error: 101, error_description: 'Some error' }),
    );

    const b24RestApiServiceMock = jest.spyOn(
      b24RestApiService,
      'createResultValues',
    );
    b24RestApiServiceMock.mockReturnValueOnce({});

    const closeEventHandlerMock = jest.spyOn(closeEventHandler, 'handle');

    const result = await commandBus.execute(new RequestCommand(inputModel));
    expect(result).toEqual({
      appResult: AppObjectResultEnum.BAD_REQUEST,
      data: null,
      error: 'Some error',
    });
    expect(closeEventHandlerMock).toHaveBeenCalledWith({
      access_token: inputModel.auth.access_token,
      client_endpoint: inputModel.auth.client_endpoint,
      property: {
        event_token: inputModel.event_token,
        return_values: {
          result: {
            error: 101,
            error_description: 'Some error',
          },
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
    });
    expect(b24RestApiRepositoriesMock).toHaveBeenCalled();
    expect(b24RestApiServiceMock).toHaveBeenCalled();

    b24RestApiRepositoriesMock.mockRestore();
    b24RestApiServiceMock.mockRestore();
    closeEventHandlerMock.mockRestore();
  });
});
