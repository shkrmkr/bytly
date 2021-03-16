import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from './url/url.service';

@Controller('/')
export class AppController {
  constructor(private urlService: UrlService) {}

  @Get(':hash')
  async redirectToOriginalUrl(
    @Param('hash') hash: string,
    @Res() res: Response,
  ) {
    const { originalUrl } = await this.urlService.getUniqueUrl({ hash });

    res.redirect(originalUrl);
  }
}
