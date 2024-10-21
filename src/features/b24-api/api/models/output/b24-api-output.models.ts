import { Injectable } from '@nestjs/common';
import { B24ApiResultValues } from '../../../domain/types';

export class B24ApiOutputValuesModel {
  public result: any;
  public result_1: any;
  public result_2: any;
  public result_3: any;
  public result_4: any;
  public result_5: any;
  public result_6: any;
  public result_7: any;
  public result_8: any;
  public result_9: any;
  public result_10: any;
}

export class B24ApiOutputModel {
  public event_token: string;
  public return_values: B24ApiOutputValuesModel;
}

@Injectable()
export class B24ApiMapper {
  mapModel(
    event_token: string,
    result: any | null,
    resultValues: B24ApiResultValues | null,
  ) {
    return {
      event_token: event_token,
      return_values: {
        result: result,
        result_1: resultValues?.result_1 || null,
        result_2: resultValues?.result_2 || null,
        result_3: resultValues?.result_3 || null,
        result_4: resultValues?.result_4 || null,
        result_5: resultValues?.result_5 || null,
        result_6: resultValues?.result_6 || null,
        result_7: resultValues?.result_7 || null,
        result_8: resultValues?.result_8 || null,
        result_9: resultValues?.result_9 || null,
        result_10: resultValues?.result_10 || null,
      },
    };
  }
}
