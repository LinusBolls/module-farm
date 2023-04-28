import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/client'
import nextConnect from 'next-connect'
import { getSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.get(async (req, res) => {
    const session = await getSession({ req })

    if (session == null) {
        res.status(401).json({ message: 'Not authenticated' })
        return
    }

    const { organizationId, flowId } = req.query

    if (typeof organizationId !== "string" || typeof flowId !== "string") {
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

    const organizationMember = await prisma.organizationMember.findUnique({
        where: {
            organizationId_userId: {
                organizationId,
                userId,
            },
        },
    })

    if (!organizationMember) {
        res.status(403).json({ message: 'User is not a member of the specified organization.' })
        return
    }

    try {
        const workflow = await prisma.workflow.findUnique({
            where: {
                id: flowId,
            },
            include: {
                nodes: {
                    include: {
                        block: true,
                    },
                },
                edges: {
                    include: {
                        sourceNode: true,
                        targetNode: true,
                    },
                },
                thumbnail: true,
            },
        })

        res.status(200).json({
            success: true, data: {
                nodes: [],
                edges: [],
                ...workflow,
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, error: (error as any).message ?? "unknown error" })
    }
})
handler.put(async (req, res) => {

    // @ts-ignore
    const session = await getServerSession(req, res, authOptions)

    if (session == null) {
        res.status(401).json({ message: 'Not authenticated' })
        return
    }

    const { organizationId, flowId } = req.query

    if (typeof organizationId !== "string" || typeof flowId !== "string") {
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

    const organizationMember = await prisma.organizationMember.findUnique({
        where: {
            organizationId_userId: {
                organizationId,
                userId,
            },
        },
    })

    if (!organizationMember) {
        res.status(403).json({ message: 'User is not a member of the specified organization.' })
        return
    }
    const { emoji, displayName, description, thumbnailId } = req.body

    try {
        const workflow = await prisma.workflow.update({
            where: {
                id: flowId,
            },
            data: {
                ...(thumbnailId == null ? {} : { thumbnailId }),
                ...(emoji == null ? {} : { emoji }),
                ...(displayName == null ? {} : { displayName }),
                ...(description == null ? {} : { description }),
            },
        })

        res.status(200).json({
            success: true, data: {
                nodes: [],
                edges: [],
                ...workflow,
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, error: (error as any).message ?? "unknown error" })
    }
})
export default handler