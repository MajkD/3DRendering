function Shaders(){

  this.shaderFiles = ["fragment.c", "vertex.c"]
  this.fetchingShaders = 0
  this.loadedShaders = {}
  this.program = undefined;
  var vertexPositionAttribute = undefined;
  var textureCoordAttribute = undefined;

  Shaders.prototype.getVertexPositionAttribute = function() { return vertexPositionAttribute };
  Shaders.prototype.getTextureCoordAttribute = function() { return textureCoordAttribute };
  Shaders.prototype.getTextureCoordAttribute = function() { return textureCoordAttribute };
  Shaders.prototype.getProgram = function() { return this.program };

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

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);

    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program));
    }
    gl.useProgram(this.program);
    vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);

    textureCoordAttribute = gl.getAttribLocation(this.program, 'aTextureCoord');
    gl.enableVertexAttribArray(textureCoordAttribute);

    onShadersInitialized();
  }
}