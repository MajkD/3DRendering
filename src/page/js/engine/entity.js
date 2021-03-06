Entity = function (gl, pos, name, rotVec, texture, velocity) {

  this.translation = loadIdentity();
  this.rotation = 0;
  this.entityName = "uninited";
  this.rotVec = undefined;
  this.velocity = undefined;
  this.texture = undefined;
  this.pos = undefined;

  this.cubeVerticesBuffer = undefined;
  this.cubeVerticesIndexBuffer = undefined;
  this.cubeVerticesNormalBuffer = undefined;
  this.cubeVerticesTextureCoordBuffer = undefined;
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

  this.vertexNormals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
    
    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
    
    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
    
    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
    
    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
    
    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];

  this.textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ];

  this.cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];

  Entity.prototype.init = function(gl, pos, name, rotVec, texture, velocity) {
    this.entityName = name;
    this.rotVec = rotVec;
    this.texture = texture;
    this.velocity = velocity;
    this.pos = pos;
    this.translation = mvTranslate(loadIdentity(), this.pos);

    this.cubeVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    this.cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.cubeVertexIndices), gl.STATIC_DRAW);

    this.cubeVerticesNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);

    this.cubeVerticesTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
  }

  Entity.prototype.update = function(deltaTime) {
    this.updateTranslation(deltaTime);
    this.updateRotation(deltaTime);
  }

  Entity.prototype.updateTranslation = function(deltaTime) {
    this.slowDown(deltaTime);
    var deltaVec = copyVec(this.velocity);
    multVec(deltaVec, deltaTime * 5);
    addVectors(this.pos, deltaVec);
    this.translation = mvTranslate(loadIdentity(), this.pos);
  }

  Entity.prototype.updateRotation = function(deltaTime) {
    this.rotation += deltaTime * 100;
  }

  Entity.prototype.slowDown = function(deltaTime) {
    var velDiminish = deltaTime * 0.5;
    for(var index = 0; index <= 2; index++) {
      if (this.velocity[index] < 0) {
        this.velocity[index] += velDiminish;
        if(this.velocity[index] > 0) {
          this.velocity[index] = 0;
        }
      }
      if (this.velocity[index] > 0) {
        this.velocity[index] -= velDiminish;
        if(this.velocity[index] < 0) {
          this.velocity[index] = 0;
        }
      }
    }
  }

  Entity.prototype.collideWorld = function(axis, position) {
    this.pos[axis] = position;
    this.velocity[axis] = -this.velocity[axis];
  }

  Entity.prototype.collideEntity = function(other) {
    var toOther = copyVec(other.pos);
    subVectors(toOther, this.pos);
    var newDir = invertVec(toOther);
    var curSpeed = vectorLength(this.velocity);
    var dirNormal = vecNormalize(newDir);
    multVec(dirNormal, curSpeed);
    this.velocity = copyVec(dirNormal);
  }

  Entity.prototype.getVerticesBuffer = function() { return this.cubeVerticesBuffer; }
  Entity.prototype.getVerticesIndexBuffer = function() { return this.cubeVerticesIndexBuffer; }
  Entity.prototype.getVerticesNormalBuffer = function() { return this.cubeVerticesNormalBuffer; }
  Entity.prototype.getVerticesColorBuffer = function() { return this.cubeVerticesColorBuffer; }
  Entity.prototype.getVerticesTextureCoordBuffer = function() { return this.cubeVerticesTextureCoordBuffer; }
  Entity.prototype.getRotationMatrix = function() {
    return mvRotate(this.translation, this.rotation, this.rotVec);
  }
  Entity.prototype.getName = function() { return this.entityName; }
  Entity.prototype.getTexture = function() { return this.texture; }

  this.init(gl, pos, name, rotVec, texture, velocity);
}