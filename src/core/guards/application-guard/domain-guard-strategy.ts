import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { EnvSettings } from '../../../settings/env-settings';

@Injectable()
export class DomainGuardStrategy {
  constructor(private readonly envSettings: EnvSettings) {}
  verify(request: Request) {
    const domain = this.envSettings.DOMAIN;
    if (!domain) {
      return true;
    }

    if (!request.body.auth || !request.body.auth.domain)
      throw new UnauthorizedException();

    if (request.body.auth.domain !== domain) throw new ForbiddenException();

    return true;
  }
}
