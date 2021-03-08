import { Prisma } from '@prisma/client';
import { IsUrl } from 'class-validator';

export class CreateUrlDto implements Omit<Prisma.UrlCreateInput, 'hash'> {
  @IsUrl({ require_protocol: false })
  originalUrl: string;
}
