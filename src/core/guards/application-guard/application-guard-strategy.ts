import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApplicationGuardStrategy {
  constructor() {}

  verify(request: Request) {
    if (
      !request.body.auth ||
      !request.body.auth.access_token ||
      !request.body.auth.client_endpoint ||
      !request.body.auth.server_endpoint ||
      !request.body.auth.refresh_token ||
      !request.body.event_token
    )
      throw new UnauthorizedException();

    return true;
  }
}
