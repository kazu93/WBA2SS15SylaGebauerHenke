/**
 * Created by havan on 28.08.2015.
 */
var port = process.env.PORT || 4000,
    app = require('./app').init(port),
    dirty = require('dirty');

// define the routes
app.get('*', function(req,res,next){
    // this is called for every GET request
});

/* home page route */
app.get('/', function(req,res){
    console.log("render home page");
});

/* contact form route */
app.post('/contact', function(req,res){
    console.log("post from contact form");
});

/* login routes */
app.get('/login', function(req,res){
    console.log("render login page");
});

app.post('/login', function(req,res){
    console.log("logging in");
});

app.get('/logout', function(req,res){
    console.log("logging out");
});

/* administration routes */
app.get('/admin', function(req,res){
    console.log("render admin page");
});

app.post('/admin/app', function(req,res){
    console.log("saving app settings");
});

app.post('/admin/page', function(req,res){
    console.log("saving page settings");
});

app.post('/admin/sections/:k', function(req,res){
    console.log("saving section");
});

app.del('/admin/sections/:k', function(req,res){
    console.log("deleting section");
});

app.post('/admin/sections', function(req,res){
    console.log("saving sections");
});

.
.

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs', locals);
});