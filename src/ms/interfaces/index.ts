import { NodeAuthOptions } from '@azure/msal-node';
import { ModuleMetadata, Type } from '@nestjs/common';

export type MsModuleOptions = NodeAuthOptions & {
  scopes: Array<string>;
  redirectUri: string;
};

export interface MsOptionsFactory {
  createMsOptions(): Promise<MsModuleOptions> | MsModuleOptions;
}

export interface MsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MsOptionsFactory>;
  useClass?: Type<MsOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<MsModuleOptions> | MsModuleOptions;
  inject?: any[];
}
