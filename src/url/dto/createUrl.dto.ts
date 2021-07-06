import { Prisma } from '@prisma/client';
import { IsUrl } from 'class-validator';

export class CreateUrlDto
  implements Omit<Prisma.UrlCreateInput, 'hash' | 'qrCodeDataUrl'> {
  @IsUrl({ require_protocol: false })
  originalUrl: string;
}
