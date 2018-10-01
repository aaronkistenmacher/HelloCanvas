const VSHADER_SOURCE = `
  attribute vec4 aPosition;
  attribute float aPointSize;
  void main() {
    gl_Position = aPosition;
    gl_PointSize = aPointSize;
  }
`

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));

    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function main() {
  const canvas = document.getElementById('webgl');

  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL.');
    return;
  }

  const program = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  gl.useProgram(program);

  var aPosition = gl.getAttribLocation(program, 'aPosition');
  var aPointSize = gl.getAttribLocation(program, 'aPointSize');

  gl.vertexAttrib1f(aPointSize, 5.0);

  canvas.onmousedown = function (event) { click (event, gl, canvas, aPosition); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, 1);
}

var gPoints = [];
function click (event, gl, canvas, aPosition) {
  var x = event.clientX;
  var y = event.clientY;
  var rect = event.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  gPoints.push({ x: x, y: y });

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = gPoints.length;

  for (var i = 0; i < len; i++) {
    gl.vertexAttrib3f(aPosition, gPoints[i].x, gPoints[i].y, 0.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
