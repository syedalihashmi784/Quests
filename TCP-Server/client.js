import net from 'node:net';

// connect to server 
const socket = net.connect(1337, 'localhost', ()=>{
    console.log('connected to server')
});
// receive msg from server
socket.on('data', (chunck)=>{
    //event listener: data, chunk buffer of raw bytes
    //print without adding line server already adds \n
    process.stdout.write(chunck.toString()) 

});
//Send data to server 
process.stdin.on('data', (line)=>{
    socket.write(line);
});
//handle servers going away
socket.on('close', ()=>{
    console.log('Disconnected from server');
    process.exit(0);
});

socket.on('error', (err)=>{
    console.log('error: ', err)
})