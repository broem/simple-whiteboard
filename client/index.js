var canvas = document.getElementById('whiteboard');
var ctx = canvas.getContext('2d');
var interval = 1000 / 60;

const socket = io();

initialize();

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
    boardNo: ''
};



var chosenColor = 'black';

window.addEventListener('DOMContentLoaded', function () {

    var canvX = document.getElementById('whiteboard').width;
    var canvY = document.getElementById('whiteboard').height;
    socket.emit('newUser', {
        x: canvX,
        y: canvY
    });
})

socket.on('init', (canv) => {
    // basically we want to draw whats in the server
    // probably collect the servers dataurl and write it to screen
    updateHeader(canv.boardNo)
    ctx.clearRect(0, 0, canvas.height, canvas.width);
    var img = new Image;
    img.src = canv.canvas;
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    }
    img.src = canv.canvas;
    cursor.boardNo = canv.boardNo;

})

const draw = (curs) => {
    var canvX = document.getElementById('whiteboard').width;
    var canvY = document.getElementById('whiteboard').height;
    ctx.beginPath();
    ctx.moveTo(curs.prevX, curs.prevY);
    ctx.lineTo(curs.currX, curs.currY);
    ctx.strokeStyle = curs.color;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

function initialize() {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
}

function updateHeader(board) {
    document.getElementById("boardNumVal").innerHTML = board
}

function clearBoard() {

    socket.emit('clearBoard');
}

socket.on('boardCleared', (ok) => {
    console.log('cleared!')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    var boundRect = canvas.getBoundingClientRect();
    if (res === 'down') {
        cursor.prevX = cursor.currX;
        cursor.prevY = cursor.currY;
        cursor.currX = (e.clientX - boundRect.left);
        cursor.currY = (e.clientY - boundRect.top);

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
            cursor.currX = e.clientX - boundRect.left;
            cursor.currY = e.clientY - boundRect.top;
            socket.emit('cursorMove', cursor);
        }
    }
}
window.onload = window.onresize = function () {

    canvas = document.getElementById('whiteboard');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

document.addEventListener('DOMContentLoaded', function () {
    var opts = document.getElementById('opts');
    opts.addEventListener("change", function () {
        cursorColor(opts.value)
    })
})

document.getElementById("gotoBoard").addEventListener("click", function () {
    var input = document.getElementById("boardName").value;
    socket.emit("changeRoom", input);
}, false);

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