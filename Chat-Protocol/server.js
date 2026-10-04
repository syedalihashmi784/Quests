import net from 'node:net'; // for built in pacakages use :

const connectedClient = [];
// creating a server
const server = net.createServer((socket) => {
    //Tracking connected clients 
    connectedClient.push(socket);
    //steam total number of clients connected
    socket.write(`Total connected clients: ${connectedClient.length}\n`)
    socket.write("welcome to chat\n")

    // creating server event for data
    socket.on('data', (chunk) => {
        //chunks of msgs clients pass
        const message = chunk.toString().trim();
        //print each clients msg
        connectedClient.forEach((client) =>{
            client.write(`Client sys: ${message}\n`);

        })

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