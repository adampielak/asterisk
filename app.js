const appName = 'Asterisk WebSocket 1.0.0 =';
const WebSocketServer = require('ws').Server;
const https = require('https');
const fs = require('fs');

const pkey = fs.readFileSync('/etc/letsencrypt/live/test.galileu.space/privkey.pem');
const pcert = fs.readFileSync('/etc/letsencrypt/live/test.galileu.space/fullchain.pem');

const wss = new WebSocketServer({
    server: https.createServer({ key: pkey, cert: pcert }).listen(775)
});

var clientIncrement = 1;
var groups = [];

https.createServer({ key: pkey, cert: pcert }).createServer(function (req, res) {
    const query = url.parse(req.url, true);

    if (query.pathname == '/group/config') {
        if (q.group == null) {
            res.write(JSON.stringify({ status: 'error', description: 'Parameter group not defined' }));
            res.end();
            return;
        }

        if (q.group.length == 0) {
            res.write(JSON.stringify({ status: 'error', description: 'Parameter group not defined' }));
            res.end();
            return;
        }

        res.write(JSON.stringify(groups[q.group]));
        res.end(appName);
    }

    res.write('');
    res.end();
}).listen(8080);

// const wss = new WebSocketServer({
//     port: 775
// });

wss.on('connection', function (client) {
    client.id = clientIncrement++;

    client.send(JSON.stringify({
        type: 'asterisk.initialize',
        clientId: client.id
    }));

    client.on('message', function (payload) {
        var message = JSON.parse(payload);

        if (message.type == 'asterisk.config') {
            groups[client.group] = message;
        } else if (message.type == 'asterisk.entergroup') {
            client.group = message.groupName;

            onecast({
                type: 'asterisk.entergroup',
                group: client.group,
                from: client.id
            }, client.group, client);

        } else if (message.type == 'asterisk.leavegroup') {
            const group = client.group;
            client.group = null;

            onecast({
                type: 'asterisk.leavegroup',
                group: group,
                from: client.id
            }, group, client);

        } else if (message.type == 'asterisk.broadcast') {
            broadcast(message, client);
        } else if (message.type == 'asterisk.onecast') {
            onecast(message, message.group, client);
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
            }, client.group, client);
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

function onecast(message, group, current) {
    if (group == null) return;

    wss.clients.forEach(client => {
        if (client.id == current.id) return;
        if (client.group == group) {
            sendMessage(message, client);
        }
    });
}

function unicast(message, current = null) {
    wss.clients.forEach(client => {
        if (current != null && client.id == current.id) return;
        if (client.id == message.to) {
            sendMessage(message, client);
        }
    });
}

function sendMessage(message, client) {
    if (client.readyState != client.OPEN) return;
    client.send(JSON.stringify(message));
}

console.log(appName);