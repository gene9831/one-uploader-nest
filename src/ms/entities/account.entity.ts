import { AccountInfo } from '@azure/msal-node';
import { ApiProperty } from '@nestjs/swagger';

export class Account implements AccountInfo {
  @ApiProperty()
  homeAccountId: string;

  @ApiProperty()
  environment: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  localAccountId: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  idTokenClaims?: Record<string, unknown>;
}
