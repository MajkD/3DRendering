function Engine(){

  var shaders = new Shaders();
  var gl;

  var squareVerticesBuffer = undefined;
  var squareVerticesColorBuffer = undefined;
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
    entities[0] = new Entity(gl, [-2.0, 0.0, -8.0], "entity1");
    entities[1] = new Entity(gl, [2.0, 0.0, -8.0], "entity2");
    console.log(entities[0].getName());
    console.log(entities[1].getName());
    this.engineInitializedCallback();
  }

  Engine.prototype.drawScene = function(squareRotation) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(var index = 0; index < entities.length; index++) {
      var entity = entities[index];
      console.log("Name: ", entity.getName());
      // Update should happen in game world update later...
      entity.update();

      gl.bindBuffer(gl.ARRAY_BUFFER, entity.getVerticesBuffer());
      gl.vertexAttribPointer(shaders.getVertexPositionAttribute(), 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.getVerticesColorBuffer());
      gl.vertexAttribPointer(shaders.getVertexColorAttribute(), 4, gl.FLOAT, false, 0, 0);
      this.setMatrixUniforms(entity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  Engine.prototype.setMatrixUniforms = function(entity) {
    var pUniform = gl.getUniformLocation(program, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
    var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(entity.getRotationMatrix().flatten()));
  }
}