import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: {
      published: true,
    },
  });

  console.log(post);
}

(async () => {
  try {
    await main();
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
})();

// app.get("/", (_, res) => {
//   res.send("hello world");
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));
