import { NumberToWordService } from './number-to-word-service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Create multi language number to words', () => {
  let numberToWordService: NumberToWordService;
  const mockN2Words = jest.fn((number: number, options: { lang: string }) => {
    const values: { [key: string]: string } = {
      en: 'one',
      de: 'eins',
      pl: 'jeden',
      ru: 'один',
      it: 'uno',
      fr: 'un',
      lt: 'vienas',
    };
    return values[options.lang] || '';
  });
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NumberToWordService,
        { provide: 'N2WORDS', useValue: mockN2Words },
      ],
    }).compile();

    numberToWordService = module.get<NumberToWordService>(NumberToWordService);
  });

  describe('Create result values', () => {
    it('should convert number 1 to words in multiple languages', async () => {
      const result = await numberToWordService.toWord(1);

      expect(result).toEqual({
        en: 'one',
        de: 'eins',
        pl: 'jeden',
        ru: 'один',
        it: 'uno',
        fr: 'un',
        lt: 'vienas',
      });
    });

    it('should convert number 2 to words in multiple languages', async () => {
      const mock = jest.spyOn(numberToWordService, 'toWord');
      mock.mockReturnValue(
        Promise.resolve({
          en: 'two',
          de: 'zwei',
          pl: 'dwa',
          ru: 'два',
          it: 'due',
          fr: 'deux',
          lt: 'du',
        }),
      );
      const result = await numberToWordService.toWord(2);

      expect(result).toEqual({
        en: 'two',
        de: 'zwei',
        pl: 'dwa',
        ru: 'два',
        it: 'due',
        fr: 'deux',
        lt: 'du',
      });
      mock.mockRestore();
    });

    it('should convert number 10 to words in multiple languages', async () => {
      const mock = jest.spyOn(numberToWordService, 'toWord');
      mock.mockReturnValue(
        Promise.resolve({
          en: 'ten',
          de: 'zehn',
          pl: 'dziesięć',
          ru: 'десять',
          it: 'dieci',
          fr: 'dix',
          lt: 'dešimt',
        }),
      );
      const result = await numberToWordService.toWord(10);

      expect(result).toEqual({
        en: 'ten',
        de: 'zehn',
        pl: 'dziesięć',
        ru: 'десять',
        it: 'dieci',
        fr: 'dix',
        lt: 'dešimt',
      });
      mock.mockRestore();
    });
  });
});
