import { Trim } from '../../../../../core/decorators/transform/trim';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class B24ApiAuthInputModel {
  @Trim()
  @IsNotEmpty()
  @IsString()
  access_token: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  expires: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  expires_in: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  domain: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  server_endpoint: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  client_endpoint: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  member_id: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  user_id: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  application_token: string;
}

export class B24ApiInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  public event_token: string;
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => B24ApiAuthInputModel)
  public auth: B24ApiAuthInputModel;
}
