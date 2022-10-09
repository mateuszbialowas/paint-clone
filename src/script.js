const canvas = document.getElementById("canvas_paint");
const ctx = canvas.getContext("2d");

mouse = { x: 0, y: 0 };
start_mouse = { x: 0, y: 0 };
eraser_width = 10;
font_size = "14px";

// Pencil Points
ppts = [];

// Lines Points
lpts = [];

chosen_size = 5;
ctx.lineWidth = chosen_size;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.strokeStyle = "black";
ctx.fillStyle = "black";

// paint functions

paint_pencil = (e) => {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;

  ppts.push({ x: mouse.x, y: mouse.y });

  // if (ppts.length < 3) {
  //   var b = ppts[0];
  //   ctx.beginPath();
  //   ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
  //   ctx.fill();
  //   ctx.closePath();

  //   return;
  // }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(ppts[0].x, ppts[0].y);

  for (var i = 1; i < ppts.length; i++) ctx.lineTo(ppts[i].x, ppts[i].y);

  ctx.stroke();
};

paint_line = (e) => {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(start_mouse.x, start_mouse.y);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
};

tool = "draw";
tools_func = {
  draw: paint_pencil,
  line: paint_line,
};

// handle css for choosen tool
tools_box = document.getElementById("tools_box");
tools = tools_box.children;
for (let i = 0; i < tools.length; i++) {
  tools[i].addEventListener("click", (e) => {
    canvas.removeEventListener("mousedown", tools_func[tool], false);
    tool = e.target.id;

    for (let j = 0; j < tools.length; j++) {
      tools[j].classList.remove("ring");
      tools[j].classList.remove("ring-violet-300");
    }
    e.target.classList.add("ring");
    e.target.classList.add("ring-violet-300");
  });
}

canvas.addEventListener(
  "mousedown",
  (e) => {
    mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
    start_mouse.x = mouse.x;
    start_mouse.y = mouse.y;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (tool === "draw") {
      canvas.addEventListener("mousemove", paint_pencil, false);
      ppts.push({ x: mouse.x, y: mouse.y });
      paint_pencil(e);
    } else if (tool === "line") {
      canvas.addEventListener("mousemove", paint_line, false);
    }
  },
  false
);

canvas.addEventListener(
  "mouseup",
  () => {
    canvas.removeEventListener("mousemove", tools_func[tool], false);
  },
  false
);

// const clear_button = document.getElementById("clear_button");
// const rectangle_mode_button = document.getElementById("rectangle_mode_button");
// const circle_mode_button = document.getElementById("circle_mode_button");
// let drawing_mode = "";

// clear_button.addEventListener("click", () => {
//   console.log("Clearing canvas");
//   const context = canvas.getContext("2d");
//   context.clearRect(0, 0, canvas.width, canvas.height);
// });

// rectangle_mode_button.addEventListener("click", () => {
//   console.log("Rectangle mode");
//   drawing_mode = "rectangle";
//   canvas.removeEventListener("mousedown", drawCircle);
// });

// circle_mode_button.addEventListener("click", () => {
//     console.log("Circle mode");
//     drawing_mode = "circle";
//     canvas.removeEventListener("mousedown", drawRectangle);
// });

// if (canvas.getContext) {
//   const ctx = canvas.getContext("2d");

//   canvas.addEventListener("mousemove", (e) => {
//     const x = e.offsetX;
//     const y = e.offsetY;
//   });

//   canvas.addEventListener("mousedown", (e) => {
//     const x = e.offsetX;
//     const y = e.offsetY;
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     if (drawing_mode === "rectangle") {
//       canvas.addEventListener("mousedown", drawRectangle);
//     } else if (drawing_mode === "circle") {
//       canvas.addEventListener("mousedown", drawCircle);
//     } else {
//       canvas.addEventListener("mousemove", onPaint);
//     }
//     console.error(x, y);
//   });

//   drawRectangle = (e) => {
//     const x = e.offsetX;
//     const y = e.offsetY;
//     // draw rectangle
//     ctx.rect(x, y, 100, 100);
//     ctx.stroke();
//   };

//     drawCircle = (e) => {
//     const x = e.offsetX;
//     const y = e.offsetY;
//     // draw circle
//     ctx.arc(x, y, 50, 0, 2 * Math.PI);
//     ctx.stroke();
//     };

//   onPaint = (e) => {
//     const x = e.offsetX;
//     const y = e.offsetY;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   canvas.addEventListener("mouseup", (e) => {
//     const x = e.offsetX;
//     const y = e.offsetY;
//     console.warn(x, y);
//     canvas.removeEventListener("mousemove", onPaint);
//   });

//   //   ctx.beginPath();
//   //   ctx.moveTo(75, 25);
//   //   ctx.quadraticCurveTo(25, 25, 25, 62.5);
//   //   ctx.quadraticCurveTo(25, 100, 50, 100);
//   //   ctx.quadraticCurveTo(50, 120, 30, 125);
//   //   ctx.quadraticCurveTo(60, 120, 65, 100);
//   //   ctx.quadraticCurveTo(125, 100, 125, 62.5);
//   //   ctx.quadraticCurveTo(125, 25, 75, 25);
//   //   ctx.stroke();
// } else {
//   console.log("Canvas not supported");
// }
