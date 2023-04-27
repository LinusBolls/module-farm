// export const config = {
//     api: { externalResolver: true }
// }

// import express from 'express';

// const app = express();

// const serveFiles = express.static("../../../uploads/");

// app.use(['/api/images', '/images'], async (req, res, next) => {

//     console.log(req)

//     next()
// }, serveFiles);

// export default app;

// // http://localhost:3000/api/files/moin/api/images/6485e471-c066-4aae-8cff-071065aa3a24_image.png
// // http://localhost:3000/api/files/6485e471-c066-4aae-8cff-071065aa3a24_image.png



import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import path from "path";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {

    const {fileId} = req.query

    const filePath = path.resolve(__dirname, `../../../../../uploads/${fileId}`);

    console.log("path:",filePath)

    const imageBuffer = fs.readFileSync(filePath);

    res.setHeader("Content-Type", "image/jpg");

    return res.send(imageBuffer);
})

// export default function handler(req, res) {

//   const imagePath = req.query.slug.join("/");
//   const filePath = path.resolve(".", `images-directory/${imagePath}`);
//   const imageBuffer = fs.readFileSync(filePath);
//   res.setHeader("Content-Type", "image/jpg");
//   return res.send(imageBuffer);
// }
export default handler