var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var path = require('path');

var privateKey = fs.readFileSync(__dirname + '/certs/privkey.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/certs/fullchain.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// For http
// httpServer.listen(8080);
// For https
httpsServer.listen(9200);


app.use('/', (req, res, next) => {
    
    let keys = Object.keys(req.query);
    
    if (keys[0] == "frame") {
        // console.log("ha");
        express.static(path.join(__dirname, 'public'), {index:"index_frame.html"})(req, res, next);
    } else {
        express.static(path.join(__dirname, 'public'))(req, res, next);
    }
    
});




