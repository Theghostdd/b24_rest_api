import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { apiPrefixSettings } from '../../../settings/app-prefix-settings';
import { EventBus } from '@nestjs/cqrs';
import { NumberToWordInputModel } from './models/input/number-to-word-input.models';
import { NumberToWordOutputModel } from './models/output/number-to-word-output.models';
import { CloseEventB24Event } from '../../b24-api/applucation/event/close.event';
import { B24ApiMapper } from '../../b24-api/api/models/output/b24-api-output.models';
import { NumberToWordService } from '../application/number-to-word-service';
import { B24ApiResultValues } from '../../b24-api/domain/types';
import { ApplicationGuard } from '../../../core/guards/application-guard/application-guard';

@Controller(apiPrefixSettings.NUMBER_TO_WORD.number_to_word)
export class NumberToWordController {
  constructor(
    private readonly eventBus: EventBus,
    private readonly b24ApiMapper: B24ApiMapper,
    private readonly numberToWordService: NumberToWordService,
  ) {}

  @Post(apiPrefixSettings.NUMBER_TO_WORD.to_word)
  @UseGuards(ApplicationGuard)
  async toWord(
    @Body() inputModel: NumberToWordInputModel,
  ): Promise<NumberToWordOutputModel> {
    const result: NumberToWordOutputModel =
      await this.numberToWordService.toWord(inputModel.properties.number);
    const properties: B24ApiResultValues = {
      result_1: result.en,
      result_2: result.de,
      result_3: result.pl,
      result_4: result.lt,
      result_5: result.ru,
      result_6: result.fr,
      result_7: result.it,
    };
    const resultToB24 = this.b24ApiMapper.mapModel(
      inputModel.event_token,
      result,
      properties,
    );
    this.eventBus.publish(
      new CloseEventB24Event(
        resultToB24,
        inputModel.auth.client_endpoint,
        inputModel.auth.access_token,
      ),
    );
    return result;
  }
}
