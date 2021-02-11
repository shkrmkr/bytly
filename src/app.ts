import express from "express";
import dotenv from "dotenv";
import urls from "./routes/urls";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/urls", urls);
app.use("/:hash", async (req, res) => {
  const { hash } = req.params;

  try {
    const url = await prisma.url.findFirst({ where: { hash } });

    if (!url) {
      return res.status(400).send({ message: "존재하지 않는 페이지입니다" });
    }

    await prisma.url.update({
      where: { hash },
      data: { hits: { increment: 1 } },
    });

    res.redirect(301, url.original_url);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
