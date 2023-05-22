import { ctx, canvas } from "./main";

export function draw(curs) {
  ctx.beginPath();
  ctx.moveTo(curs.prevX, curs.prevY);
  ctx.lineTo(curs.currX, curs.currY);
  ctx.strokeStyle = curs.color;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.closePath();
}

export function resizeCanvas() {
  if (window.orientation !== undefined) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

export function updateHeader(board) {
  history.replaceState(
    null,
    "Bleach Board - A Simple Interactive Whiteboard - Room: " + board,
    "/room/" + board
  );
  document.getElementById("boardNumVal").innerHTML = board;
}

export function clearBoard(canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
