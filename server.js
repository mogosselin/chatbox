var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [
  {author: "Author 1", text: "Default text 1"},
  {author: "Author 2", text: "Default text 2"}
];

var headerJson = {
	"Content-Type": "application/json"
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res){
	res.writeHeader(200, headerJson);
	var json = JSON.stringify(messages);
	res.write(json);
	res.end();
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('add_message', function(message){
    console.log('message by ' + message.author + ':' + message.text);
    messages.push(message)
    io.emit('broadcast_message', message);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});


/*
var http = require('http')
  , sys  = require('sys')
  , fs   = require('fs')
  , qs   = require('querystring');

var io = require('socket.io')(http);

var headerHtml = {
	"Content-Type": "text/html"
};

var headerJson = {
	"Content-Type": "application/json"
};

var messages = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];


var app = http.createServer(function(req, res){
	
	sys.puts("Incoming request! at " + req.url);

	if (req.url.indexOf('/messages') == 0) {		
		if (req.method == 'POST') {
	        var body = '';
	        req.on('data', function (data) {
	            body += data;

	            if (body.length > 1e6)
	                req.connection.destroy();
	        });
	        req.on('end', function () {
	            var post = qs.parse(body);
	            var newMessage = { author: post['author'], text: post['text'] };
	            messages.push(newMessage)	            
	        });

		} else {
			res.writeHeader(200, headerJson);
			var json = JSON.stringify(messages);
			res.write(json);
			res.end();
		}
	} else {
	    fs.readFile('index.html',function (err, data){
	        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
	        res.write(data);
	        res.end();
	    });		
	}
});
app.listen(80);

*/
