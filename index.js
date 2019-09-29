var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 7788
var WEB_BROWSER = 'web_browser';
var ROBOT = 'robot';
var INIT_MESSAGE = 'init_message';
var web_browser_socket;
var robot_socket;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

console.log("HTTP server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("Websocket server created");

wss.on("connection", function(ws) {
	// console.log(ws);
	console.log("A client connected to websocket server");

  ws.on("message", function incoming(data) {
	console.log('json object', data);
	message = JSON.parse(data);
	if (message.from === WEB_BROWSER && message.body === INIT_MESSAGE) {
		web_browser_socket = ws;
		return;
	}
	if (message.from === ROBOT && message.body === INIT_MESSAGE) {
		robot_socket = ws;
		return;
	}

	if (message.from === ROBOT) {
		// console.log(message.body);
		if (web_browser_socket !== undefined) web_browser_socket.send(message.body);
		else console.log (WEB_BROWSER + ' is not connected');
	}
	if (message.from === WEB_BROWSER) {
		if (robot_socket !== undefined) robot_socket.send(message.body);
		else console.log (ROBOT + ' is not connected');
	}
  });

  console.log("Websocket connection is opened");

  ws.on("close", function() {
    console.log("Websocket connection is closed");
  })
})
