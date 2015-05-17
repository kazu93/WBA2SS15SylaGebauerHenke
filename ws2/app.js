var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


var app = express();


//Entität (Ressource) activities
var activity = [
    {title: "Klettern"},
    {"grupengroesse": 8},
    {"ort": "Route 1"}
]

var news = [
	{title: "weather"}
]

app.get('/activity', function(req, res) {
    res.status(200).json(activity);
});


app.post('/activity', jsonParser, function(req, res){
	//vorausgesetzt das im req json übergeben wird
	activity.push(req.body);
    res.type('plain').send('Added new activity'); //header wird auf bestimmten content type gesetzt
});


app.get('/news', function(req, res) {
    res.status(200).json(news);
});

app.listen(3000); // Anlegen eines Webservers 