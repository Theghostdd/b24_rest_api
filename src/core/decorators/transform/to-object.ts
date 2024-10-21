import { Transform, TransformFnParams } from 'class-transformer';

export const ToObject = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return value;
    const result: string = value.replace(/'/g, '"');
    try {
      return JSON.parse(result);
    } catch (e) {
      return {};
    }
  });
