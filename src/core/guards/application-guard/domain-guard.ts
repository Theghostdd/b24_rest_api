import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DomainGuardStrategy } from './domain-guard-strategy';

@Injectable()
export class DomainGuard implements CanActivate {
  constructor(private readonly domainGuardStrategy: DomainGuardStrategy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.domainGuardStrategy.verify(request);
  }
}
