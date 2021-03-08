import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUrlDto } from './dto/createUrl.dto';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private urlSerice: UrlService) {}

  @Post()
  async createUrl(@Body() createUrlDto: CreateUrlDto) {
    return this.urlSerice.create(createUrlDto);
  }

  @Get(':hash')
  async getUrl(@Param('hash') hash: string) {
    return this.urlSerice.getUniqueUrl({ hash });
  }
}
