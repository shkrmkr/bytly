import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import urls from './routes/urls';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:8080',
  })
);
app.use(express.json());
app.use('/urls', urls);
app.use('/:hash', async (req, res) => {
  const { hash } = req.params;

  try {
    const url = await prisma.url.update({
      where: { hash },
      data: { hits: { increment: 1 } },
    });

    res.redirect(301, url.original_url);
  } catch (error) {
    res.status(404).send({ message: '존재하지 않는 페이지입니다' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
