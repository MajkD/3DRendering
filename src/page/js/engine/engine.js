function Engine(){

  var shaders = new Shaders();
  var textures = new Textures();
  var gl;

  var perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  var entities = []

  this.engineInitializedCallback = undefined;

  Engine.prototype.start = function(onEngineInitialized) {
    this.engineInitializedCallback = onEngineInitialized;
    var canvas = document.getElementById('glCanvas');
    gl = this.initWebGL(canvas);
    if (!gl) {
      return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    shaders.fetchAndInitiShaders(gl, this.shadersInitialized.bind(this))
  }

  Engine.prototype.initWebGL = function(canvas) {
    gl = null; 
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
    }
    return gl;
  }

  Engine.prototype.shadersInitialized = function() {
    console.log("Shaders Initialized...");
    textures.initTextures(gl, this.texturesInitialized.bind(this));
    this.engineInitializedCallback();
  }

  Engine.prototype.texturesInitialized = function() {
    console.log("Textures Loaded...");
    entities[0] = new Entity(gl, [-2.0, 0.0, -20.0], "entity1", [0, 1, 1], "test2.png", [0, 1, 0]);
    entities[1] = new Entity(gl, [2.0, 0.0, -20.0], "entity2", [1, 0, 1], "test2.png", [1, 0, 0]);
    entities[2] = new Entity(gl, [0.0, 3.0, -20.0], "entity3", [1, 1, 0], "test2.png", [1, 0, 0]);
    entities[3] = new Entity(gl, [0.0, -3.0, -20.0], "entity4", [0, 0, 1], "test2.png", [0, 1, 0]);
    console.log("Entities Initialized...");
    this.engineInitializedCallback();
  }

  Engine.prototype.interact = function () {
    for(var index = 0; index < entities.length; index++) {
      var min = -2;
      var max = 2;
      entities[index].velocity[0] = Math.floor(Math.random() * (max - min)) + min;
      entities[index].velocity[1] = Math.floor(Math.random() * (max - min)) + min;
    }
  }

  Engine.prototype.drawScene = function(squareRotation) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(var index = 0; index < entities.length; index++) {
      var entity = entities[index];
      // Update should happen in game world later...
      entity.update(entities);

      gl.bindBuffer(gl.ARRAY_BUFFER, entity.getVerticesBuffer());
      gl.vertexAttribPointer(shaders.getVertexPositionAttribute(), 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, entity.getVerticesTextureCoordBuffer());
      gl.vertexAttribPointer(shaders.getTextureCoordAttribute(), 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures.getTextures()[entity.getTexture()]);
      gl.uniform1i(gl.getUniformLocation(shaders.getProgram(), 'uSampler'), 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.getVerticesIndexBuffer());
      this.setMatrixUniforms(entity);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
  }

  Engine.prototype.setMatrixUniforms = function(entity) {
    var pUniform = gl.getUniformLocation(shaders.getProgram(), "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
    var mvUniform = gl.getUniformLocation(shaders.getProgram(), "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(entity.getRotationMatrix().flatten()));
  }
}