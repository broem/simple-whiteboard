import { initDOMEvents } from "./domEvents";
import { emitNewUser, initSocketEvents } from "./socketEvents";
import { resizeCanvas } from "./rendering";

export var socket = io();
export var canvas = document.getElementById("whiteboard");
export var ctx = canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  initSocketEvents(socket);
  initDOMEvents(canvas);
  emitNewUser(socket, canvas.width, canvas.height, window.location.href);
});

// Set up canvas resizing
window.addEventListener("resize", resizeCanvas(canvas), false);
resizeCanvas();
