import 'reflect-metadata';
import { Server } from 'ws';

const wss = new Server({ port: 8080 });

wss.on('connection', (ws: { on: (arg0: string, arg1: (message: any) => void) => void; send: (arg0: string) => void; }) => {
    console.log('Client connected');
    ws.on('message', (message: any) => {
        console.log('received:', message);
    });

    setInterval(() => {
        ws.send(JSON.stringify({ update: 'New data from server' }));
    }, 5000);
});
