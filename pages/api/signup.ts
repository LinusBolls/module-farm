import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import prisma from '../../prisma/client'
import bcrypt from 'bcrypt'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.post(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' })
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: await bcrypt.hash(password, 10),
      },
    })
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

export default handler
