const app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs'),
    ip = require("ip"),
    sensor = require('./sensor'),
    DialogflowApp = require('actions-on-google').DialogflowApp;

app.listen(3001, () => console.log(`listening on http://localhost:3001`))


function handler(req, res) {

    if (req.url == '/') {
        fs.readFile(__dirname + '/index.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }

                res.writeHead(200);
                res.end(data);
            });
    } else {

        const app = new DialogflowApp({
            request: req,
            response: res
        });

        const actionMap = new Map();
        actionMap.set('tell.what_need_to_know', function numberIntent(app) {
            const number = app.getArgument("need_to_know");
            app.tell('You said ' + number);
        });
        app.handleRequest(actionMap);
    }

}


setInterval(() => {
    sensor.read()
        .then(({
            temperature,
            humidity
        }) => {
            io.of('/').emit('temperature', temperature);
            io.of('/').emit('humidity', humidity);
        })
}, 1000)