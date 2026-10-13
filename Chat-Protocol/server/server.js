import net from 'node:net';
import { parseMessage } from './messageParser.js';
import { formatResponse } from './responseFormatter.js';
import { connectedClient } from './broadcast.js';
import { handleAuth } from './commands/auth.js';
import { handleJoin } from './commands/join.js';
import { handleSend } from './commands/send.js';
import { handleLeave } from './commands/leave.js';

// creating a server
const server = net.createServer((socket) => {
    // set socket properties
    socket.setEncoding('utf-8');
    socket.authenticated = false;
    socket.joined = false;
    socket.username = '';

    connectedClient.push(socket);

    socket.write(`Total connected clients: ${connectedClient.length}\n`)
    socket.write("welcome to chat \r\n")

    // creating server event for data
    socket.on('data', (chunk) => {
        const message = parseMessage(chunk);
        if (!message) {
            console.error('no message parsed');
        }
        handleMessage(socket, message);
    });

    socket.on('close', () => {
        //remove closed client from list
        const index = connectedClient.indexOf(socket);
        if (index !== -1) connectedClient.splice(index, 1);
        console.log(`Total connected clients are: ${connectedClient.length}`)
        //update each client updated number of clients
        connectedClient.forEach((client) => {
            client.write(`Total connected clients are: ${connectedClient.length}\n`);
        })
    });

    //error handling on server
    socket.on('error', (err) => {
        console.log('error: ', err)
    });
});

server.listen(1337, () => {
    console.log('Server listening on port 1337');
});

function handleMessage(socket, message) {
    if (socket.authenticated || message.command == 'AUTH') {
        switch (message.command) {
            case 'AUTH':
                handleAuth(socket, message);
                break;
            case 'JOIN':
                handleJoin(socket, message);
                break;
            case 'SEND':
                handleSend(socket, message);
                break;
            case 'LEAVE':
                handleLeave(socket, message);
                break;
            default:
                //if none of the above case then error
                socket.write(
                    formatResponse(
                        'ERROR',
                        message.command,
                        { Error: 'Unknown command', 'Content-Length': 0 },
                        ''
                    )
                );
        }
    }
};
