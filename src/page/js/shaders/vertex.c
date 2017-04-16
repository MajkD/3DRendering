attribute highp vec3 aVertexNormal;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform highp mat4 uNormalMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
    
void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;

  highp vec3 ambientLight = vec3(0.8, 0.8, 0.8);
  highp vec3 directionalLightColor = vec3(0.9, 0.5, 0.75);
  highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);
  
  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}