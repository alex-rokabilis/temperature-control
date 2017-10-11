const express = require('express');
const ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const bodyParser = require('body-parser');
const app = express();
const sensor = require('./sensor')


app.use(bodyParser.json({
    type: 'application/json'
}));

app.use(express.static('public'));

app.get("/", function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

// Handle webhook requests
app.post('/', function (req, res, next) {

    // Instantiate a new API.AI assistant object.
    const assistant = new ApiAiAssistant({
        request: req,
        response: res
    });

    // Declare constants for your action and parameter names
    const WHAT_NEED_TO_KNOW_ACTION = 'tell.what_need_to_know'; // The action name from the API.AI intent
    const NEED_TO_KNOW_PARAMETER = 'need_to_know'; // An API.ai parameter name
    const FEELS_PARAMETER = 'feels'; // An API.ai parameter name
    const FEELING_PARAMETER = 'feeling'; // An API.ai parameter name

    // Create functions to handle intents here
    function tellWhatNeedToKnow(assistant) {

        let needToKnow = assistant.getArgument(NEED_TO_KNOW_PARAMETER);
        let feels = assistant.getArgument(FEELS_PARAMETER);
        let feelling = assistant.getArgument(FEELING_PARAMETER);

        if (needToKnow == 'temperature') {
            let speech = ''
            if (feels) {
                if (feelling == 'hot') speech += 'Yeah i feel hot too! Actually the ';
                else if (feelling == 'cold') speech += 'Brrr. There is chill in here! Actually the ';
            }
            sensor.read()
                .then(({
                    temperature,
                    humidity
                }) => {
                    speech += 'Temperature is ' + temperature + ' degrees celcius';
                    assistant.tell(speech);
                })


        } else if (needToKnow == 'humidity') {
            sensor.read()
            .then(({
                temperature,
                humidity
            }) => {
                assistant.tell('Humidity is ' + humidity + '%');
            })
        } else {
            assistant.tell('I am not sure what you want me to do!');
        }

    }

    // Add handler functions to the action router.
    let actionRouter = new Map();
    actionRouter.set(WHAT_NEED_TO_KNOW_ACTION, tellWhatNeedToKnow);
    assistant.handleRequest(actionRouter);
});

// Handle errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Listen for requests.
let server = app.listen(3001, function () {
    console.log('Your app is listening on port ' + server.address().port);
});