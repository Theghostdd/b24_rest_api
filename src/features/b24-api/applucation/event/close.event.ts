import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { B24ApiRepositories } from '../../infrastructure/b24-api-repositories';
import { B24ApiOutputModel } from '../../api/models/output/b24-api-output.models';

export class CloseEventB24Event {
  constructor(
    public readonly property: B24ApiOutputModel,
    public readonly client_endpoint: string,
    public readonly access_token: string,
  ) {}
}

@EventsHandler(CloseEventB24Event)
export class CloseEventB24EventHandler
  implements IEventHandler<CloseEventB24Event>
{
  constructor(private readonly b24ApiRepositories: B24ApiRepositories) {}
  async handle(event: CloseEventB24Event): Promise<void> {
    const { property, client_endpoint, access_token } = event;
    const result: boolean = await this.b24ApiRepositories.closeEvent(
      property,
      client_endpoint,
      access_token,
    );
    const date = new Date().toISOString();

    if (!result)
      console.error(`[${date}] Something went wrong while closing event`);
  }
}
