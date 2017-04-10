function Shaders(){

  this.shaderFiles = ["fragment.c", "vertex.c"]
  this.fetchingShaders = 0
  this.loadedShaders = {}
  var vertexPositionAttribute = undefined;
  var vertexColorAttribute = undefined;

  Shaders.prototype.getVertexPositionAttribute = function() { return vertexPositionAttribute };
  Shaders.prototype.getVertexColorAttribute = function() { return vertexColorAttribute };

  Shaders.prototype.fetchShader = function(shader, callback) {
    var file = new XMLHttpRequest();
    file.open('GET', 'js/shaders/' + shader, true);
    file.onreadystatechange = function() {
      if (file.readyState == 4 && file.status == "200") {
        callback(shader, file.responseText);
      }
    }
    file.send();
  }

  Shaders.prototype.fetchAndInitiShaders = function(gl, onShadersInitialized) {
    var _this = this;
    for (var index = 0; index < this.shaderFiles.length; index++) {
      this.fetchingShaders++;
      this.fetchShader(this.shaderFiles[index], function (shader, definition){
        _this.loadedShaders[shader] = definition
        _this.fetchingShaders--;
        if(_this.fetchingShaders <= 0) {
          _this.initShaders(gl, onShadersInitialized);
        }
      });
    }
  }

  Shaders.prototype.initShaders = function(gl, onShadersInitialized) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, this.loadedShaders["vertex.c"]);
    gl.shaderSource(fragmentShader, this.loadedShaders["fragment.c"]);
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

    vertexColorAttribute = gl.getAttribLocation(program, 'aVertexColor');
    gl.enableVertexAttribArray(vertexColorAttribute);

    onShadersInitialized();
  }
}