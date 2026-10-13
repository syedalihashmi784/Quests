import net from 'node:net'; // for built in pacakages use :
import { format } from 'node:path';

const connectedClient = [];
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
        if (!message){
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
        connectedClient.forEach((client) =>{
            client.write(`Total connected clients are: ${connectedClient.length}\n`);

        })
    });

    //error handling on server
    socket.on('error', (err)=>{
        console.log('error: ', err)
    });

});

server.listen(1337, () => {
    console.log('Server listening on port 1337');
});



function parseMessage(data){
    // from: ["CHAT/1.0 Auth", "User:ali", "Token:hihi", "content-length:0"]
    // to: header = { User: "ali", Token: "hihi", "content-length": "0" }
    //seprate headers and body
    const parts = data.split('\r\n\r\n');
    if (parts.length < 2) return null;


    const headerPart = parts[0];
    const body = parts.slice(1).join('\r\n\r\n');
    //seprate each header line into array
    const headerLine = headerPart.split('\r\n');
    if (headerLine.length === 0) return null;
    
    const firstLineHeader = headerLine[0].split(' ');
    // CHAT/1.0 AUTH
    const protocolVersion = firstLineHeader[0];
    const command = firstLineHeader[1];

    const header = {};
    // header starts after fist line
    for(let i=1; i < headerLine.length; i++){
        //get each ine 
        const line = headerLine[i];
        // destructure each line
        const [key, value] = line.split(':');
        header[key.trim()] = value.trim(':');

    }

    const contentLength = parseInt(header['content-length'], 10) || 0;
    // Optionally, check that body length matches Content-Length.
    if (body.length !== contentLength) {
        console.warn(
            `Warning: body length (${body.length}) does not match Content-Length (${contentLength}).`
        );
    }
    //constructs an actual object — { protocolVersion: 'CHAT/1.0', command: 'Auth', header: {...}, body: '' }
    return {protocolVersion, command, header, body};
}

function handleMessage(socket, message){
    switch(message.command){
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
};

function handleAuth(socket, message){
   const user = message.header['User'];
   const token = message.header['Token'];
    if ( user && token && token == 'secret123'){
        socket.authenticated = true;
        socket.username = user;
        socket.write(formatResponse(
            'OK', 
            'Auth', 
            {'content-length':0}, 
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
    };

}

/**
 * Formats a response message.
 * type: OK, ERROR, or MESSAGE.
 * responseFor: The command this response is for.
 * headers: Additional headers as an object.
 * body: Message body.
 * user (optional): For MESSAGE responses, the sender's username.
 */
function formatResponse(type, responseFor, headers, body, user) {
    let startLine = `CHAT/1.0 ${type}`;
    const headerLines = [];
    headerLines.push(`Response-For: ${responseFor}`);
    if (user && type === 'MESSAGE') {
        headerLines.push(`User: ${user}`);
    }
    for (const key in headers) {
        headerLines.push(`${key}: ${headers[key]}`);
    }
    return `${startLine}\r\n${headerLines.join('\r\n')}\r\n\r\n${body}`;
}
