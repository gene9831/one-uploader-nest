import { registerAs } from '@nestjs/config';
import { MsModuleOptions } from 'src/ms/interfaces';

export const commonConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
});

export const msConfig = registerAs(
  'ms',
  (): MsModuleOptions => ({
    clientId: process.env.CLIENT_ID,
    authority: process.env.AUTHORITY,
    clientSecret: process.env.CLIENT_SECRET,
    scopes: ['User.Read', 'Files.ReadWrite.All'],
    redirectUri: process.env.REDIRECT_URI,
  }),
);

const configs = [commonConfig, msConfig];

export default configs;
