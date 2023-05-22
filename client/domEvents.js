import {
  handleMouseDown,
  handleMouseUp,
  handleMouseOut,
  handleMouseMove,
} from "./utils.js";
import { cursor } from "./utils.js";
import { socket } from "./main.js";

const colorMap = {
  green: "green",
  blue: "blue",
  red: "red",
  yellow: "yellow",
  orange: "orange",
  black: "black",
  eraser: "whitesmoke",
};

export function initDOMEvents(canvas) {
  // Color picker event
  document.getElementById("opts").addEventListener("change", function () {
    cursorColor(this.value);
  });

  // Go to board button event
  document.getElementById("gotoBoard").addEventListener(
    "click",
    function () {
      const input = document.getElementById("boardName").value;
      socket.emit("changeRoom", input);
    },
    false
  );

  // Clear button event
  document.getElementById("clr").addEventListener("click", function () {
    socket.emit("clearBoard");
  });

  // Canvas events
  canvas.addEventListener(
    "mousemove",
    function (e) {
      e;
      handleMouseMove(e, canvas);
    },
    false
  );
  canvas.addEventListener(
    "mousedown",
    function (e) {
      handleMouseDown(e, canvas);
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    function (e) {
      handleMouseUp(e, canvas);
    },
    false
  );
  canvas.addEventListener(
    "mouseout",
    function (e) {
      handleMouseOut(e, canvas);
    },
    false
  );

  // Window resize event
  window.addEventListener(
    "resize",
    function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    false
  );
}

export function cursorColor(color) {
  if (colorMap.hasOwnProperty(color)) {
    cursor.color = colorMap[color];
  } else {
    console.warn(`Invalid color value: ${color}`);
  }
}
