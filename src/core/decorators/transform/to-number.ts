import { Transform, TransformFnParams } from 'class-transformer';

export const ToNumber = () =>
  Transform(({ value }: TransformFnParams) => {
    const expectValue = Number(value);
    if (!isNaN(expectValue)) {
      return expectValue;
    }
    return '';
  });
