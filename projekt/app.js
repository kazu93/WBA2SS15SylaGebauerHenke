var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');

var app = express();
var db = redis.createClient();
var jsonParser = body.Parser.json();

app.use(bodyParser.json());

app.use(function(err, req, res, next){
		console.error(err.stack);
		res.end(err.status + ' ' + err.massage);
	});
};

db.on('connect', function() { 
    console.log('connected');
});

// Aktivitaet abrufen
app.get('/aktivitaet/:id', function(req, res){
            db.get('aktivitaet'+req.params.id, function(err, rep){
                if(rep){
                    res.type('json').send(rep);
                }
                else{
                    res.status(404).type('text').send("Die Aktivitaet ist nicht vorhanden"); //noch anders lösen
                }
            });
   });

// Gruppe abrufen
app.get('/gruppen/:id', function(req, res){
            db.get('gruppen:'+req.params.id, function(err, rep){
                if(rep){
                    res.type('json').send(rep);
                }
                else{
                    res.status(404).type('text').send("Die Gruppe mit der ID " + req.params.id + "ist nicht vorhanden");
                }
            });
   });

// Gruppe hinzufügen
app.post('/gruppen', function(req, res){
    
    var newgruppe = req.body;
    
    db.incr('id:gruppen', function(err, rep){
        newgruppe.id = rep;
        db.set('gruppen:'+ newgruppe.id, JSON.stringify(newgruppe),function(err, rep){
			res.type('json').send(newgruppe).end();
		});
    });

});


// Gruppe löschen
app.delete('/gruppen/:id', function(req, res){
    db.exists('gruppen:'+req.params.id, function(err, rep){
        if(rep === 1){
            db.del('gruppen:'+req.params.id,function(err, rep){
                var temp = JSON.parse(rep);
                    res.send(temp).end();
            });
        }
        else{
            res.status(404).send("Gruppe nich vorhanden!").end();   
        }
    });
});

//  Maximale Größe einer Gruppe abrufen
app.get('/gruppen/:id/maxgroesse', function(req, res){ 
   db.exists('gruppen:' + req.params.id, function(err, rep){
       if(rep === 1){
            db.get('gruppen:'+req.params.id+'/maxgroesse', function(err, rep){
                if(rep){
                    var temp = JSON.parse(rep);
                    res.send(temp).end();
                }
                else{
                    res.status(404).type('text').send("Maximale Größe der Gruppe nicht vorhanden");
                }
            });
       }
       else {
            res.status(404).type('text').send("Die Gruppe mit der ID " + req.params.id + " ist nicht vorhanden");
       }
   });
});

// Maximale Größe der Gruppe anlegen
app.post('/gruppen/:id/maxgroesse', function(req, res){
	var newmaxgroesse = req.body;
	db.get('gruppen:'+req.params.id, function(err, rep){
       if(rep){
		   db.set('gruppen:'+req.params.id+'/maxgroesse', JSON.stringify(newmaxgroesse),function(err, rep){
			res.type('json').send(newmaxgroesse).end();
		});
       }
       else{
           res.status(404).type('text').send("Die Gruppe mit der ID " + req.params.id + " ist nicht vorhanden");
       }
   });

});

app.listen(3000);