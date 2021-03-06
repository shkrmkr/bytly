import { Prisma } from '@prisma/client';

export class CreateUrlDto implements Prisma.UrlCreateInput {
  originalUrl: string;
  hash: string;
}
