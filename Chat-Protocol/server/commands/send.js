import { formatResponse } from '../responseFormatter.js';

export function handleSend(socket, message) {
    // TODO: implement SEND command (not implemented yet)
    socket.write(
        formatResponse('ERROR', 'SEND', { Error: 'Not implemented', 'Content-Length': 0 }, '')
    );
}
