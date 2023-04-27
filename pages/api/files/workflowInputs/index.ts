import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { PrismaClient } from '@prisma/client';
import upload from '@/fileUpload/multerConfig';
import AssetRole from '@/fileUpload/AssetRole';
import { getProviders, getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { getServerSession, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false
  }
}


const prisma = new PrismaClient();

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(upload.single('file'), async (req, res) => {

  // @ts-ignore
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  const session = await getServerSession(req, res, authOptions)

  if (session == null) {
      res.status(401).json({ message: 'Not authenticated' })
      return
  }

  // const { organizationId } = req.query

  // if (typeof organizationId !== "string") {
  //     res.status(400).json({ message: "Invalid query parameters." })
  //     return
  // }

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
      fileName: req.file.path,
      displayName: req.file.path,
      // @ts-ignore
      mimetype: req.file.mimetype,
      assetRole: "AVATAR",
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
