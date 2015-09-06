
var express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var ejs = require("ejs");
var fs = require("fs");
var http = require("http");

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.get("/css/:stylesheetname", function (req, res, next) {
    var options = {
        root: __dirname + "/css/",
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
        }
    };
    var fileName = req.params.stylesheetname;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            //console.log('Sent:', fileName);
        }
    });

});

app.get("/pic/:picname", function (req, res, next) {

    var options = {
        root: __dirname + "/pic/",
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
        }
    };

    var fileName = req.params.picname;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            // console.log('Sent:', fileName);
        }
    });

});

app.get("/js/:jsname", function (req, res, next) {

    var options = {
        root: __dirname + "/js/",
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
        }
    };

    var fileName = req.params.jsname;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            //console.log('Sent:'+ fileName);
        }
    });

});



app.get('/', jsonParser, function(req,res){
    fs.readFile('./views/index.ejs', {encoding: 'utf-8'}, function(err, filestring){
        if(err){
            throw err;
        }
        else{
            var options = {
                host: 'localhost',
                port: 3000,
                path: '/',
                method: 'GET',
                headers: {
                    accept: 'text/html'
                }
            }

            var externalRequest = http.request(options, function(externalResponse){
                console.log('connected');
                externalResponse.on('data', function(chunk){

                    var userdata = JSON.parse(chunk);
                    console.log(userdata);
                    var html = ejs.render(filestring, userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    res.write(html);
                    res.end();
                });
            });

            externalRequest.end();
        }
    });
});



app.post('/redirect', function(req,res){
    res.setHeader("content-type", "text/html");
    res.render("filterergebnis.ejs");
});



app.get('/new', function(req,res){
    res.setHeader("content-type", "text/html");
    res.render("neueGruppe.ejs");
});

app.get('/redirect/:jsondata', function(req,res){
var jsonData = JSON.parse(req.params.jsondata);
    console.log(jsonData);
    res.render('filterergebnis.ejs', {"dataJson" : jsonData});
});

app.post('/new', jsonParser, function(req,res){
    var test = JSON.stringify(req.body);
    fs.readFile('./views/neueGruppe.ejs', {encoding: 'utf-8'}, function(err, filestring){
        if(err){
            throw err;
        }
        else{
            var options = {
                host: 'localhost',
                port: 3000,
                path: '/new',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': test.length
                }
            }

            var req = http.request(options, function(response) {
                response.on('data', function (chunk) {
                    var userdata = JSON.parse(chunk);
                    console.log(userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    console.log(JSON.stringify(userdata));
                    res.write(JSON.stringify(userdata));
                    res.end();
                });
            });

            req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
            });
        console.log(test);
// write data to request body
            req.write(test);
            req.end();
        }
    });
});


app.post('/search', jsonParser, function(req,res){
    var test = JSON.stringify(req.body);
    fs.readFile('./views/filterergebnis.ejs', {encoding: 'utf-8'}, function(err, filestring){
        if(err){
            throw err;
        }
        else{
            var options = {
                host: 'localhost',
                port: 3000,
                path: '/search',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': test.length
                }
            }

            var req = http.request(options, function(response) {
                response.on('data', function (chunk) {
                    var userdata = JSON.parse(chunk);
                    console.log(userdata);
                    res.setHeader('content-type', 'text/html');
                    res.writeHead(200);
                    console.log(JSON.stringify(userdata));
                    res.write(JSON.stringify(userdata));
                    res.end();
                });
            });

            req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
            });

// write data to request body
            console.log(typeof test);
            req.write(test);
            req.end();
        }
    });
});



app.listen(3001, function(){
    console.log("Nutzer ist auf Port 3001");
});