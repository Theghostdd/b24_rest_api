import { Trim } from '../../../../../core/decorators/transform/trim';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { B24ApiInputModel } from '../../../../b24-api/api/models/input/b24-api-input.models';
import { ToNumber } from '../../../../../core/decorators/transform/to-number';

export class NumberToWordPropertyModel {
  @Trim()
  @ToNumber()
  @IsNotEmpty()
  @IsNumber()
  number: number;
}

export class NumberToWordInputModel extends B24ApiInputModel {
  @ValidateNested()
  @Type(() => NumberToWordPropertyModel)
  public properties: NumberToWordPropertyModel;
}
