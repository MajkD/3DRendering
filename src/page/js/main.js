var gl; // A global variable for the WebGL context

var shaderFiles = ["fragment.c", "vertex.c"]
var fetchingShaders = 0
var loadedShaders = {}

function fetchShader(shader, callback) {
  var file = new XMLHttpRequest();
  file.open('GET', 'js/shaders/' + shader, true);
  file.onreadystatechange = function() {
    if (file.readyState == 4 && file.status == "200") {
      callback(shader, file.responseText);
    }
  }
  file.send();
}

function fetchShaders() {
  for (var index = 0; index < shaderFiles.length; index++) {
    fetchingShaders++;
    fetchShader(shaderFiles[index], function (shader, definition){
      loadedShaders[shader] = definition
      fetchingShaders--;
      if(fetchingShaders <= 0) {
        init();
      }
    });
  }
}

fetchShaders();

function init() {
  start();
  initShaders();
  initBuffers();
  setInterval(update, 10);
}

var squareRotation = 0.0;

function update() {
  console.log("update")
  squareRotation += 1.0
  drawScene();
}

function start() {
  var canvas = document.getElementById('glCanvas');
  // Initialize the GL context
  gl = initWebGL(canvas);
  // Only continue if WebGL is available and working
  if (!gl) {
    return;
  }
  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);
  // Near things obscure far things
  gl.depthFunc(gl.LEQUAL);
  // Clear the color as well as the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.viewport(0, 0, canvas.width, canvas.height);
}

function initWebGL(canvas) {
  gl = null; 
  // Try to grab the standard context. If it fails, fallback to experimental.
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }
  return gl;
}

function initShaders() {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, loadedShaders["vertex.c"]);
  gl.shaderSource(fragmentShader, loadedShaders["fragment.c"]);
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);
  vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition');
  gl.enableVertexAttribArray(vertexPositionAttribute);
}

var horizAspect = 480.0/640.0;

var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

function initBuffers() {
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
  loadIdentity();
  mvTranslate([-0.0, 0.0, -6.0]);

  mvPushMatrix();
  mvRotate(squareRotation, [0, 1, 1]);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  mvPopMatrix();
}

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(program, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw('Cant pop from an empty matrix stack.');
  }
  
  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}