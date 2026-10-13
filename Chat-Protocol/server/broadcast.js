export const connectedClient = [];

export function broadCast(socket, message) {
    connectedClient.forEach((client) => {
        if (client.authenticated && client.joined && client != socket) {
            client.write(message);
        }
    });
}
