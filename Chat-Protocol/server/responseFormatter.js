/**
 * Formats a response message.
 * type: OK, ERROR, or MESSAGE.
 * responseFor: The command this response is for.
 * headers: Additional headers as an object.
 * body: Message body.
 * user (optional): For MESSAGE responses, the sender's username.
 */
export function formatResponse(type, responseFor, headers, body, user) {
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
