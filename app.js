const AppName = 'Asterisk WebSocket 1.0.0 =';
const WebSocketServer = require('ws').Server;
const Https = require('https');
const File = require('fs');
const Url = require('url');
const Pi = require('./pillar.js');

const pkey = File.readFileSync('/etc/letsencrypt/live/test.galileu.space/privkey.pem');
const pcert = File.readFileSync('/etc/letsencrypt/live/test.galileu.space/fullchain.pem');

const wss = new WebSocketServer({
    server: Https.createServer({ key: pkey, cert: pcert }).listen(775)
});

var clientIncrement = 1;
var groups = [];

Https.createServer({ key: pkey, cert: pcert }, function (req, res) {
    const _url = Url.parse(req.url, true);

    if (_url.pathname == '/group/config/get') {
        if (_url.query.name == null) {
            res.write(JSON.stringify({ status: 'error', description: 'Parameter group not defined' }));
            res.end();
            return;
        }

        if (_url.query.name.length == 0) {
            res.write(JSON.stringify({ status: 'error', description: 'Parameter group not defined' }));
            res.end();
            return;
        }

        let group = groups[_url.query.name];
        if (group == null) {
            group = {};
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.write(JSON.stringify(group));
        res.end();

        return;
    }

    if (_url.pathname == '/clients/get') { 
        var clients = [];

        wss.clients.forEach(client => { 
            clients.push({
                id: client.id,
                name: client.name,
                group: client.group
            });
        });

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.write(JSON.stringify(clients));
        res.end();

        return;
    }

    res.write(AppName);
    res.end();
}).listen(8080);

wss.on('connection', function (client) {
    client.id = clientIncrement++;

    client.send(JSON.stringify({
        type: 'asterisk.initialize',
        clientId: client.id
    }));

    client.on('message', function (payload) {
        var message = JSON.parse(payload);

        if (message.type == 'asterisk.config') {
            if (message.group == null) return;

            groups[message.group] = Pi.Object.extend({}, message, groups[message.group]);
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

console.log(AppName);