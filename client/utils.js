import { socket } from "./main";

export let cursor = {
  flag: false,
  prevX: 10,
  currX: 10,
  prevY: 110,
  currY: 110,
  direction: "",
  e: {},
  offsetLeft: 0,
  offsetTop: 0,
  needsDraw: false,
  color: "black",
  boardNo: "",
};

export function handleMouseDown(e, canvas) {
  const { x, y } = getCursorPosition(e, canvas);
  cursor.prevX = cursor.currX;
  cursor.prevY = cursor.currY;
  cursor.currX = x;
  cursor.currY = y;
  cursor.direction = "down";

  cursor.flag = true;
  socket.emit("cursorMove", cursor);
}

export function handleMouseUp(e) {
  cursor.flag = false;
  cursor.direction = "up";
  socket.emit("cursorMove", cursor);
}

export function handleMouseOut(e) {
  cursor.flag = false;
  cursor.direction = "out";
  socket.emit("cursorMove", cursor);
}

export function handleMouseMove(e, canvas) {
  if (cursor.flag) {
    console.log(cursor);
    const { x, y } = getCursorPosition(e, canvas);
    cursor.prevX = cursor.currX;
    cursor.prevY = cursor.currY;
    cursor.currX = x;
    cursor.currY = y;
    cursor.direction = "move";
    console.log("emitting cursor move");
    socket.emit("cursorMove", cursor);
  }
}

function getCursorPosition(e, canvas) {
  const boundRect = canvas.getBoundingClientRect();
  console.log("event");
  console.log(e);

  const x = e.clientX - boundRect.left;
  const y = e.clientY - boundRect.top;
  return { x, y };
}
