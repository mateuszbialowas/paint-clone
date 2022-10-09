var sketch = document.getElementById("sketch");
var canvas = document.getElementById("canvas");
var tmp_canvas = document.createElement("canvas");
tmp_canvas.style.position = "absolute";
tmp_canvas.style.top = '1px';
tmp_canvas.style.left = '1px';

canvas.width = sketch.offsetWidth;
canvas.height = sketch.offsetHeight;

tmp_canvas.width = canvas.width;
tmp_canvas.height = canvas.height;

var undo_canvas = [];
var undo_canvas_len = 7;
for (var i = 0; i < undo_canvas_len; ++i) {
  var ucan = document.createElement("canvas");
  ucan.width = canvas.width;
  ucan.height = canvas.height;
  var uctx = ucan.getContext("2d");
  undo_canvas.push({ ucan: ucan, uctx: uctx, redoable: false });
}

var undo_canvas_top = 0;

var ctx = canvas.getContext("2d");
var tmp_ctx = tmp_canvas.getContext("2d");
tmp_canvas.id = "tmp_canvas";
sketch.appendChild(tmp_canvas);

var mouse = { x: 0, y: 0 };
var start_mouse = { x: 0, y: 0 };
var eraser_width = 10;
var fontSize = "14px";

// Pencil Points
var ppts = [];

var chosen_size = 2; // by default
/* Drawing on Paint App */
tmp_ctx.lineWidth = 3;
tmp_ctx.lineJoin = "round";
tmp_ctx.lineCap = "round";
tmp_ctx.strokeStyle = "black";
tmp_ctx.fillStyle = "black";

// paint functions
var paint_pencil = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  //console.log(mouse.x + " "+mouse.y);
  // Saving all the points in an array
  ppts.push({ x: mouse.x, y: mouse.y });

  if (ppts.length < 3) {
    var b = ppts[0];
    tmp_ctx.beginPath();
    //ctx.moveTo(b.x, b.y);
    //ctx.lineTo(b.x+50, b.y+50);
    tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
    tmp_ctx.fill();
    tmp_ctx.closePath();
    return;
  }

  // Tmp canvas is always cleared up before drawing.
  tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

  tmp_ctx.beginPath();
  tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

  for (var i = 0; i < ppts.length; i++) tmp_ctx.lineTo(ppts[i].x, ppts[i].y);

  tmp_ctx.stroke();
};

var paint_line = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

  tmp_ctx.beginPath();
  tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
  tmp_ctx.lineTo(mouse.x, mouse.y);
  tmp_ctx.stroke();
  tmp_ctx.closePath();
};

var paint_rectangle = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
  tmp_ctx.beginPath();
  tmp_ctx.moveTo(start_mouse.x, start_mouse.y);

  var x = Math.min(mouse.x, start_mouse.x);
  var y = Math.min(mouse.y, start_mouse.y);
  var width = Math.abs(mouse.x - start_mouse.x);
  var height = Math.abs(mouse.y - start_mouse.y);
  tmp_ctx.strokeRect(x, y, width, height);
  tmp_ctx.closePath();
};

var paint_circle = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

  var x = (mouse.x + start_mouse.x) / 2;
  var y = (mouse.y + start_mouse.y) / 2;

  //var radius = Math.max(Math.abs(mouse.x - start_mouse.x), Math.abs(mouse.y - start_mouse.y)) / 2;
  var a = mouse.x - start_mouse.x;
  var b = mouse.y - start_mouse.y;
  var r = Math.sqrt(a * a + b * b);

  tmp_ctx.beginPath();
  //tmp_ctx.arc(x, y, radius, 0, Math.PI*2, false);
  tmp_ctx.arc(start_mouse.x, start_mouse.y, r, 0, 2 * Math.PI);
  // tmp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
  tmp_ctx.stroke();
  tmp_ctx.closePath();
};

var paint_ellipse = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

  var x = start_mouse.x;
  var y = start_mouse.y;
  var w = mouse.x - x;
  var h = mouse.y - y;

  tmp_ctx.save(); // save state
  tmp_ctx.beginPath();

  tmp_ctx.translate(x, y);
  tmp_ctx.scale(w / 2, h / 2);
  tmp_ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);

  tmp_ctx.restore(); // restore to original state
  tmp_ctx.stroke();
  tmp_ctx.closePath();
};

