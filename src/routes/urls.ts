import { Router } from "express";
import { nanoid } from "nanoid/async";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { originalUrl: original_url } = req.body;

  try {
    const hash = await nanoid(10);
    const shortUrl = await prisma.url.create({
      data: {
        hash,
        original_url,
      },
    });
    res.status(201).send(shortUrl);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:hash", async (req, res) => {
  const { hash } = req.params;

  try {
    const url = await prisma.url.findFirst({ where: { hash } });

    if (!url) {
      return res.status(400).send({ message: "존재하지 않는 short url입니다" });
    }

    res.send(url);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
