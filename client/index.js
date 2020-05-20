var canvas = document.getElementById('whiteboard');
var ctx = canvas.getContext('2d');
var interval = 1000 / 60;

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
    needsDraw: false,
    color: 'black',
};

var chosenColor = 'black';

socket.emit('newUser');

socket.on('init', (canv) => {
    // basically we want to draw whats in the server
    // probably collect the servers dataurl and write it to screen
    var img = new Image;
    img.src = canv;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    }
    img.src = canv;

})

const draw = (curs) => {
    ctx.beginPath();
    ctx.moveTo(curs.prevX, curs.prevY);
    ctx.lineTo(curs.currX, curs.currY);
    ctx.strokeStyle = curs.color;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

function clearBoard() {

    socket.emit('clearBoard');
}

socket.on('boardCleared', (ok) => {
    console.log('cleared!')
    ctx.clearRect(0, 0, 680, 620);
})

socket.on('cursor', (cursorInc) => {
    if (cursorInc.flag && cursorInc.needsDraw) {
        draw(cursorInc)
    }
})

function cursorColor(obj) {
    switch (obj) {
        case "green":
            cursor.color = "green";
            break;
        case "blue":
            cursor.color = "blue";
            break;
        case "red":
            cursor.color = "red";
            break;
        case "yellow":
            cursor.color = "yellow";
            break;
        case "orange":
            cursor.color = "orange";
            break;
        case "black":
            cursor.color = "black";
            break;
        case "eraser":
            cursor.color = "whitesmoke";
            break;
    }
}

function findxy(res, e) {
    cursor.direction = res;
    cursor.e = e;
    if (res === 'down') {
        cursor.prevX = cursor.currX;
        cursor.prevY = cursor.currY;
        cursor.currX = (e.clientX - canvas.offsetLeft);
        cursor.currY = (e.clientY - canvas.offsetTop);

        cursor.flag = true;
        socket.emit('cursorMove', cursor);
    }
    if (res === 'up' || res === 'out') {
        cursor.flag = false;
        socket.emit('cursorMove', cursor);
    }
    if (res === 'move') {
        if (cursor.flag) {
            cursor.prevX = cursor.currX;
            cursor.prevY = cursor.currY;
            cursor.currX = e.clientX - canvas.offsetLeft;
            cursor.currY = e.clientY - canvas.offsetTop;
            socket.emit('cursorMove', cursor);
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    var opts = document.getElementById('opts');
    console.log(opts.options)
    opts.addEventListener("change", function() {
        cursorColor(opts.value)
    })
})

document.getElementById("clr").addEventListener("click", clearBoard);

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