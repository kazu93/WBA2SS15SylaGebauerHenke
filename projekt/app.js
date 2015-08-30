<<<<<<< HEAD
var express = require('express'),
 engine = require('ejs-locals'),
 app = express();

 exports.init = function(port) {

	app.locals({
		_layoutFile:'layout.ejs'
	})

	app.configure(function(){
		app.set('views', __dirname + '/views');
		app.set('view engine', 'ejs');
		app.use(express.static(__dirname + '/static'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.cookieSession({cookie:{path:'/',httpOnly:true,maxAge:null},secret:'skeletor'}));
		app.use(app.router);
		app.enable("jsonp callback");
	});

	app.engine('ejs', engine);

	app.configure('development', function(){
	   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
	   app.use(express.errorHandler());
	});

	app.use(function(err, req, res, next){
	   res.render('500.ejs', { locals: { error: err },status: 500 });
	});

	server = app.listen(port);
	console.log("Listening on port %d in %s mode", server.address().port, app.settings.env);

	return app;
	}

app.use(express.cookieParser());
app.use(express.cookieSession({cookie:{path:'/',httpOnly:true,maxAge:null},secret:'skeletor'}));

app.use(express.static(__dirname + '/static'));
=======
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
>>>>>>> origin/master
