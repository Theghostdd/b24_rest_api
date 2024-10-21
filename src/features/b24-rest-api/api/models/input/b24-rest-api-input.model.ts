import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim';
import { Type } from 'class-transformer';
import { ToObject } from '../../../../../core/decorators/transform/to-object';
import { ToBoolean } from '../../../../../core/decorators/transform/to-boolean';
import { B24ApiInputModel } from '../../../../b24-api/api/models/input/b24-api-input.models';

export class B24RestApiInputPropertiesModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  public method: string;
  @ToBoolean()
  @IsNotEmpty()
  public isBig: boolean;
  @ToObject()
  public body: object;
  public keys: string[] | null;
}

export class B24RestApiInputModel extends B24ApiInputModel {
  @ValidateNested()
  @Type(() => B24RestApiInputPropertiesModel)
  public properties: B24RestApiInputPropertiesModel;
}
