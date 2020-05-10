const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const boardState = {
	users: {	}
}

var cursor = {
    flag: false,
    prevX: 0,
    currX: 0,
    prevY: 0,
    currY: 0,
	direction: '',
    e: {},
    offsetLeft: 0,
	offsetTop: 0,
	needsDraw: false
};

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/*', (req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message || 'Internal server error');
});

io.on('connection', (socket) => {
	console.log('a user connected:', socket.id);

	socket.on('newUser', () => {
		boardState.users[socket.id] = {
		}
		console.log(boardState.users)
		
	})
	// socket.emit('state', boardState);

	socket.on('cursorMove', (inc) => {
			cursor.direction = inc.direction
		if (inc.direction === 'down') {
			cursor.prevX = inc.prevX;
			cursor.prevY = inc.prevY;
			cursor.currX = inc.currX;
			cursor.currY = inc.currY;
	
			cursor.flag = true;
		}
		if (inc.direction === 'up' ) {
			// console.log(cursor)
			cursor.flag = false;
			cursor.needsDraw = false;
		}
		if (inc.direction === 'move') {
			if (cursor.flag) {
				cursor.needsDraw = true;
				// console.log(cursor)
				cursor.prevX = inc.prevX;
				cursor.prevY = inc.prevY;
				cursor.currX = inc.currX;
				cursor.currY = inc.currY;
			}
		}
	});


	socket.on('disconnect', function () {
		delete boardState.users[socket.id]
		console.log('user disconnected');
	});
});

setInterval(() => {
	io.sockets.emit('cursor', cursor);
  }, 1000 / 70);

setInterval(() => {
	io.sockets.emit('state', boardState);
  }, 1000 / 20);

server.listen(PORT, () => {
	console.log('Server is live on PORT:', PORT);
});