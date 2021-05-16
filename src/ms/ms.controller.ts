import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Account } from './entities/account.entity';
import { MsService } from './ms.service';

@ApiTags('ms')
@Controller('accounts')
export class MsController {
  constructor(private readonly msService: MsService) {}

  @Get('auth')
  @ApiResponse({
    status: 302,
    description: 'redirect to sign in url',
  })
  @Redirect()
  async auth() {
    const authCodeUrl = await this.msService.getAuthCodeUrl();
    return {
      url: authCodeUrl,
      statusCode: 302,
    };
  }

  @Get('authCallback')
  async authCallback(@Query('code') code: string) {
    const token = await this.msService.acquireTokenByCode(code);
    return token.accessToken;
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Account],
  })
  async getAccounts() {
    return await this.msService.getAccounts();
  }

  @Get(':username')
  @ApiResponse({
    status: 200,
    type: Account,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getAccount(@Param('username') username: string) {
    const account = await this.msService.getAccount(username);
    if (account) {
      return account;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Delete(':username')
  async removeAccount(@Param('username') username: string) {
    return await this.msService.removeAccount(username);
  }
}
