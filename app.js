/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), url = require('url'), app = express(), util = require('util'), server = require('http').createServer(app), io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

const SCENE_NOCONNECT = 0;
const SCENE_CONNECT = 1;
const SCENE_A = 2;

var count = 0;
io.sockets.on('connection', function(socket) {
	console.log("cur user count : " + count);
	if (count > 2) {
		console.log("limit over");
		return;
	}
	count++;
	console.log("pre user count : " + count);
	socket.on('message', function(message) {
		console.log("message=" + message);
	});
	socket.on('touchEvent', function(message) {
		console.log(message.posX);
		console.log(message.posY);
	});
	socket.on('anything', function() {
	});
	socket.on('disconnect', function() {
		count--;
	});
});

