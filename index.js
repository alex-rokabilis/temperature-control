const app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs'),
    ip = require("ip"),
    sensor = require('./sensor'),
    DialogflowApp = require('actions-on-google').DialogflowApp;

app.listen(3001, () => console.log(`listening on http://localhost:3001`))


function handler(req, res) {

    if (req.method == 'POST') {
        
        
        const app = new DialogflowApp({request: req, response: res});
        const NAME_ACTION = 'tell.what_need_to_know';
        const COLOR_ARGUMENT = 'need_to_know';
        
        function makeName (app) {
          const color = app.getArgument(COLOR_ARGUMENT);
          app.tell('Alright, your silly name is ' + color + ' hope you like it. See you next time.');
        }
        
        const actionMap = new Map();
        actionMap.set(NAME_ACTION, makeName);
        app.handleRequest(actionMap);
        
        
    } else {

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