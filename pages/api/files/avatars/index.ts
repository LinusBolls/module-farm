import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { PrismaClient } from '@prisma/client';
import upload from '@/fileUpload/multerConfig';
import AssetRole from '@/fileUpload/AssetRole';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  const assetRole = req.body.assetRole as any;

  // @ts-ignore
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  if (!assetRole || !Object.values(AssetRole).includes(assetRole)) {
    res.status(400).json({ error: 'Invalid asset role' });
    return;
  }

  const session = await getSession({ req })

  if (session == null) {
      res.status(401).json({ message: 'Not authenticated' })
      return
  }

  const { organizationId } = req.query

  if (typeof organizationId !== "string") {
      res.status(400).json({ message: "Invalid query parameters." })
      return
  }

  const user = await prisma.user.findUnique({
      where: {
          email: session.user!.email!,
      },
  })

  if (user == null) {
      res.status(401).json({ message: "You don't have an account." })
      return
  }

  const userId = user.id

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const fileData = {
      // @ts-ignore
      path: req.file.path,
      // @ts-ignore
      mimetype: req.file.mimetype,
      assetRole: assetRole,
      uploaderId: userId,
    };

    const savedFile = await prisma.file.create({
      // @ts-ignore
      data: fileData,
    });

    res.status(201).json(savedFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while saving file metadata' });
  } finally {
    await prisma.$disconnect();
  }
});

export default handler;
