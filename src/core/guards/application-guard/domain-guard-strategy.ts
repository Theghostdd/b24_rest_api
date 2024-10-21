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
    console.log('domain', domain);
    if (!domain) {
      return true;
    }

    if (!request.body.auth || !request.body.auth.client_endpoint)
      throw new UnauthorizedException();

    if (request.body.auth.client_endpoint !== domain)
      throw new ForbiddenException();

    return true;
  }
}
