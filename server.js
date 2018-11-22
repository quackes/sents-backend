let express = require('express'),
    expressWs = require('express-ws'),
    bodyParser = require('body-parser'),
    cors = require('cors')
    fs = require('fs')
    morgan = require('morgan');

let app = express()
expressWs(app)

app.use(cors())
app.use(bodyParser.json())

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 9000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

let data = null;

let storagePath = process.env.STORAGE_PATH || './'
let filename = storagePath + 'data.json'

if(fs.existsSync(filename)){
    let dataString = fs.readFileSync(filename, 'utf8');
    if (dataString) {
        data = JSON.parse(dataString);
    }
}else{
    data = require('./data_default.json')
}

app.get('/',(req, res)=>{
    res.send('works')
});


app.put('/storage', (req, res) => {
    data =  req.body
    fs.writeFileSync(filename, JSON.stringify(data));
    res.json( data);
    wsBroadcast();
});

app.get('/storage', (req, res) => {
    res.json( data);
});

let wsSessions = []

app.ws('/storage', function(ws, req) {
    ws.on('open',() => {
        ws.send(JSON.stringify(data))
    });
    wsSessions.push(ws)

    ws.on('close', () => {
        console.log('closed')
         wsSessions.splice(wsSessions.indexOf(ws))
    })
});

app.get('/triggerbroadcast',() =>{
    wsBroadcast();
});

function wsBroadcast(){
    setTimeout(()=> {
       wsSessions.forEach((ws) => ws.send(JSON.stringify(data)));
    },1)
}

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;