function Textures(){

    var gl;
    var textures = {};
    var texturesToLoad = ["test.png", "test2.png"]
    var loadingTextures = 0;

    Textures.prototype.getTextures = function() { return textures };

    Textures.prototype.initTextures = function(gl, onTexturesLoaded) {
      this.onTexturesLoadedCallback = onTexturesLoaded;
      this.gl = gl;
      for(var index = 0; index < texturesToLoad.length; index++){
        loadingTextures++;
        var imgSrc = texturesToLoad[index]
        textures[imgSrc] = gl.createTexture();
        var image = new Image();
        image.onload = this.handleTextureLoaded.bind(this, {image: image, texture: textures[imgSrc]});
        image.src = 'images/' + imgSrc;
      }
    }

    Textures.prototype.handleTextureLoaded = function(data) {
      var gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, data.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);

      loadingTextures--;
      if(loadingTextures <= 0) {
        this.onTexturesLoadedCallback();
      }
    }
}