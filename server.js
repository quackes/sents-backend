let express = require('express'),
    expressWs = require('express-ws'),
    bodyParser = require('body-parser'),
    fs = require('fs')
    morgan = require('morgan');

let app = express()

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
}

app.get('/',(req, res)=>{
    res.send('works')
});


app.put('/storage', (req, res) => {
    data =  req.body
    fs.writeFileSync(filename, JSON.stringify(data));
    res.send(201);
});

app.get('/storage', (req, res) => {
    res.send(data)
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;