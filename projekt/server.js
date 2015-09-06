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
console.log("Server listen on Port: " + 3000);

var data = {users:
[
    {id: 1, name: "Peter"},
    {id: 2, name: "Jessica"}
]}
rest.get('/', function(req, res){

    db.hgetall("bla:1", function(err, data){
        res.json(data);
    });

});


rest.post("/new", jsonParser, function(req,res){

    var data = {users:
        [
            {id: 1, name: "Peter"},
            {id: 2, name: "Jessica"}
        ]}


    console.log(req);
    res.json(data);


});

rest.post("/search", jsonParser, function(req, res){
    var active = req.body.activity;
    var ort = req.body.ort;
    console.log(ort);
    var dataJson = {Gruppen:[
    ]},requests = 20;

    for(var i = 1; i < requests; i++){
        multi.hgetall("gruppe:"+i);
    }
    multi.exec(function (err, replies) {

        for(var i = 0; i < replies.length; i++){
            if(replies[i] !== null){
                dataJson.Gruppen.push(replies[i]);
            }
        }

        for(var i = 0; i < dataJson.Gruppen.length; i++){
            if((dataJson.Gruppen[i].ort == ort) && (dataJson.Gruppen[i].activity != active)
            || (dataJson.Gruppen[i].ort != ort) && (dataJson.Gruppen[i].activity == active)){
                delete dataJson.Gruppen[i];
            }
        }



        var da = JSON.stringify(dataJson);
        da = da.replace(/null,/g, "");
        if(da.match(",null")) da = da.replace(/,null/g, "");
        dataJson = JSON.parse(da);

        res.json(dataJson);
    });
});

rest.listen(3000);