var canvas = document.getElementById('whiteboard');
var ctx = canvas.getContext('2d');

const socket = io();

var cursor = {
    flag: false,
    prevX: 10,
    currX: 10,
    prevY: 110,
    currY: 110,
	direction: '',
    e: {},
    offsetLeft: 0,
    offsetTop: 0,
    needsDraw: false
};

socket.emit('newUser');

const draw = (curs) => {
    ctx.beginPath();
    ctx.moveTo(curs.prevX, curs.prevY);
    ctx.lineTo(curs.currX, curs.currY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

socket.on('cursor', (cursorInc) => {
    
    if (cursorInc.flag && cursorInc.needsDraw) {
        console.log(cursorInc)
        draw(cursorInc)
    }
    
})

function findxy(res, e) {
    cursor.direction = res;
    cursor.e = e;
    if (res === 'down') {
        // console.log("mouse down")
        cursor.prevX = cursor.currX;
        cursor.prevY = cursor.currY;
        cursor.currX = (e.clientX - canvas.offsetLeft);
        cursor.currY = (e.clientY - canvas.offsetTop);

        cursor.flag = true;
    }
    if (res === 'up' || res === "out") {
        interval = resetinterval;
        // console.log("mouse up or out")
        cursor.flag = false;
    }
    if (res === 'move') {
        if (cursor.flag) {
            cursor.prevX = cursor.currX;
            cursor.prevY = cursor.currY;
            cursor.currX = e.clientX - canvas.offsetLeft;
            cursor.currY = e.clientY - canvas.offsetTop;
        }
    }
}

canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
}, false);

const resetinterval = 1000 / 50;

var interval = 1000 / 60;

var inter = setInterval(() => {
    socket.emit('cursorMove', cursor);
  }, interval);