const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const state = {
  points:        [],
  parallelogram: null,
  circle:        null
}

const pointColor = '#ff0000'

updateCanvasDimentions()
canvas.addEventListener('click', addPoint);


// window.addEventListener('resize', updateCanvasDimentions)


class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#ff0000'
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.fillRect(this.x, this.y, 1, 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 2 * Math.PI, 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.stroke()
    canvas.removeEventListener('click', addPoint);
  }
}

function addPoint(event) {
  if (state.points.length < 3) {
    state.points.push(new Point(event.pageX, event.pageY))
  }
  if (state.points.length === 3) {
    state.parallelogram = new Parallelogram(event.pageX, event.pageY)
    state.circle = new Circle(event.pageX, event.pageY)
  }
}

function updateCanvasDimentions() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

function drawPoints() {
  if (!state.points.length) return
  state.points.forEach((point) => { point.draw() })
}

function drawParallelogram() {
  if (!state.parallelogram) return
  state.parallelogram.draw()
}

function drawCircle() {
  if (!state.circle) return
  state.circle.draw()
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPoints()
  drawParallelogram()
  drawCircle()
}