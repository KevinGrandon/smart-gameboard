const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT || 3000
});

var pinio = new (require('pinio')).Pinio()

var numSensors = 8

var currValues = new Array(numSensors)

var lowestSensor = null

function getCurrentRegion() {
    var region = lowestSensor * 2

    var nextSensorIdx = lowestSensor + 1
    if (nextSensorIdx >= numSensors) nextSensorIdx = 0
    var nextSensorVal = currValues[nextSensorIdx]

    if (nextSensorVal < 200) region++

    return `${region + 1}<br>Lowest: (${lowestSensor})${currValues[lowestSensor]} Next:(${nextSensorIdx})${nextSensorVal}` // Account for 0-offset.
}

pinio.on('ready', function(board) {

    var sensors = [
        board.pins('A0'),
        board.pins('A1'),
        board.pins('A2'),
        board.pins('A3'),
        board.pins('A4'),
        board.pins('A5'),
        board.pins('A6'),
        board.pins('A7'),
    ]

    sensors.forEach((sensor, idx) => {
        sensor.read((val) => {
            currValues[idx] = val
        })    
    })

    setInterval(() => {
        for (var i = 0; i < currValues.length; i++) {
            if (lowestSensor === null || currValues[i] < currValues[lowestSensor]) {
                if (currValues[i] < 500) {
                    lowestSensor = i
                }
            }
        }
        console.log(currValues);
    }, 50)
})

// Add the route
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
        reply(`<html>
            <body>
                <h1>Spinner value: ${getCurrentRegion()}</h1>
                <script type="text/javascript">
                setTimeout(() => window.location.reload(), 200)
                </script>
            </body>
        </html>`);
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});