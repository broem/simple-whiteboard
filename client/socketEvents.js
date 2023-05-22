import { cursor } from "./utils.js";
import { draw, clearBoard, updateHeader, resizeCanvas } from "./rendering.js";
import { ctx } from "./main.js";

export function initSocketEvents(socket) {
  socket.on("init", (canv) => {
    console.log("init");
    console.log(canv);
    updateHeader(canv.boardNo);
    resizeCanvas();
    ctx.clearRect(0, 0, 2000, 1000);
    var img = new Image();
    img.src = canv.canvas;
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = canv.canvas;
    cursor.boardNo = canv.boardNo;
  });

  socket.on("boardCleared", () => {
    const canvas = document.getElementById("whiteboard");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  socket.on("cursor", (cursorInc) => {
    console.log("cursoring");
    console.log(cursorInc);
    if (cursorInc.flag && cursorInc.needsDraw) {
      draw(cursorInc);
    }
  });
}

export function emitNewUser(socket, canvX, canvY, url) {
  socket.emit("newUser", { x: canvX, y: canvY, url: url });
}

export function emitClearBoard(socket) {
  socket.emit("clearBoard");
}

export function emitCursorMove(socket, cursor) {
  socket.emit("cursorMove", cursor);
}

export function emitChangeRoom(socket, input) {
  socket.emit("changeRoom", input);
}
