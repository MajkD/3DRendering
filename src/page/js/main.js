var engine = new Engine();

engine.start(engineInitialized);

function engineInitialized() {
  setInterval(update, 10);
}

var squareRotation = 0.0;

function update() {
  // console.log("update");
  squareRotation += 1.0;
  engine.drawScene(squareRotation);
}

// function start() {
//   var canvas = document.getElementById('glCanvas');
//   // Initialize the GL context
//   gl = initWebGL(canvas);
//   // Only continue if WebGL is available and working
//   if (!gl) {
//     return;
//   }
//   // Set clear color to black, fully opaque
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   // Enable depth testing
//   gl.enable(gl.DEPTH_TEST);
//   // Near things obscure far things
//   gl.depthFunc(gl.LEQUAL);
//   // Clear the color as well as the depth buffer.
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//   gl.viewport(0, 0, canvas.width, canvas.height);
// }

// function initWebGL(canvas) {
//   gl = null; 
//   // Try to grab the standard context. If it fails, fallback to experimental.
//   gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
//   // If we don't have a GL context, give up now
//   if (!gl) {
//     alert('Unable to initialize WebGL. Your browser may not support it.');
//   }
//   return gl;
// }

// var horizAspect = 480.0/640.0;

// var vertices = [
//     1.0,  1.0,  0.0,
//     -1.0, 1.0,  0.0,
//     1.0,  -1.0, 0.0,
//     -1.0, -1.0, 0.0
//   ];

// function initBuffers() {
//   squareVerticesBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//   var colors = [
//     1.0,  1.0,  1.0,  1.0,    // white
//     1.0,  0.0,  0.0,  1.0,    // red
//     0.0,  1.0,  0.0,  1.0,    // green
//     0.0,  0.0,  1.0,  1.0     // blue
//   ];
  
//   squareVerticesColorBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
// }

// function drawScene() {
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
//   perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
//   loadIdentity();
//   mvTranslate([-0.0, 0.0, -6.0]);

//   mvPushMatrix();
//   mvRotate(squareRotation, [0, 0, 1]);
  
//   gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
//   gl.vertexAttribPointer(shaders.getVertexPositionAttribute(), 3, gl.FLOAT, false, 0, 0);
//   gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
//   gl.vertexAttribPointer(shaders.getVertexColorAttribute(), 4, gl.FLOAT, false, 0, 0);
//   setMatrixUniforms();
//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

//   mvPopMatrix();
// }

// function loadIdentity() {
//   mvMatrix = Matrix.I(4);
// }

// function multMatrix(m) {
//   mvMatrix = mvMatrix.x(m);
// }

// function mvTranslate(v) {
//   multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
// }

// function setMatrixUniforms() {
//   var pUniform = gl.getUniformLocation(program, "uPMatrix");
//   gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

//   var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
//   gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
// }

// var mvMatrixStack = [];

// function mvPushMatrix(m) {
//   if (m) {
//     mvMatrixStack.push(m.dup());
//     mvMatrix = m.dup();
//   } else {
//     mvMatrixStack.push(mvMatrix.dup());
//   }
// }

// function mvPopMatrix() {
//   if (!mvMatrixStack.length) {
//     throw('Cant pop from an empty matrix stack.');
//   }
  
//   mvMatrix = mvMatrixStack.pop();
//   return mvMatrix;
// }

// function mvRotate(angle, v) {
//   var inRadians = angle * Math.PI / 180.0;
  
//   var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
//   multMatrix(m);
// }