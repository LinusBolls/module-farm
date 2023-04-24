import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';

const app = express();


app.get("/health", (req, res) => {
    res.json({ ok: 1 })
})

const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
    path: '/socket',
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

httpServer.listen(6000, () => {
    console.log('Real-time service listening on http://localhost:6000');
});
