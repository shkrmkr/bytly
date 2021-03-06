import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
