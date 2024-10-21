import { Inject, Injectable } from '@nestjs/common';
import jsonpath from 'jsonpath';
import { B24ApiResultValues } from '../../b24-api/domain/types';

@Injectable()
export class B24RestApiService {
  constructor(@Inject('JSONPATH') private readonly jsonpath: jsonpath) {}

  createResultValues(keys: string[], result: any): B24ApiResultValues | object {
    if (keys?.length <= 0 || !keys) return {};
    return keys.reduce((acc, key, index) => {
      if (index >= 10) {
        return acc;
      }
      acc[`result_${index + 1}`] = this.findValues(result, key);
      return acc;
    }, {});
  }

  findValues(item: any, key: string): any[] {
    try {
      return this.jsonpath.query(item, key);
    } catch (e) {
      return [];
    }
  }
}
