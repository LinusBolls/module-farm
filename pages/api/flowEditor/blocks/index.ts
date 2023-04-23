import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/client'
import nextConnect from 'next-connect'
import { getSession } from 'next-auth/react'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.get(async (req, res) => {

    const session = await getSession({ req });

    if (session == null) res.status(401).json({ message: 'Not authenticated' });

    // destructuring combined with Promise.all to execute both queries at the same time and speeding this up
    const [services, blocks] = await Promise.all([
        await prisma.externalService.findMany(), 
        await prisma.workflowBlock.findMany(),
    ])

    res.json({
        ok: 1,
        data: {
            services,
            blocks,
        },
    })
})

export default handler