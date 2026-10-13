// promise-based APIs in nodejs
import * as readline from 'node:readline';
import * as readlinePromises from 'node:readline/promises';

import net from 'node:net';

const HOST = 'localhost';
const PORT = 1337;


async function startChat(){

    //creating user interface 
    const rl = readlinePromises.createInterface({ 
        input: process.stdin, 
        output: process.stdout,
        prompt: '>'
    });

    //Open TCP connection 
    const client = await new Promise((resolve,reject) =>{
        //capture the sockect to return value 
        const sock = net.createConnection( 
        {
            port: PORT,
            host: HOST,
        },
        ()=>{
            console.log("Connected to the server");
            //resolve the socket 
            resolve(sock);
        });
        sock.on('error', reject);
    });

    
    //event listener 
    client.on('data', (data) => {
        //avoids race condition between server and client 
        readline.clearLine(process.stdout, 0);   // 1
        readline.cursorTo(process.stdout, 0);    // 2
        console.log(data.toString().trim());     // 3
        rl.prompt(true);                         // 4
    });


    // Get username 
    const username = await rl.question('Enter username: ');
    // Get Token
    const token = await rl.question('Enter Token: ');

    //build Auth command 
    const authCommand = buildCommand(
        'AUTH',
        {User:username, Token:token, 'content-length':0},
        ''
    )
    client.write(authCommand);
    console.log(authCommand);

}


function buildCommand(command, headers, body){
    // CHAT/1.0 AUTH
    // User: alice
    // Token: secret123
    // Content-Length: 0
    const startline = `CHAT/1.0 ${command}`;
    const headerline = [];
    for( const key in headers){
        //{users: '', token: ''}
        const header = `${key}:${headers[key]}`;
        headerline.push(header);
        
    }
    return `${startline}\r\n${headerline.join('\r\n')}\r\n\r\n${body}`
}

//call function 
startChat()