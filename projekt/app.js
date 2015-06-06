var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var redis = require('redis');
var db = redis.createClient();
var app = express();


app.use(bodyParser.json()) // benutzt für jeden http request den body parser, wird mit eingebunden


app.post('/activity', function(req, res){
	var newActivity = req.body; // der body enthält das bereits geparste JSON Objekt
	db.incr('id:activity', function(err, rep){ //ID Counter für activity um eins erhöht
		newActivity.id = rep;  // die ID der neuen activity auf den wert des counters setzen
		db.set('activity:' + newActivity.id, JSON.stringify(newActivity), function(err, resp) {
			res.json(newActivity);
		});
	});
});


app.get('/activity/:id', function (req, res){ //pathparam ID
    db.get('activity:' + req.params.id, function(err, rep) {
        
        if (rep) {
            res.type('json').send(rep); // ist schon String, db weiß nicht dass es JSOn ist
        }
        else {
            res.status(404).type('text').send('Die Aktivität mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });
});


//überschreibt eine Ressource mit neuen Werten
app.put('/activity/:id', function (req, res){ 
    db.exists('activity:' + req.params.id, function(err, rep) {
        if (rep == 1){ //abfragen ob aktivity schon existiert
            var updatedActivity = req.body;
            updatedActivity.id = req.params.id;
            db.set('activity: ' + req.params.id, JSON.stringify(updatedActivity), function(err, rep){
                res.json(updatedActivity);
            });
        }
        else {
            res.status(404).type('text').send('Die Aktivität mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});


app.delete('/activity/:id', function (req, res){ 
    db.del('activity: ' + req.params.id, function(err, rep) {
        if (rep == 1) {
            res.status(200).type('text').send('OK');
        }
        else {
            res.status(404).type('text').send('Die Aktivität mit der ID ' + req.params.id + ' existiert nicht');
        }
    });
});
                


app.get('/activity', function (req, res){ 
    db.keys('activity:*', function(err, rep) { // alle keys holen die mit activity: beginnen
        
        var activities = []; // leeres Array um Activities zwischenzu speichern
        
        if (rep.length == 0) {
            res.json(activities);
            return;
        }
        
        db.mget(rep, function(err, rep) { //hole die lister aller activities auf einaml
            
            //Iteriere über das Antwortarray und füge die activites dem array hinzu
            rep.forEach(function(val){
                activities.push(JSON.parse(val));
            });
            
            //die eigenschaften rausfiltern die uns interessieren
            activities = activities.map(function(activity) {
                return { id: activity.id, ort: activity.ort};
            });
            
            res.json(activities);
        });
    });
});



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