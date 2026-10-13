import { formatResponse } from '../responseFormatter.js';

export function handleLeave(socket, message) {
    // TODO: implement LEAVE command (not implemented yet)
    socket.write(
        formatResponse('ERROR', 'LEAVE', { Error: 'Not implemented', 'Content-Length': 0 }, '')
    );
}
