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

    const { organizationId } = req.query

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

    // Replace 'REQUIRED_PERMISSION_ID' with the actual permission ID you want to check for
    const hasPermission = organizationMember.permissions.some(permission => permission.id === 'REQUIRED_PERMISSION_ID')

    if (!hasPermission) {
        res.status(403).json({ message: 'User does not have the required permission to view workflows.' })
        return
    }

    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                ownerId: userId,
            },
        })

        res.status(200).json({ success: true, data: workflows })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
})

handler.post(async (req, res) => {
    const session = await getSession({ req })

    if (session == null) {
        res.status(401).json({ message: 'Not authenticated' })
        return
    }
    const { organizationId } = req.query

    const { title, description, emoji } = req.body

    if (!title || !description || !emoji) {
        res.status(400).json({ message: 'Please provide all required fields.' })
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

    // Replace 'REQUIRED_PERMISSION_ID' with the actual permission ID you want to check for
    const hasPermission = organizationMember.permissions.some(permission => permission.id === 'REQUIRED_PERMISSION_ID')

    if (!hasPermission) {
        res.status(403).json({ message: 'User does not have the required permission to create a workflow.' })
        return
    }

    try {
        const newWorkflow = await prisma.workflow.create({
            data: {
                emoji,
                displayName: title,
                description,
                ownerId: userId,
            },
        })

        res.status(201).json({ success: true, data: newWorkflow })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
})

export default handler
