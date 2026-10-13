export function parseMessage(data) {
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
    for (let i = 1; i < headerLine.length; i++) {
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
    return { protocolVersion, command, header, body };
}
