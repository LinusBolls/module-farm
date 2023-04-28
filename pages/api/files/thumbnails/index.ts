// @ts-ignore
import multiparty from "multiparty"
import ImageKit from 'imagekit';
import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

console.log("imagekit url endpoint:", process.env.IMAGEKIT_URL_ENDPOINT)

export const config = {
  api: {
    bodyParser: false,
  },
};

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});
const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {

  const form = new multiparty.Form();

  // @ts-ignore
  const session = await getServerSession(req, res, authOptions)

  if (session == null) {
      res.status(401).json({ message: 'Not authenticated' })
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


  // @ts-ignore
  form.parse(req, async (err, fields, files) => {

    if (err) {

      return res.status(400).json({ success: false, error: err, location: "formParse" })
    }
    const file = files?.file?.[0]?.toString("base64")

    if (file == null) {

      return res.status(400).json({ success: false, error: "file not found" })
    }

    let imagekitData: UploadResponse;
    
    try {
      imagekitData = await imageKit.upload({
        file,
        fileName: "workflow-thumbnail"
      });
    } catch(dingsErr) {

      console.error(err)

      return res.status(400).json({ success: false, error: err, location: "imagekitUpload" })
    }
    try {
      const fileData = {
        // @ts-ignore
        fileName: imagekitData.fileId,
        displayName: imagekitData.name,
        // @ts-ignore
        mimetype: "image/jpg",
        assetRole: "WORKFLOW_THUMBNAIL",
        uploaderId: userId,
        url: imagekitData.url, 
      };
  
      const savedFile = await prisma.file.create({
        // @ts-ignore
        data: fileData,
      });
      res.status(200).json({ success: true, data: imagekitData });
  
    } catch (err) {

      console.error(err)

      return res.status(400).json({ success: false, error: err, location: "prismaSave" })
    }
  });
})
export default handler;
