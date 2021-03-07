import { Injectable } from '@nestjs/common';
import { Url } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUrlDto): Promise<Url> {
    return this.prisma.url.create({ data });
  }
}
