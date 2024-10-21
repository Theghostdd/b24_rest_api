import { Inject, Injectable } from '@nestjs/common';
import { NumberToWordOutputModel } from '../api/models/output/number-to-word-output.models';
import { In2Words } from '../../../core/types/types';

@Injectable()
export class NumberToWordService {
  constructor(@Inject('N2WORDS') private readonly n2words: In2Words) {}

  async toWord(number: number): Promise<NumberToWordOutputModel> {
    const en = this.n2words(number, { lang: 'en' });
    const de = this.n2words(number, { lang: 'de' });
    const pl = this.n2words(number, { lang: 'pl' });
    const ru = this.n2words(number, { lang: 'ru' });
    const it = this.n2words(number, { lang: 'it' });
    const fr = this.n2words(number, { lang: 'fr' });
    const lt = this.n2words(number, { lang: 'lt' });

    return {
      en,
      de,
      pl,
      ru,
      it,
      fr,
      lt,
    };
  }
}
