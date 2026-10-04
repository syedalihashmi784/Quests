// promise-based APIs in nodejs
import * as readline from 'node:readline/promises';
import net from 'node:net';

const HOST = 'localhost';
const PORT = 1337;


async function startChat(){

    //creating user interface 
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout,
        prompt: '>'
    });
    //Testing interface
    // const answer = await rl.question("How are you?")
    // console.log('ANS:', answer);

    //Open TCP connection 
    const client = net.createConnection(
        {
            port: PORT,
            host: HOST,
        },
        ()=>{
            console.log("Connected to the server");
        }
    );
    //event listener 
    client.on('data', (data)=>{
        console.log("Received: ", data.toString())
    })

}

//call function 
startChat()