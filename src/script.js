const canvas = document.getElementById("canvas_paint");
const clear_button = document.getElementById("clear_button");

clear_button.addEventListener("click", () => {
    console.log("Clearing canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
});





if (canvas.getContext) {
  const ctx = canvas.getContext("2d");

  canvas.addEventListener("mousemove", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
  });

  canvas.addEventListener("mousedown", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.addEventListener("mousemove", onPaint);
    console.error(x, y);
  });

  onPaint = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
  };



  canvas.addEventListener("mouseup", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    console.warn(x, y);
    canvas.removeEventListener("mousemove", onPaint);
  });

  //   ctx.beginPath();
  //   ctx.moveTo(75, 25);
  //   ctx.quadraticCurveTo(25, 25, 25, 62.5);
  //   ctx.quadraticCurveTo(25, 100, 50, 100);
  //   ctx.quadraticCurveTo(50, 120, 30, 125);
  //   ctx.quadraticCurveTo(60, 120, 65, 100);
  //   ctx.quadraticCurveTo(125, 100, 125, 62.5);
  //   ctx.quadraticCurveTo(125, 25, 75, 25);
  //   ctx.stroke();
} else {
  console.log("Canvas not supported");
}
