const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT
});

var pinio = new (require('pinio')).Pinio()

var lowestSensor = null

function getCurrentRegion() {
    return lowestSensor + 1
}

pinio.on('ready', function(board) {

    var sensors = [
        board.pins('A0'),
        board.pins('A1'),
        board.pins('A2'),
        board.pins('A3')
    ]

    var currValues = new Array(4)

    sensors.forEach((sensor, idx) => {
        sensor.read((val) => {
            currValues[idx] = val
        })    
    })

    setInterval(() => {
        for (var i = 0; i < currValues.length; i++) {
            if (lowestSensor === null || currValues[i] < currValues[lowestSensor]) {
                lowestSensor = i
            }
        }
    }, 100)
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
                setTimeout(() => window.location.reload(), 500)
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