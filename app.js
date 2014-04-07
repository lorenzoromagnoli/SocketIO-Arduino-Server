
/**
 * Module dependencies.
 */


var express = require('express')
, routes = require('./routes')
, path = require('path')
, socketio=require('socket.io')
, http = require('http');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/coffelog');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/coffelog',routes.coffelog(db));


var server = app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
var io = socketio.listen(server);

var arduinos = {};

io.sockets.on("connection", function (socket) {
  socket.emit('cmd', { hello: 'world' });
	 
   socket.on('newCoffe', function (data) {
     console.log("A new coffe is being made");
		 
		 var d=new Date()
     var collection = db.get('coffes');
		 collection.insert({
			 "date": d
		 },function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                //res.location("userlist");
                // And forward to success page
                //res.redirect("userlist");
						}
       });
		 
   });
   socket.on('ciao', function (data) {
		 socket.emit('msg', { Ciao: 'ARDUINO' });
		 
   });
	 
});