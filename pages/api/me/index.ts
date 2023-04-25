import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/client'
import nextConnect from 'next-connect'
import { getSession } from 'next-auth/react'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.get(async (req, res) => {
    const session = await getSession({ req })

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

    try {
        const userOrganizations = await prisma.organizationMember.findMany({
            where: {
                userId: user.id,
            },
            include: {
                organization: true,
            },
        })
        const organizations = userOrganizations.map(orgMember => orgMember.organization)

        res.status(200).json({ success: true, data: { organizations} })
    } catch (error) {
        res.status(400).json({ success: false, error: (error as any).message })
    }
})
export default handler