const app = require('http').createServer(handler),
 io = require('socket.io')(app),
 fs = require('fs'),
 ip = require("ip"),
 sensor = require('./sensor');

app.listen(3001, ip.address(), () => console.log(`listening on http://${ip.address()}:3001`))


function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}


setInterval(() => {
    sensor.read()
        .then(({temperature,humidity}) =>{
            io.of('/').emit('temperature', temperature);
            io.of('/').emit('humidity', humidity);
            io.sockets.emit('temperature',)
        })
},1000)