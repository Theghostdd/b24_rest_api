import { B24StaticMethodsType } from './types/types';

export class APISettings {
  public B24_STATIC_METHODS: B24StaticMethodsType;
  constructor() {
    this.B24_STATIC_METHODS = {
      bizproc_event_send: 'bizproc.event.send',
    };
  }
}
