import { Transform, TransformFnParams } from 'class-transformer';

export const ToBoolean = () =>
  Transform(({ value }: TransformFnParams) => value === 'Y');
