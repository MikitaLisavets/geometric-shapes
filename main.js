const canvas = document.getElementById('js-canvas');
const infoPanel = document.getElementById('js-info');
const sectionAbout = document.getElementById('js-section-about');
const buttonReset = document.getElementById('js-reset');
const buttonAbout = document.getElementById('js-about');

const ctx = canvas.getContext('2d');
let currentActivePointIndex = -1;
const state = {
  points:        [],
  parallelogram: null,
  circle:        null
};

updateCanvasDimentions();

window.addEventListener('resize', updateCanvasDimentions);
canvas.addEventListener('click', addShapes);
buttonReset.addEventListener('click', resetShapes);
buttonAbout.addEventListener('click', toggleSectionAbout);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#f00';
  }

  render() {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 2 * Math.PI, 0);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class Parallelogram {
  constructor() {
    this.color = '#00f';
  }

  calculateCenterCoords() {
    return {
      x: (state.points[0].x + state.points[2].x) / 2,
      y: (state.points[0].y + state.points[2].y) / 2
    };
  }

  calculateArea() {
    const angle = findAngle(state.points[0], state.points[1], state.points[2]);
    const sideA = Math.sqrt(Math.pow((state.points[0].x - state.points[1].x), 2)
      + Math.pow((state.points[0].y - state.points[1].y), 2));
    const sideB = Math.sqrt(Math.pow((state.points[1].x - state.points[2].x), 2)
      + Math.pow((state.points[1].y - state.points[2].y), 2));

    return sideA * sideB * Math.abs(Math.sin(angle));

    function findAngle(point0, point1, point2) {
      var line01 = Math.pow(point1.x - point0.x, 2) + Math.pow(point1.y - point0.y, 2),
        line12 = Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2),
        line20 = Math.pow(point2.x - point0.x, 2) + Math.pow(point2.y - point0.y, 2);
      return Math.acos((line01 + line12 - line20) / Math.sqrt(4 * line01 * line12));
    }
  }

  render() {
    const center = this.calculateCenterCoords();
    const lastPoint = {
      x: center.x - (state.points[1].x - center.x),
      y: center.y - (state.points[1].y - center.y)
    };

    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(state.points[0].x, state.points[0].y);
    for (let i = 1; i < state.points.length; i++) {
      ctx.lineTo(state.points[i].x, state.points[i].y);
    }
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(state.points[0].x, state.points[0].y);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class Circle {
  constructor() {
    this.color = '#ff0';
  }

  getArea() {
    return state.parallelogram.calculateArea();
  }

  getCenterCoords() {
    return state.parallelogram.calculateCenterCoords();
  }

  render() {
    const center = state.parallelogram.calculateCenterCoords();
    const radius = Math.sqrt(state.parallelogram.calculateArea() / Math.PI);
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 2 * Math.PI, 0);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function addShapes(event) {
  if (state.points.length >= 3) return;

  state.points.push(new Point(event.pageX, event.pageY));
  if (state.points.length === 3) {
    state.parallelogram = new Parallelogram(state.points);
    state.circle = new Circle();
    canvas.addEventListener('mousedown', startMovePoint);
  }
  render();
}

function startMovePoint(event) {
  const pageX = event.pageX;
  const pageY = event.pageY;
  const threshold = 10;
  currentActivePointIndex = state.points.findIndex((point) => {
    return point.x >= pageX - threshold
      && point.x <= pageX + threshold
      && point.y >= pageY - threshold
      && point.y <= pageY + threshold;
  });
  if (currentActivePointIndex < 0) return;
  canvas.addEventListener('mousemove', movePoint);
  canvas.addEventListener('mouseup', stopMovePoint);
}

function stopMovePoint() {
  canvas.removeEventListener('mousemove', movePoint);
  canvas.removeEventListener('mouseup', stopMovePoint);
  currentActivePointIndex = -1;
}

function movePoint(event) {
  state.points[currentActivePointIndex].x = event.pageX;
  state.points[currentActivePointIndex].y = event.pageY;
  render();
}

function updateCanvasDimentions() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  render();
}

function renderPoints() {
  if (!state.points.length) return;
  state.points.forEach((point) => { point.render(); });
}

function renderParallelogram() {
  if (!state.parallelogram) return;
  state.parallelogram.render();
}

function renderCircle() {
  if (!state.circle) return;
  state.circle.render();
}

function renderInfoPanel() {
  let infoPanelContent = `
    ${state.points.map((point, index) => {
      return pointTemplate('Point' + (index + 1), point.x, point.y);
    }).join('')}
    ${ state.parallelogram
      ? shapeTemplate('Parallelogram', state.parallelogram.calculateArea(), state.parallelogram.calculateCenterCoords())
      : ''
    }
    ${ state.circle
      ? shapeTemplate('Circle', state.circle.getArea(), state.circle.getCenterCoords())
      : ''
    }
  `;

  infoPanel.innerHTML = infoPanelContent;

  function pointTemplate(name, x, y) {
    return `<div>${name}: x = ${x} y = ${y}</div>`;
  }
  function shapeTemplate(name, area, centerCoords) {
    return `<div>
      ${name}: S = ${area.toFixed(0)} px<sup>2</sup>
      <br>
      center x = ${centerCoords.x.toFixed(1)} y = ${centerCoords.y.toFixed(1)}
    </div>`;
  }
}

function resetShapes() {
  state.points = [];
  state.parallelogram = null;
  state.circle = null;
  render();
}

function toggleSectionAbout() {
  sectionAbout.classList.toggle('hidden');
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderPoints();
  renderParallelogram();
  renderCircle();
  renderInfoPanel();
}