const WebSocketServer = require('ws').Server;
const https = require('https');
const fs = require('fs');

const pkey  = fs.readFileSync('/etc/letsencrypt/live/test.galileu.space/privkey.pem');
const pcert = fs.readFileSync('/etc/letsencrypt/live/test.galileu.space/fullchain.pem');

const wss = new WebSocketServer({
    server: https.createServer({ key: pkey, cert: pcert }).listen(775)
});

// const wss = new WebSocketServer({
//     port: 775
// });

var clientIncrement = 1;

wss.on('connection', function (client) {
    client.id = clientIncrement++;

    client.send(JSON.stringify({
        type: 'asterisk.initialize',
        id: client.id
    }));

    client.on('message', function (payload) {
        var message = JSON.parse(payload);

        if (message.type == 'asterisk.entergroup') {
            client.group = message.groupName;
            onecast({
                type: 'asterisk.entergroup',
                group: client.group,
                from: client.id
            }, client);
        } else if (message.type == 'asterisk.leavegroup') {
            client.group = null;
            onecast({
                type: 'asterisk.leavegroup',
                group: client.group,
                from: client.id
            }, client);
        } else if (message.type == 'asterisk.broadcast') {
            broadcast(message, client);
        } else if (message.type == 'asterisk.onecast') {
            onecast(message, client);
        } else if (message.type == 'asterisk.unicast') {
            unicast(message, client);
        }
    });

    client.on('close', function () {
        if (client.group) {
            onecast({
                type: 'asterisk.client.disconnected',
                group: client.group,
                from: client.id,
            }, client);
        } else {
            broadcast({
                type: 'asterisk.client.disconnected',
                from: client.id,
            }, client);
        }
    });

});

function broadcast(message, current) {
    wss.clients.forEach(client => {
        if (client.id == current.id) return;
        sendMessage(message, client);
    })
}

function onecast(message, current) {
    wss.clients.forEach(client => {
        if (client.id == current.id) return;
        if (client.group == message.group) {
            sendMessage(message, client);
        }
    });
}

function unicast(message, current) {
    wss.clients.forEach(client => {
        if (client.id == current.id) return;
        if (client.id == message.to) {
            sendMessage(message, client);
        }
    });
}

function sendMessage(message, client) {
    if (client.readyState != client.OPEN) return;
    client.send(JSON.stringify(message));
}

console.log('Asterisk WebSocket 1.0.0 =');