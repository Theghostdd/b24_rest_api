import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApplicationGuardStrategy } from './application-guard-strategy';

@Injectable()
export class ApplicationGuard implements CanActivate {
  constructor(
    private readonly applicationGuardStrategy: ApplicationGuardStrategy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.applicationGuardStrategy.verify(request);
  }
}
