import { PrismaClient, Url } from '@prisma/client';
import { Router } from 'express';
import { nanoid } from 'nanoid/async';
import { digitOnlyQueryStringToNumberArray } from './digitOnlyQueryStringToNumberArray';
import { validateAndFormat } from './validateAndFormat';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { originalUrl: original_url } = req.body;

  try {
    const validatedUrl = validateAndFormat(original_url);

    const isPresent = await prisma.url.findFirst({
      where: {
        original_url: validatedUrl,
      },
    });

    let shortUrl: Url;

    if (isPresent) {
      shortUrl = await prisma.url.update({
        where: { id: isPresent.id },
        data: { hits: { increment: 1 } },
      });
    } else {
      shortUrl = await prisma.url.create({
        data: {
          hash: await nanoid(10),
          original_url: validatedUrl,
        },
      });
    }

    res.status(201).send(shortUrl);
  } catch (error) {
    if (error.message === '잘못된 url 형식입니다.') {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: 'Something went wrong...' });
  }
});

router.get('/', async (req, res) => {
  const { shortUrlIds } = req.query;

  const ids = digitOnlyQueryStringToNumberArray(shortUrlIds as string);

  try {
    const urls = await prisma.url.findMany({
      where: { id: { in: ids } },
    });
    res.send(urls);
  } catch (error) {
    res.status(500).send({ message: 'Somthing went wrong...' });
  }
});

router.get('/:hash', async (req, res) => {
  const { hash } = req.params;

  try {
    const url = await prisma.url.findFirst({ where: { hash } });

    if (!url) {
      return res.status(400).send({ message: '존재하지 않는 short url입니다' });
    }

    res.send(url);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong...' });
  }
});

export default router;
