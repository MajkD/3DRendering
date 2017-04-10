function Entity(gl, pos, name){

  var translation = loadIdentity();
  var rotation = 0;
  var entityName = "";

  var squareVerticesBuffer = undefined;
  var squareVerticesColorBuffer = undefined;

  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

  var colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0     // blue
  ];

  Entity.prototype.init = function(gl, pos, name) {
    entityName = name;
    translation = mvTranslate(translation, pos);

    squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    squareVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  }

  Entity.prototype.update = function() {
    rotation += 1.0;
  }

  Entity.prototype.getVerticesBuffer = function() { return squareVerticesBuffer; }
  Entity.prototype.getVerticesColorBuffer = function() { return squareVerticesColorBuffer; }
  Entity.prototype.getRotationMatrix = function() {
    return mvRotate(translation, rotation, [0, 0, 1]);
  }
  Entity.prototype.getName = function() { return entityName; }

  this.init(gl, pos, name);
}