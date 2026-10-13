import { formatResponse } from '../responseFormatter.js';

export function handleAuth(socket, message) {
    const user = message.header['User'];
    const token = message.header['Token'];
    if (user && token && token == 'secret123') {
        socket.authenticated = true;
        socket.username = user;
        socket.write(formatResponse(
            'OK',
            'Auth',
            { 'content-length': 0 },
            ''));
        console.log(`User ${user} authenticated successfully.`);
    } else {
        socket.write(
            formatResponse(
                'ERROR',
                'AUTH',
                { Error: 'Authentication failed', 'Content-Length': 0 },
                ''
            )
        );
        console.log(`Authentication failed for user ${user || 'unknown'}.`);
        socket.end();
    }
}