var move_eraser = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
  var tmp_lw = tmp_ctx.lineWidth;
  var tmp_ss = tmp_ctx.strokeStyle;
  tmp_ctx.lineWidth = 1;
  tmp_ctx.strokeStyle = "black";
  tmp_ctx.beginPath();
  tmp_ctx.strokeRect(mouse.x, mouse.y, eraser_width, eraser_width);
  tmp_ctx.stroke();
  tmp_ctx.closePath();
  // restore linewidth
  tmp_ctx.lineWidth = tmp_lw;
  tmp_ctx.strokeStyle = tmp_ss;
};

var paint_text = function (e) {
  // Tmp canvas is always cleared up before drawing.
  tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;

  var x = Math.min(mouse.x, start_mouse.x);
  var y = Math.min(mouse.y, start_mouse.y);
  var width = Math.abs(mouse.x - start_mouse.x);
  var height = Math.abs(mouse.y - start_mouse.y);

  textarea.style.left = x + "px";
  textarea.style.top = y + "px";
  textarea.style.width = width + "px";
  textarea.style.height = height + "px";

  textarea.style.display = "block";
};

var paint_eraser = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // erase from the main ctx
  ctx.clearRect(mouse.x, mouse.y, eraser_width, eraser_width);
};

// Choose tool
tool = "pencil";
tools_func = {
  pencil: paint_pencil,
  line: paint_line,
  rectangle: paint_rectangle,
  circle: paint_circle,
  ellipse: paint_ellipse,
};

document
  .getElementById("tools_box")
  .addEventListener("click", function (event) {
    // remove the mouse down eventlistener if any
    tmp_canvas.removeEventListener("mousemove", tools_func[tool], false);
    var target = event.target;

    tool = target.id;
    tmp_canvas.removeEventListener("mousemove", move_eraser, false);
    $(tmp_canvas).css("cursor", "crosshair");
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
  });

// Mouse-Down
tmp_canvas.addEventListener(
  "mousedown",
  function (e) {
    mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
    start_mouse.x = mouse.x;
    start_mouse.y = mouse.y;
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    if (tool === "pencil") {
      tmp_canvas.addEventListener("mousemove", paint_pencil, false);
      ppts.push({ x: mouse.x, y: mouse.y });
      paint_pencil(e);
    }

    if (tool === "line") {
      tmp_canvas.addEventListener("mousemove", paint_line, false);
    }

    if (tool === "rectangle") {
      tmp_canvas.addEventListener("mousemove", paint_rectangle, false);
    }

    if (tool === "circle") {
      tmp_canvas.addEventListener("mousemove", paint_circle, false);
      // Mark the center

      tmp_ctx.beginPath();
      //ctx.moveTo(b.x, b.y);
      //ctx.lineTo(b.x+50, b.y+50);
      tmp_ctx.arc(
        start_mouse.x,
        start_mouse.y,
        tmp_ctx.lineWidth / 2,
        0,
        Math.PI * 2,
        !0
      );
      tmp_ctx.fill();
      tmp_ctx.closePath();
      // copy to real canvas
      ctx.drawImage(tmp_canvas, 0, 0);
    }

    if (tool === "ellipse") {
      tmp_canvas.addEventListener("mousemove", paint_ellipse, false);
    }
  },
  false
);

tmp_canvas.addEventListener(
  "mouseup",
  function () {
    tmp_canvas.removeEventListener("mousemove", tools_func[tool], false);

    // Writing down to real canvas now
    // text-tool is managed when textarea.blur() event
    if (tool != "text") {
      ctx.drawImage(tmp_canvas, 0, 0);
      // keep the image in the undo_canvas
      undo_canvas_top = next_undo_canvas(undo_canvas_top);
      var uctx = undo_canvas[undo_canvas_top]["uctx"];
      uctx.clearRect(0, 0, canvas.width, canvas.height);
      uctx.drawImage(canvas, 0, 0);
      undo_canvas[undo_canvas_top]["redoable"] = false;
    }

    // Clearing tmp canvas
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    // Emptying up Pencil Points
    ppts = [];
  },
  false
);

var next_undo_canvas = function (top) {
  if (top === undo_canvas_len - 1) return 0;
  else return top + 1;
};

var prev_undo_canvas = function (top) {
  if (top === 0) return undo_canvas_len - 1;
  else return top - 1;
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
