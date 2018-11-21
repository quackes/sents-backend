let express = require('express'),
    expressWs = require('express-ws')
    morgan = require('morgan');

let app = express()


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 9000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.get('/',(req, res)=>{
    res.send('works')
})

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;