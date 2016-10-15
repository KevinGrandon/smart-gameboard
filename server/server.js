const Hapi = require('hapi');
const fetch = require('node-fetch');

const server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT
});

// Add the route
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
        fetch('https://api.spark.io/v1/devices/53ff70065067544858330687/spinnerValue/?access_token=' + process.env.ACCESS_TOKEN)
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            reply(`<html>
                <body>
                    <h1>Spinner value: ${json.result}</h1>
                    <script type="text/javascript">
                    setTimeout(() => window.location.reload(), 500)
                    </script>
                </body>
            </html>`);
        });
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});