import { firstValueFrom } from 'rxjs';
import { APISettings } from '../../../settings/api-settings';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../settings/types/types';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { B24ApiOutputModel } from '../api/models/output/b24-api-output.models';

export type B24RestApiErrorResponse = {
  error: string;
  error_description: string;
};

@Injectable()
export class B24ApiRepositories {
  private apiSettings: APISettings;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {
    this.apiSettings = this.configService.get('apiSettings', { infer: true });
  }

  async request(
    array: any[],
    next: number,
    method: string,
    body: object,
    isBig: boolean,
    client_endpoint: string,
    access_token: string,
  ): Promise<any | B24RestApiErrorResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${client_endpoint}/${method}`, {
          ...body,
          access_token: access_token,
          start: next,
        }),
      );

      if (!isBig) return response.data.result;

      if (Array.isArray(response.data.result)) {
        if (response.data.result.length > 0) {
          array.push(...response.data.result);

          if (response.data.next) {
            await this.request(
              array,
              response.data.next,
              method,
              body,
              isBig,
              client_endpoint,
              access_token,
            );
          }
        }
      } else if (
        typeof response.data.result === 'object' &&
        response.data.result !== null
      ) {
        const key = Object.keys(response.data.result).find((k) =>
          Array.isArray(response.data.result[k]),
        );

        if (key) {
          const nestedArray = response.data.result[key];
          if (nestedArray.length > 0) {
            array.push(...nestedArray);

            if (response.data.next) {
              await this.request(
                array,
                response.data.next,
                method,
                body,
                isBig,
                client_endpoint,
                access_token,
              );
            }
          }
        } else {
          return response.data.result;
        }
      } else {
        return response.data.result;
      }

      return array;
    } catch (e) {
      if (e.response && e.response.data) return e.response.data;
      return {
        error_description: 'Unexpected error',
        error: 'Unexpected error',
      };
    }
  }

  async closeEvent(
    body: B24ApiOutputModel,
    client_endpoint: string,
    access_token: string,
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${client_endpoint}/${this.apiSettings.B24_STATIC_METHODS.bizproc_event_send}`,
          { ...body, access_token: access_token },
        ),
      );
      return true;
    } catch (e) {
      const date = new Date().toISOString();
      const errorMessage = `[${date}] Error in closeEvent: ${e.message}\nStack: ${e.stack}\n\n`;
      const logFilePath = path.join(process.cwd(), 'error.log');
      fs.appendFile(logFilePath, errorMessage, (err) => {
        if (err) {
          console.error(`[${date}] Failed to write to log file:`, err);
        }
      });
      return false;
    }
  }
}
