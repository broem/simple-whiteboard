const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const {
	createCanvas
} = require('canvas')
//const canvas = createCanvas(680, 620)
//const ctx = canvas.getContext('2d')

const boardState = {
	users: {
		roomNo: '',
		cursor: cursor
	},
	cursors: [{
		room: 'public',
		canvas: createCanvas(680, 620),
		ctx: null,
		cursor: cursor
	}]
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
	needsDraw: false,
	color: 'black',
	boardNo: ''
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
			roomNo: 'public',
			cursor: cursor
		}

		console.log(boardState.users)
		socket.leaveAll();
		socket.join('public', function (err) {
			console.log(err)
		})
		socket.emit('init', {canvas: boardState.cursors.filter(x => x.room === 'public')[0].canvas.toDataURL(), boardNo: 'public'});

	})


	socket.on('cursorMove', (inc) => {
		// console.log(socket.client.sockets[socket.id].rooms);
		cursor.color = inc.color;
		cursor.direction = inc.direction
		if (inc.direction === 'down') {
			cursor.prevX = inc.prevX;
			cursor.prevY = inc.prevY;
			cursor.currX = inc.currX;
			cursor.currY = inc.currY;

			cursor.flag = true;
		}
		if (inc.direction === 'up' || inc.direction === 'out') {
			cursor.flag = false;
			cursor.needsDraw = false;
		}
		if (inc.direction === 'move') {
			if (cursor.flag) {
				cursor.needsDraw = true;
				cursor.prevX = inc.prevX;
				cursor.prevY = inc.prevY;
				cursor.currX = inc.currX;
				cursor.currY = inc.currY;
				draw(socket, cursor);
			}
		}
	});

	socket.on("clearBoard", () => {
		ctx.clearRect(0, 0, 680, 620);
		// why doesnt broadcast go to caller?
		// socket.broadcast.emit("boardCleared")
		io.sockets.emit("boardCleared")
	});

	socket.on("changeRoom", (roomNo) => {
			socket.leaveAll();
			boardState.users[socket.id].roomNo = roomNo;
			socket.join(roomNo);

			// check if room exists, if not create it
			if (boardState.cursors.filter(x => x.room === roomNo).length <= 0) {
				createRoom(roomNo);
			}
			// io.in(boardState.users[socket.id].roomNo)
			console.log('user ' + socket.id + ' is going to ' + roomNo)
			socket.emit('init', {canvas: boardState.cursors.filter(x => x.room === roomNo)[0].canvas.toDataURL(), boardNo: roomNo});
	});

const draw = (sock, curs) => {
	var curCan = boardState.cursors.filter(x => x.room === boardState.users[sock.id].roomNo)[0];
	if (!curCan.ctx) {
		console.log('shiiiiiiiiiiiiit')
		curCan.ctx = curCan.canvas.getContext('2d');
	}
	curCan.ctx.beginPath();
	curCan.ctx.moveTo(curs.prevX, curs.prevY);
	curCan.ctx.lineTo(curs.currX, curs.currY);
	curCan.ctx.strokeStyle = curs.color;
	curCan.ctx.lineWidth = 5;
	curCan.ctx.stroke();
	curCan.ctx.closePath();
	io.in(boardState.users[sock.id].roomNo).emit('cursor', curs);
}

const createRoom = (roomNo) => {
	boardState.cursors.push({
		room: roomNo,
		canvas: createCanvas(680, 620),
		ctx: null,
		cursor: cursor
	});
}

socket.on('disconnect', function () {
	delete boardState.users[socket.id]
	console.log('user disconnected');
});
});

server.listen(PORT, () => {
	console.log('Server is live on PORT:', PORT);
});