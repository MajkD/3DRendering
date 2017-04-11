Entity = function (gl, pos, name, rotVec) {

  this.translation = loadIdentity();
  this.rotation = 0;
  this.entityName = "uninited";
  this.rotVec = undefined;

  this.cubeVerticesBuffer = undefined;
  this.cubeVerticesIndexBuffer = undefined;
  this.cubeVerticesColorBuffer = undefined;
  this.lastUpdateTime = undefined;

  this.vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  this.colors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0]     // Left face: purple
  ];

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  this.cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];

  Entity.prototype.init = function(gl, pos, name, rotVec) {
    this.entityName = name;
    this.rotVec = rotVec;
    this.translation = mvTranslate(this.translation, pos);

    this.cubeVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    this.cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.cubeVertexIndices), gl.STATIC_DRAW);

    var generatedColors = [];
    for (var j = 0; j < 6; j++) {
      var c = this.colors[j];
      for (var i = 0; i < 4; i++) {
        generatedColors = generatedColors.concat(c);
      }
    }

    this.cubeVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
  }

  Entity.prototype.update = function() {
    var currentTime = Date.now();
    if(this.lastUpdateTime) {
      var delta = currentTime - this.lastUpdateTime;
      this.rotation += (100 * delta) / 1000.0;
    }
    this.lastUpdateTime = currentTime;
  }

  Entity.prototype.getVerticesBuffer = function() { return this.cubeVerticesBuffer; }
  Entity.prototype.getVerticesIndexBuffer = function() { return this.cubeVerticesIndexBuffer; }
  Entity.prototype.getVerticesColorBuffer = function() { return this.cubeVerticesColorBuffer; }
  Entity.prototype.getRotationMatrix = function() {
    return mvRotate(this.translation, this.rotation, this.rotVec);
  }
  Entity.prototype.getName = function() { return this.entityName; }

  this.init(gl, pos, name, rotVec);
}