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
canvas.addEventListener('click', movePoint);


class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#ff0000';
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.fillRect(this.x, this.y, 1, 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 2 * Math.PI, 0);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class Parallelogram {
  constructor(points) {
    this.points = points;
    this.color = '#0000ff';
    this.center = this.calcCenterCoords(points)
  }

  calcCenterCoords(points) {
    return {
      x: (points[0].x + points[2].x) / 2,
      y: (points[0].y + points[2].y) / 2
    }
  }

  draw() {
    const lastPoint = {
      x: this.center.x - (this.points[1].x - this.center.x),
      y: this.center.y - (this.points[1].y - this.center.y)
    }
    
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(this.points[0].x, this.points[0].y);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class Circle {
  constructor(points, parallelogram) {
    this.points = points;
    this.color = '#000000';
    this.center = parallelogram.center
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    const maxCoord = this.points.reduce((acc, point) => {
      const x = Math.abs(this.center.x - point.x)
      const y = Math.abs(this.center.y - point.y)

      acc.x = x > acc.x ? x : acc.x;
      acc.y = y > acc.y ? y : acc.y;
      return acc
    }, { x: 0, y: 0 })

    console.log(maxCoord)

    ctx.arc(this.center.x, this.center.y, Math.max(maxCoord.x, maxCoord.y), 2 * Math.PI, 0);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function addPoint(event) {
  if (state.points.length >= 3) return
  
  state.points.push(new Point(event.pageX, event.pageY))
  if (state.points.length === 3) {
    state.parallelogram = new Parallelogram(state.points)
    state.circle = new Circle(state.points, state.parallelogram)
  }

  draw();
}

function movePoint(event) {

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