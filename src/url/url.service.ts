import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Url } from '@prisma/client';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/createUrl.dto';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  private formatUrl(url: string): string {
    const withProtocol = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
    );
    const withoutProtocol = new RegExp(
      /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
    );

    // http://google.com => http://google.com
    // https://google.com => https://google.com
    if (url.match(withProtocol)) {
      return url;
    }

    // google.com => http://google.com
    // www.google.com => http://google.com
    if (url.match(withoutProtocol)) {
      return `http://${url}`;
    }
  }

  async create(data: CreateUrlDto): Promise<Url> {
    const formattedOriginalUrl = this.formatUrl(data.originalUrl);

    const isPresent = await this.prisma.url.findUnique({
      where: { originalUrl: formattedOriginalUrl },
    });

    if (isPresent) {
      return this.prisma.url.update({
        where: { id: isPresent.id },
        data: { hits: { increment: 1 } },
      });
    }

    const qrCodeDataUrl = await QRCode.toDataURL(data.originalUrl);

    return this.prisma.url.create({
      data: {
        originalUrl: formattedOriginalUrl,
        hash: nanoid(10),
        qrCodeDataUrl,
      },
    });
  }

  async getUniqueUrl(where: Prisma.UrlWhereUniqueInput): Promise<Url> {
    const url = await this.prisma.url.findUnique({ where });

    if (!url) {
      throw new NotFoundException('존재하지 않는 페이지입니다');
    }

    return this.prisma.url.update({
      where,
      data: { hits: { increment: 1 } },
    });
  }
}
