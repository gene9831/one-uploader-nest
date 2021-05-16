import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class DriveApiService {
  readonly BASE_URL = 'https://graph.microsoft.com/v1.0/me/drive';

  constructor(private readonly httpService: HttpService) {}

  async putContent(
    accessToken: string,
    onedriveItemPath: string,
    localFileData: any,
  ) {
    const url = `${this.BASE_URL}/root:${onedriveItemPath}:/content`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return this.httpService
      .put(url, localFileData, { headers: headers })
      .toPromise();
  }
}
