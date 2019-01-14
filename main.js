const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('click', addPoint);

function addPoint(event) {
  ctx.fillStyle = 'green';
  ctx.fillRect(event.pageX, event.pageY, 10, 10);
}