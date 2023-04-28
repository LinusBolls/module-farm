import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import prisma from "../prisma/client"

import cookieParser from "cookie-parser"
import { decode } from 'next-auth/jwt';

import { config } from "dotenv"
import winston from 'winston';
import SocketParticipant from './SocketParticipant';

config({ path: './.env.local' });

const app = express();

app.get("/health", (req, res) => {

    console.log("/health headers:", JSON.stringify(req.headers, null, 2))

    res.json({ ok: 1 })
})

const httpServer = createServer(app);

const loggingFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: loggingFormat,
    // winston.format.combine(
    //   winston.format.timestamp(),
    //   loggingFormat,
    // ),
    defaultMeta: { service: 'realtime-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const io = new SocketServer(httpServer, {
    path: '/socket',
    cors: {
        origin: process.env.NEXTAUTH_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.use((socket, next) => {
    // @ts-ignore
    cookieParser()(socket.request, null, async (err) => {
        if (err) return next(err);

        // @ts-ignore
        const tokenStr = socket.request.cookies["next-auth.session-token"]

        // @ts-ignore
        if (tokenStr == null) return next("no session token cookie")

        const tokenPayload = await decode({
            token: tokenStr,
            secret: process.env.SECRET!,
        });
        // @ts-ignore
        if (tokenPayload == null) return next("invalid session token")

        // @ts-ignore
        socket.session = tokenPayload

        const email = tokenPayload.email!

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                // @ts-ignore
                ownedWorkflows: true,
            },
        });
        // @ts-ignore
        if (user == null) return next("unknown user")
        // @ts-ignore
        socket.user = user

        next();
    });
});

io.on('connection', (socket) => {

    // @ts-ignore
    const workflowIdsUserHasWriteAccessTo = socket.user.ownedWorkflows.map(i => i.id)

    // @ts-ignore
    const userIdentifierUsedForLogin = socket.session.name

    // @ts-ignore
    console.log("user connected:", userIdentifierUsedForLogin)

    socket.on('disconnect', () => {
        console.log("user disconnected:", userIdentifierUsedForLogin)
    });
    const connection = new SocketParticipant(socket)

    connection.on("EDITOR_CREATE_NODE", async (value) => {
        console.log("editor node created:", value)

        const { workflowId, ...detail } = value

        // @ts-ignore
        const userId = socket.user.id

        if (!workflowIdsUserHasWriteAccessTo.includes(workflowId)) {

            console.error(`EDITOR_MOVE_NODE operation failed because user "${userIdentifierUsedForLogin}" does not have write access to workflow "${workflowId}"`)

            return
        }

        await prisma.workflowAction.create({
            data: {
                actionType: "MOVE_NODE",
                causedById: userId,
                workflowId,
                detail,
            },
        })

        const block = await prisma.workflowBlock.findUnique({
            where: {
                id: detail.type,
            }
        })

        await prisma.workflowAction.create({
            data: {
                actionType: "CREATE_NODE",
                causedById: userId,
                workflowId,
                detail,
            },
        })
        await prisma.workflowNode.create({
            data: {
                workflowId,
                blockId: block!.id,
                posX: detail.pos.x,
                posY: detail.pos.y,
            },
        })
    })
    connection.on("EDITOR_MOVE_NODE", async (value) => {
        console.log("editor node moved:", value)

        const { workflowId, ...detail } = value

        // @ts-ignore
        const userId = socket.user.id

        if (!workflowIdsUserHasWriteAccessTo.includes(workflowId)) {

            console.error(`EDITOR_MOVE_NODE operation failed because user "${userIdentifierUsedForLogin}" does not have write access to workflow "${workflowId}"`)

            return
        }

        await prisma.workflowAction.create({
            data: {
                actionType: "MOVE_NODE",
                causedById: userId,
                workflowId,
                detail,
            },
        })
        await prisma.workflowNode.update({
            where: {
                id: detail.nodeId,
            },
            data: {
                posX: detail.pos.x,
                posY: detail.pos.y,
            },
        })
    })
    connection.on("EDITOR_DELETE_NODE", async (value) => {
        console.log("editor node deleted:", value)

        const { workflowId, ...detail } = value

        // @ts-ignore
        const userId = socket.user.id

        if (!workflowIdsUserHasWriteAccessTo.includes(workflowId)) {

            console.error(`EDITOR_MOVE_NODE operation failed because user "${userIdentifierUsedForLogin}" does not have write access to workflow "${workflowId}"`)

            return
        }

        await prisma.workflowAction.create({
            data: {
                actionType: "DELETE_NODE",
                causedById: userId,
                workflowId,
                detail,
            },
        })
        await prisma.workflowNode.delete({
            where: {
                id: detail.nodeId,
            },
        })
    })
    connection.on("EDITOR_CREATE_EDGE", async (value) => {
        console.log("editor edge created:", value)

        const { workflowId, ...detail } = value

        // @ts-ignore
        const userId = socket.user.id

        if (!workflowIdsUserHasWriteAccessTo.includes(workflowId)) {

            console.error(`EDITOR_CREATE_EDGE operation failed because user "${userIdentifierUsedForLogin}" does not have write access to workflow "${workflowId}"`)

            return
        }
        await prisma.workflowAction.create({
            data: {
                actionType: "CREATE_EDGE",
                causedById: userId,
                workflowId,
                detail,
            },
        })
        await prisma.workflowEdge.create({
            data: {
                workflowId,
                sourceNodeId: detail.sourceNodeId,
                targetNodeId: detail.targetNodeId,
            },
        })
    })
    connection.on("EDITOR_DELETE_EDGE", async (value) => {
        console.log("editor edge deleted:", value)

        const { workflowId, ...detail } = value

        // @ts-ignore
        const userId = socket.user.id

        if (!workflowIdsUserHasWriteAccessTo.includes(workflowId)) {

            console.error(`EDITOR_DELETE_EDGE operation failed because user "${userIdentifierUsedForLogin}" does not have write access to workflow "${workflowId}"`)

            return
        }

        await prisma.workflowAction.create({
            data: {
                actionType: "DELETE_EDGE",
                causedById: userId,
                workflowId,
                detail,
            },
        })
        await prisma.workflowEdge.delete({
            where: {
                id: detail.id,
            },
        })
    })
});

httpServer.listen(6000, () => {
    console.log('Real-time service listening on http://localhost:6000');
});
