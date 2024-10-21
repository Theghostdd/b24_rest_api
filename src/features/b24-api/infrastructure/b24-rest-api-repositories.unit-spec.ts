import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { ITestSettings } from '../../../../test/settings/interfaces';
import { initSettings } from '../../../../test/settings/test-settings';
import { B24ApiRepositories } from './b24-api-repositories';

describe('B24RestApiRepositories', () => {
  let repository: B24ApiRepositories;
  let settings: ITestSettings;
  let httpService: HttpService;

  beforeEach(async () => {
    settings = await initSettings();
    repository = settings.app.get<B24ApiRepositories>(B24ApiRepositories);
    httpService = settings.app.get<HttpService>(HttpService);
  });

  describe('request', () => {
    it('should handle non-recursive response', async () => {
      const mockResponse = { data: { result: { some: 'data' } } };
      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of(mockResponse) as any);

      const result = await repository.request(
        [],
        0,
        'method',
        {},
        false,
        'endpoint',
        'token',
      );
      expect(httpServiceMock).toHaveBeenCalled();
      expect(result).toEqual({ some: 'data' });
      httpServiceMock.mockRestore();
    });

    it('should handle recursive response with array', async () => {
      const mockResponse1 = { data: { result: [1, 2, 3], next: 1 } };
      const mockResponse2 = { data: { result: [4, 5], next: null } };

      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockResponse1) as any)
        .mockImplementationOnce(() => of(mockResponse2) as any);

      const result = await repository.request(
        [],
        0,
        'method',
        {},
        true,
        'endpoint',
        'token',
      );
      expect(httpServiceMock).toHaveBeenCalled();
      expect(result).toEqual([1, 2, 3, 4, 5]);
      httpServiceMock.mockRestore();
    });

    it('should handle recursive response with nested array', async () => {
      const mockResponse1 = { data: { result: { key: [1, 2, 3] }, next: 1 } };
      const mockResponse2 = { data: { result: { key: [4, 5] }, next: null } };

      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(mockResponse1) as any)
        .mockImplementationOnce(() => of(mockResponse2) as any);

      const result = await repository.request(
        [],
        0,
        'method',
        {},
        true,
        'endpoint',
        'token',
      );
      expect(httpServiceMock).toHaveBeenCalled();
      expect(result).toEqual([1, 2, 3, 4, 5]);
      httpServiceMock.mockRestore();
    });

    it('should handle error response', async () => {
      const mockError = { response: {} };
      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => mockError) as any);

      const result = await repository.request(
        [],
        0,
        'method',
        {},
        false,
        'endpoint',
        'token',
      );
      expect(httpServiceMock).toHaveBeenCalled();
      expect(result).toEqual({
        error_description: 'Unexpected error',
        error: 'Unexpected error',
      });
      httpServiceMock.mockRestore();
    });
  });

  describe('closeEvent', () => {
    it('should handle successful response', async () => {
      const mockResponse = { data: { result: true } };
      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of(mockResponse) as any);

      const result = await repository.closeEvent(
        {} as any,
        'endpoint',
        'token',
      );

      expect(httpServiceMock).toHaveBeenCalled();

      expect(result).toBe(true);
      httpServiceMock.mockRestore();
    });

    it('should handle error response', async () => {
      const mockError = { response: {} };
      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => mockError) as any);

      const result = await repository.closeEvent(
        {} as any,
        'endpoint',
        'token',
      );
      expect(httpServiceMock).toHaveBeenCalled();
      expect(result).toBeFalsy();
      httpServiceMock.mockRestore();
    });
  });
});
