import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { B24RestApiInputModel } from './models/input/b24-rest-api-input.model';
import { AppObjectResultEnum, AppResultType } from '../../../core/types/types';
import { CommandBus } from '@nestjs/cqrs';
import { RequestCommand } from '../application/command/request.command';
import { Response } from 'express';
import { apiPrefixSettings } from '../../../settings/app-prefix-settings';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ApplicationGuard } from '../../../core/guards/application-guard/application-guard';

@Controller()
export class B24RestApiController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(apiPrefixSettings.ACTIVITY.initActivity)
  async initActivity(@Res() res: Response) {
    const filePath = path.resolve(
      __dirname,
      '../../../../src/init-activity.html',
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.status(500).send({ ...err });
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    });
  }

  @Post(apiPrefixSettings.ACTIVITY.updateActivity)
  async updateActivity(@Res() res: Response) {
    const filePath = path.resolve(
      __dirname,
      '../../../../src/update-activity.html',
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.status(500).send({ ...err });
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    });
  }

  @UseGuards(ApplicationGuard)
  @Post()
  @HttpCode(200)
  async requestB24(
    @Body() inputModel: B24RestApiInputModel,
  ): Promise<any[] | object> {
    const result: AppResultType<boolean, string> =
      await this.commandBus.execute(new RequestCommand(inputModel));

    switch (result.appResult) {
      case AppObjectResultEnum.SUCCESS:
        return;
      case AppObjectResultEnum.BAD_REQUEST:
        throw new BadRequestException({
          error: result.error,
          message: result.error,
        });
      default:
        throw new InternalServerErrorException();
    }
  }
}
