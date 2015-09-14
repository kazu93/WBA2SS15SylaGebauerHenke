express = require("express");
var redis = require("redis");
var db = redis.createClient();
var multi = db.multi();
var rest =  express();


var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

rest.set('view engine', 'ejs');

rest.use(bodyParser.urlencoded({
    extended: true
}));

rest.get('/', function(req, res){

    res.send("Ok");

});


rest.post("/new", jsonParser, function(req,res){

        var profi;

        if(req.body.schwierigkeit == "Profis") profi = true;
        else profi = false;

        db.KEYS("gruppe:*", function(err, resp){

           db.hmset("gruppe:"+(resp.length+1), "ort", req.body.ort, "activity", req.body.activity,
                        "datum", req.body.datum, "teilnehmerzahl", 2, "schwierigkeitsgrad", req.body.schwierigkeit,
                        "startzeit", req.body.time, "treffpunkt", req.body.treffpunkt, "profi", profi,
                        "dauer", req.body.dauer, "frei", req.body.teilnehmerzahl,
                        function(error, response){

                        res.json(response);
                    });
        });
});

rest.post("/login", jsonParser, function(req, res){


    var dataJson = {users:
        [

        ]}

    db.KEYS("user:*", function(err,resp){

        for (var i = 1; i <= resp.length; i++) {
            multi.hgetall("user:" + i);
        }

        multi.exec(function (err, replies) {

            console.log(replies);
            console.log(dataJson.users.length);

            for (var i = 0; i < replies.length; i++) {
                if (replies[i] !== null) {
                    dataJson.users.push(replies[i]);
                }
            }

            for (var i = 0; i < dataJson.users.length; i++) {
                if (dataJson.users[i].username != req.body.username && dataJson.users[i].passwd != req.body.passwd) {
                    delete dataJson.users[i];
                }
            }

            var da = JSON.stringify(dataJson);
            da = da.replace(/null,/g, "");
            if (da.match(",null")) da = da.replace(/,null/g, "");
            dataJson = JSON.parse(da);

            res.json(dataJson);

    });

});


});



rest.post("/search", jsonParser, function(req, res){
    var active = req.body.activity;
    var ort = req.body.ort;
    var datum = req.body.datum;
    console.log(ort);
    var dataJson = {Gruppen:[
    ]}
    var allData;

    db.KEYS("gruppe:*", function(err, resp) {
        for (var i = 1; i <= resp.length; i++) {
            multi.hgetall("gruppe:" + i);
        }
        multi.exec(function (err, replies) {

            for (var i = 0; i < replies.length; i++) {
                    dataJson.Gruppen.push(replies[i]);

            }

            if(ort == "Nationalpark" && active == "Aktivitaet" && datum == "") res.json(dataJson);
            else {
                for (var i = 0; i < dataJson.Gruppen.length; i++) {
                    if (dataJson.Gruppen[i].ort != ort && ort != "Nationalpark") {
                        delete dataJson.Gruppen[i];
                    }
                }

                var da = JSON.stringify(dataJson);
                da = da.replace(/null,/g, "");
                if (da.match(",null")) da = da.replace(/,null/g, "");
                dataJson = JSON.parse(da);

                if(dataJson.Gruppen[0] == null) res.send("0");
                else{
                    for (var i = 0; i < dataJson.Gruppen.length; i++) {
                        if (dataJson.Gruppen[i].activity != active && active != "Aktivitaet") {
                            delete dataJson.Gruppen[i];
                        }
                    }

                    var da = JSON.stringify(dataJson);
                    da = da.replace(/null,/g, "");
                    if (da.match(",null")) da = da.replace(/,null/g, "");
                    dataJson = JSON.parse(da);

                    if(dataJson.Gruppen[0] == null) res.send("0");
                    else{
                        console.log(dataJson);
                        for (var i = 0; i < dataJson.Gruppen.length; i++) {
                            if (dataJson.Gruppen[i].datum != datum && datum != "") {
                                delete dataJson.Gruppen[i];
                            }
                        }

                        var da = JSON.stringify(dataJson);
                        da = da.replace(/null,/g, "");
                        if (da.match(",null")) da = da.replace(/,null/g, "");
                        dataJson = JSON.parse(da);



                        if(dataJson.Gruppen[0] == null) res.send("0");
                        else res.json(dataJson);
                    }
                }
            }

        });
    });
});

console.log("Server listen on Port: " + 3000);
rest.listen(3000);