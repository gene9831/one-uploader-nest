import { Injectable } from '@nestjs/common';
import {
  AccountInfo,
  AuthenticationResult,
  ConfidentialClientApplication,
  Configuration,
  LogLevel,
  TokenCache,
} from '@azure/msal-node';
import { ConfigService } from '@nestjs/config';
import { MsModuleOptions } from './interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { SerializedToken } from './entities/token-cache.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MsService {
  private readonly msOptions: MsModuleOptions;
  private readonly cca: ConfidentialClientApplication;
  private readonly ccaTokenCache: TokenCache;

  constructor(
    readonly configService: ConfigService,
    @InjectRepository(SerializedToken)
    private readonly serializedTokenRepo: Repository<SerializedToken>,
  ) {
    this.msOptions = configService.get<MsModuleOptions>('ms');
    const { scopes, redirectUri, ...authOptions } = this.msOptions;
    const config: Configuration = {
      auth: authOptions,
      system: {
        loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Info,
        },
      },
    };
    this.cca = new ConfidentialClientApplication(config);
    this.ccaTokenCache = this.cca.getTokenCache();
    // load token cache
    this.loadToken();
  }

  async getAuthCodeUrl(): Promise<string> {
    const authCodeUrl = await this.cca.getAuthCodeUrl({
      scopes: this.msOptions.scopes,
      redirectUri: this.msOptions.redirectUri,
    });
    return authCodeUrl;
  }

  async acquireTokenByCode(code: string) {
    const res = await this.cca.acquireTokenByCode({
      code: code,
      scopes: this.msOptions.scopes,
      redirectUri: this.msOptions.redirectUri,
    });
    // console.debug(res);
    this.saveToken();
    return res;
  }

  async getAccounts() {
    return await this.ccaTokenCache.getAllAccounts();
  }

  async getAccount(username: string): Promise<AccountInfo | undefined> {
    const accounts = await this.ccaTokenCache.getAllAccounts();
    return accounts.find((a) => a.username === username);
  }

  async removeAccount(username: string) {
    const account = await this.getAccount(username);
    if (account) {
      await this.ccaTokenCache.removeAccount(account);
      return true;
    }
    return false;
  }

  async acquireTokenSilent(
    username: string,
  ): Promise<AuthenticationResult | undefined> {
    const account = await this.getAccount(username);
    if (!account) {
      return;
    }

    return await this.cca.acquireTokenSilent({
      account: account,
      scopes: this.msOptions.scopes,
    });
  }

  private async loadToken() {
    const one = await this.serializedTokenRepo.findOne();
    if (one) {
      this.ccaTokenCache.deserialize(one.serializedToken);
    }
  }

  private async saveToken() {
    const serializedToken = this.ccaTokenCache.serialize();

    const serializedTokenEntity = new SerializedToken();
    serializedTokenEntity.serializedToken = serializedToken;

    const one = await this.serializedTokenRepo.findOne();
    if (one) {
      await this.serializedTokenRepo.update(one.id, serializedTokenEntity);
      return;
    }
    await this.serializedTokenRepo.save(serializedTokenEntity);
  }
}
