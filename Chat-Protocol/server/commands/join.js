import { formatResponse } from '../responseFormatter.js';
import { broadCast } from '../broadcast.js';

export function handleJoin(socket, message) {
    //if user is already joined
    if (socket.joined) {
        return socket.write(
            formatResponse(
                'ERROR',
                'JOINED',
                { Error: `Client: ${socket.username} already joined to server`, 'Content-Length': 0 },
                ''
            )
        );
    }
    socket.joined = true;
    //broadcast to other clients
    broadCast(socket, formatResponse(
        'MESSAGE',
        'JOIN',
        { 'content-length': 28 },
        `New User has joined the chat`,
        socket.username
    ));
    //confirm to client
    socket.write(formatResponse('OK', 'JOIN', { 'content-length': 0 }, ''));
}
