var sketch = document.getElementById("sketch");
var canvas = document.getElementById("canvas");
var tmp_canvas = document.createElement("canvas");
tmp_canvas.style.position = "absolute";
tmp_canvas.style.top = "1px";
tmp_canvas.style.left = "1px";
canvas.width = sketch.offsetWidth;
canvas.height = sketch.offsetHeight;
tmp_canvas.width = canvas.width;
tmp_canvas.height = canvas.height;

var ctx = canvas.getContext("2d");
var tmp_ctx = tmp_canvas.getContext("2d");
tmp_canvas.id = "tmp_canvas";
sketch.appendChild(tmp_canvas);

var mouse = { x: 0, y: 0 };
var start_mouse = { x: 0, y: 0 };

// Pencil Points
var ppts = [];
pencil_pts = [];
rectangle_pts = [];
circle_pts = [];
line_pts = [];

// Current figures
current_rectangle = null;
current_line = null;
current_circle = null;

// paint functions
var paint_pencil = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Saving all the points in an array
  ppts.push({ x: mouse.x, y: mouse.y });
  pencil_pts.push({ x: mouse.x, y: mouse.y });

  // Tmp canvas is always cleared up before drawing.
  clear_tmp_ctx();
  tmp_ctx.beginPath();
  tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

  for (var i = 0; i < ppts.length; i++) tmp_ctx.lineTo(ppts[i].x, ppts[i].y);

  tmp_ctx.stroke();
};

var paint_line = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  clear_tmp_ctx();

  tmp_ctx.beginPath();
  tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
  tmp_ctx.lineTo(mouse.x, mouse.y);
  tmp_ctx.stroke();
  tmp_ctx.closePath();

  current_line = {
    x1: start_mouse.x,
    y1: start_mouse.y,
    x2: mouse.x,
    y2: mouse.y,
  };
};

var paint_rectangle = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  clear_tmp_ctx();
  tmp_ctx.beginPath();
  tmp_ctx.moveTo(start_mouse.x, start_mouse.y);

  var x = Math.min(mouse.x, start_mouse.x);
  var y = Math.min(mouse.y, start_mouse.y);
  var width = Math.abs(mouse.x - start_mouse.x);
  var height = Math.abs(mouse.y - start_mouse.y);
  tmp_ctx.strokeRect(x, y, width, height);
  tmp_ctx.closePath();

  current_rectangle = {
    x: x,
    y: y,
    width: width,
    height: height,
  };
};

var paint_circle = function (e) {
  mouse.x = typeof e.offsetX !== "undefined" ? e.offsetX : e.layerX;
  mouse.y = typeof e.offsetY !== "undefined" ? e.offsetY : e.layerY;
  // Tmp canvas is always cleared up before drawing.
  clear_tmp_ctx();

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

  current_circle = {
    x: start_mouse.x,
    y: start_mouse.y,
    radius: r,
  };
};

// Choose tool
tool = "pencil";
tools_func = {
  pencil: paint_pencil,
  line: paint_line,
  rectangle: paint_rectangle,
  circle: paint_circle,
};

document
  .getElementById("tools_box")
  .addEventListener("click", function (event) {
    // remove the mouse down eventlistener if any
    tmp_canvas.removeEventListener("mousemove", tools_func[tool], false);
    var target = event.target;

    tool = target.id;
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
    clear_tmp_ctx();

    if (tool === "pencil") {
      tmp_canvas.addEventListener("mousemove", paint_pencil, false);
    } else if (tool === "line") {
      tmp_canvas.addEventListener("mousemove", paint_line, false);
    } else if (tool === "rectangle") {
      tmp_canvas.addEventListener("mousemove", paint_rectangle, false);
    } else if (tool === "circle") {
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
  },
  false
);

tmp_canvas.addEventListener(
  "mouseup",
  function () {
    tmp_canvas.removeEventListener("mousemove", tools_func[tool], false);
    ctx.drawImage(tmp_canvas, 0, 0);
    clear_tmp_ctx();
    ppts = [];
    if (tool === "line") {
      line_pts.push(current_line);
    } else if (tool === "rectangle") {
      rectangle_pts.push(current_rectangle);
    } else if (tool === "circle") {
      circle_pts.push(current_circle);
    }
  },
  false
);

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

document.getElementById("rectangle_form").addEventListener("submit", (e) => {
  e.preventDefault();
  form = e.target;
  inputs = form.getElementsByTagName("input");
  values = {};
  for (let i = 0; i < inputs.length; i++) {
    values[inputs[i].name] = inputs[i].value;
  }
  draw_rectangle(values["x"], values["y"], values["width"], values["height"]);
  rectangle_pts.push({
    x: values["x"],
    y: values["y"],
    width: values["width"],
    height: values["height"],
  });
});

document.getElementById("circle_form").addEventListener("submit", (e) => {
  e.preventDefault();
  form = e.target;
  inputs = form.getElementsByTagName("input");
  values = {};
  for (let i = 0; i < inputs.length; i++) {
    values[inputs[i].name] = inputs[i].value;
  }
  draw_circle(values["x"], values["y"], values["radius"]);
  circle_pts.push({ x: values["x"], y: values["y"], radius: values["radius"] });
});

document.getElementById("line_form").addEventListener("submit", (e) => {
  e.preventDefault();
  form = e.target;
  inputs = form.getElementsByTagName("input");
  values = {};
  for (let i = 0; i < inputs.length; i++) {
    values[inputs[i].name] = inputs[i].value;
  }
  draw_line(values["x1"], values["y1"], values["x2"], values["y2"]);
  line_pts.push({
    x1: values["x1"],
    y1: values["y1"],
    x2: values["x2"],
    y2: values["y2"],
  });
});

document.getElementById("save_to_file").addEventListener("click", (e) => {
  var data = {
    pencil_pts: pencil_pts,
    line_pts: line_pts,
    rectangle_pts: rectangle_pts,
    circle_pts: circle_pts,
  };
  var json = JSON.stringify(data);

  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.download = "canvas_data.json";
  a.href = url;
  a.click();
  a.remove();
});

document.getElementById("load_from_file").addEventListener("click", (e) => {
  console.log("load_from_file");
  fetch("./canva_data.json")
    .then((response) => response.json())
    .then((data) => {
      pencil_pts = data.pencil_pts;
      line_pts = data.line_pts;
      rectangle_pts = data.rectangle_pts;
      circle_pts = data.circle_pts;
      draw_all();
    });
});

draw_all = function () {
  draw_pencil();

  for (let i = 0; i < line_pts.length; i++) {
    line = line_pts[i];
    draw_line(line.x1, line.y1, line.x2, line.y2);
  }
  for (let i = 0; i < rectangle_pts.length; i++) {
    rectangle = rectangle_pts[i];
    draw_rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
  for (let i = 0; i < circle_pts.length; i++) {
    circle = circle_pts[i];
    draw_circle(circle.x, circle.y, circle.radius);
  }
};

draw_line = function (x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};

draw_rectangle = function (x, y, width, height) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
  ctx.closePath();
};

draw_circle = function (x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
};

draw_pencil = function () {
  ctx.beginPath();
  ctx.moveTo(pencil_pts[0].x, pencil_pts[0].y);

  for (var i = 0; i < pencil_pts.length; i++)
    ctx.lineTo(pencil_pts[i].x, pencil_pts[i].y);

  ctx.stroke();
};

clear_tmp_ctx = function () {
  tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
};
