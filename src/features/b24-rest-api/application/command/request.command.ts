import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { B24RestApiInputModel } from '../../api/models/input/b24-rest-api-input.model';
import { B24RestApiService } from '../b24-rest-api-service';
import { AppResult } from '../../../../core/application-object-result/application-object-result';
import { AppResultType } from '../../../../core/types/types';
import { CloseEventB24Event } from '../../../b24-api/applucation/event/close.event';
import {
  B24ApiMapper,
  B24ApiOutputModel,
} from '../../../b24-api/api/models/output/b24-api-output.models';
import {
  B24ApiRepositories,
  B24RestApiErrorResponse,
} from '../../../b24-api/infrastructure/b24-api-repositories';
import { B24ApiResultValues } from '../../../b24-api/domain/types';

export class RequestCommand {
  constructor(public inputModel: B24RestApiInputModel) {}
}

@CommandHandler(RequestCommand)
export class RequestCommandHandler
  implements ICommandHandler<RequestCommand, AppResultType<boolean, string>>
{
  constructor(
    private readonly b24RestApiService: B24RestApiService,
    private readonly b24ApiRepositories: B24ApiRepositories,
    private readonly appResult: AppResult,
    private readonly b24ApiMapper: B24ApiMapper,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: RequestCommand,
  ): Promise<AppResultType<boolean, string>> {
    const { method, body, isBig, keys } = command.inputModel.properties;
    const { event_token } = command.inputModel;
    const { access_token, client_endpoint } = command.inputModel.auth;

    const result: any | B24RestApiErrorResponse =
      await this.b24ApiRepositories.request(
        [],
        0,
        method,
        body,
        isBig,
        client_endpoint,
        access_token,
      );

    const createResultValues: B24ApiResultValues =
      this.b24RestApiService.createResultValues(
        keys[0] === '$' ? [] : keys,
        result,
      );

    const closeEventOutputModel: B24ApiOutputModel = this.b24ApiMapper.mapModel(
      event_token,
      result,
      createResultValues,
    );

    await this.eventBus.publish(
      new CloseEventB24Event(
        closeEventOutputModel,
        client_endpoint,
        access_token,
      ),
    );

    if (!result.error) {
      return this.appResult.success(true);
    }
    return this.appResult.badRequest(result.error_description);
  }
}
