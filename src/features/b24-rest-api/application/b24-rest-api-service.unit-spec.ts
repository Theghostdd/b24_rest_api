import { initSettings } from '../../../../test/settings/test-settings';
import { ITestSettings } from '../../../../test/settings/interfaces';
import { B24RestApiService } from './b24-rest-api-service';
import { B24ApiOutputValuesModel } from '../../b24-api/api/models/output/b24-api-output.models';

describe('Create result values', () => {
  let settings: ITestSettings;
  let b24RestApiService: B24RestApiService;
  beforeAll(async () => {
    settings = await initSettings();
    b24RestApiService = settings.app.get(B24RestApiService);
  });

  describe('Create result values', () => {
    it('should return correct values', () => {
      const mock = jest.spyOn(b24RestApiService, 'findValues');
      mock
        .mockReturnValueOnce([1, 2, 3, 4])
        .mockReturnValueOnce(['Title1', 'Title2', 'Title3', 'Title4'])
        .mockReturnValueOnce(['Name1', 'Name2', 'Name3', 'Name4']);

      const result: B24ApiOutputValuesModel | object =
        b24RestApiService.createResultValues(['', '', ''], []);

      mock.mockRestore();

      const arr: string[] = Object.keys(result);
      expect(arr).toHaveLength(3);
      expect(result).toEqual({
        result_1: [1, 2, 3, 4],
        result_2: ['Title1', 'Title2', 'Title3', 'Title4'],
        result_3: ['Name1', 'Name2', 'Name3', 'Name4'],
      });
    });

    it('should return empty object, empty keys', () => {
      const result: B24ApiOutputValuesModel | object =
        b24RestApiService.createResultValues([], []);
      expect(result).toEqual({});
      expect(result);
    });

    it('should return correct values, no more than 10 ', () => {
      const mock = jest.spyOn(b24RestApiService, 'findValues');
      mock
        .mockReturnValueOnce([1])
        .mockReturnValueOnce(['Title1'])
        .mockReturnValueOnce(['Name1'])
        .mockReturnValueOnce([10])
        .mockReturnValueOnce(['M'])
        .mockReturnValueOnce(['email@email.ru'])
        .mockReturnValueOnce(['SomeLogin'])
        .mockReturnValueOnce([true])
        .mockReturnValueOnce([false])
        .mockReturnValueOnce([true]);

      const result: B24ApiOutputValuesModel | object =
        b24RestApiService.createResultValues(
          [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [],
        );

      mock.mockRestore();
      jest.resetAllMocks();

      const arr: string[] = Object.keys(result);
      expect(arr).toHaveLength(10);
      expect(result).toEqual({
        result_1: [1],
        result_2: ['Title1'],
        result_3: ['Name1'],
        result_4: [10],
        result_5: ['M'],
        result_6: ['email@email.ru'],
        result_7: ['SomeLogin'],
        result_8: [true],
        result_9: [false],
        result_10: [true],
      });
    });
  });

  describe('Find values', () => {
    it('should return correct values from object', () => {
      const item = {
        id: 1,
        name: 'Kirill',
        address: {
          city: 'Vilnius',
          country: 'Lithuania',
          house: 1,
          floor: 5,
          security: {
            doorPassword: 123456,
            nameWife: 'Alina',
            children: {
              nameChildren: 'Richard',
              age: 1,
              parent: {
                nameParent: 'Name',
              },
            },
          },
        },
      };
      let result: string[] = b24RestApiService.findValues(item, '$..id');
      expect(result).toEqual([1]);

      result = b24RestApiService.findValues(item, '$..country');
      expect(result).toEqual(['Lithuania']);

      result = b24RestApiService.findValues(item, '$..doorPassword');
      expect(result).toEqual([123456]);

      result = b24RestApiService.findValues(item, '$..nameChildren');
      expect(result).toEqual(['Richard']);

      result = b24RestApiService.findValues(item, '$..nameParent');
      expect(result).toEqual(['Name']);

      result = b24RestApiService.findValues(item, 'id');
      expect(result).toEqual([1]);

      result = b24RestApiService.findValues(item, '$.address.city');
      expect(result).toEqual(['Vilnius']);

      result = b24RestApiService.findValues(item, '$.address.house');
      expect(result).toEqual([1]);

      result = b24RestApiService.findValues(
        item,
        '$.address.security.nameWife',
      );
      expect(result).toEqual(['Alina']);

      result = b24RestApiService.findValues(
        item,
        '$.address.security.children.age',
      );
      expect(result).toEqual([1]);

      result = b24RestApiService.findValues(
        item,
        '$.address.security.children.parent',
      );
      expect(result).toEqual([{ nameParent: 'Name' }]);
    });

    it('should return correct values from array', () => {
      const item = [
        {
          id: 1,
          name: 'Kirill',
          address: {
            city: 'Vilnius',
            country: 'Lithuania',
            house: 1,
            floor: 5,
            security: {
              doorPassword: 123456,
              nameWife: 'Alina',
              children: {
                nameChildren: 'Richard',
                age: 1,
                parent: {
                  nameParent: 'Name',
                },
              },
            },
          },
        },
        {
          id: 2,
          name: 'Anna',
          address: {
            city: 'Riga',
            country: 'Latvia',
            house: 2,
            floor: 6,
            security: {
              doorPassword: 654321,
              nameWife: 'Maria',
              children: {
                nameChildren: 'Sophie',
                age: 3,
                parent: {
                  nameParent: 'John',
                },
              },
            },
          },
        },
      ];

      let result: string[] = b24RestApiService.findValues(item, '$..id');
      expect(result).toEqual([1, 2]);

      result = b24RestApiService.findValues(item, '$..country');
      expect(result).toEqual(['Lithuania', 'Latvia']);

      result = b24RestApiService.findValues(item, '$..doorPassword');
      expect(result).toEqual([123456, 654321]);

      result = b24RestApiService.findValues(item, '$..nameChildren');
      expect(result).toEqual(['Richard', 'Sophie']);

      result = b24RestApiService.findValues(item, '$..nameParent');
      expect(result).toEqual(['Name', 'John']);

      result = b24RestApiService.findValues(item, '$..name');
      expect(result).toEqual(['Kirill', 'Anna']);

      result = b24RestApiService.findValues(item, '$..address.city');
      expect(result).toEqual(['Vilnius', 'Riga']);

      result = b24RestApiService.findValues(item, '$..address.house');
      expect(result).toEqual([1, 2]);

      result = b24RestApiService.findValues(
        item,
        '$..address.security.nameWife',
      );
      expect(result).toEqual(['Alina', 'Maria']);

      result = b24RestApiService.findValues(
        item,
        '$..address.security.children.age',
      );
      expect(result).toEqual([1, 3]);

      result = b24RestApiService.findValues(
        item,
        '$..address.security.children.parent',
      );
      expect(result).toEqual([{ nameParent: 'Name' }, { nameParent: 'John' }]);

      result = b24RestApiService.findValues(item, '$..floor');
      expect(result).toEqual([5, 6]);

      result = b24RestApiService.findValues(item, '$..house');
      expect(result).toEqual([1, 2]);

      result = b24RestApiService.findValues(item, '$..nameWife');
      expect(result).toEqual(['Alina', 'Maria']);
    });

    it('should not return values, from object, key is not correct', () => {
      const item = {
        id: 1,
        about: {
          city: 'Vilnius',
        },
      };
      let result: string[] = b24RestApiService.findValues(item, '$...id');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '..id');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, 'city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.data.city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$..cities');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$...wrongKey');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.about.id');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.about.country');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.[0].city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.[*].about.city');
      expect(result).toHaveLength(0);
    });

    it('should not return values, from array, key is not correct', () => {
      const item = [
        {
          id: 1,
          about: {
            city: 'Vilnius',
          },
        },

        {
          id: 2,
          about: {
            city: 'Minsk',
          },
        },
      ];

      let result: string[] = b24RestApiService.findValues(item, '$...id');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '..id');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, 'id');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, 'city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$...city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.about.city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.data.city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$..cities');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$...wrongKey');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.about.id');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.[0].city');
      expect(result).toHaveLength(0);

      result = b24RestApiService.findValues(item, '$.[*].about.country');
      expect(result).toHaveLength(0);
    });
  });
});
