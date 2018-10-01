const VSHADER_SOURCE = `
  attribute vec4 aPosition;
  attribute float aPointSize;
  void main() {
    gl_Position = aPosition;
    gl_PointSize = aPointSize;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 uFragColor;
  void main() {
    gl_FragColor = uFragColor;
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

  var uFragColor = gl.getUniformLocation(program, 'uFragColor');

  gl.vertexAttrib1f(aPointSize, 5.0);

  canvas.onmousedown = function (event) { click (event, gl, canvas, aPosition, uFragColor); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var gPoints = [];
var gColors = [];
function click (event, gl, canvas, aPosition, uFragColor) {
  var x = event.clientX;
  var y = event.clientY;
  var rect = event.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  gPoints.push({ x: x, y: y });

  if (x >= 0.0 && y >= 0.0) {
    gColors.push({ r: 1.0, g: 0.0, b: 0.0, a:1.0 });
  } else if (x < 0.0 && y < 0.0) {
    gColors.push({ r: 0.0, g: 1.0, b: 0.0, a:1.0 });
  } else {
    gColors.push({ r: 0.0, g: 0.0, b: 1.0, a:1.0 });
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = gPoints.length;

  for (var i = 0; i < len; i++) {
    gl.vertexAttrib3f(aPosition, gPoints[i].x, gPoints[i].y, 0.0);
    gl.uniform4f(uFragColor, gColors[i].r, gColors[i].g, gColors[i].b, gColors[i].a);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
