  function loadIdentity() {
    return Matrix.I(4);
  }

  function multMatrix(m1, m2) {
    return m1.x(m2);
  }

  function mvTranslate(matrix, vec) {
    return multMatrix(matrix, Matrix.Translation($V([vec[0], vec[1], vec[2]])).ensure4x4());
  }

  function mvRotate(matrix, degrees, vec) {
    var radians = degrees * Math.PI / 180.0;
    var m = Matrix.Rotation(radians, $V([vec[0], vec[1], vec[2]])).ensure4x4();
    return multMatrix(matrix, m);
  }

  function clamp(value, min, max) {
    return Math.max(Math.min(value, min), max);
  }

  function vectorLength(vec) {
    return Math.sqrt(Math.pow(vec[0], 2), Math.pow(vec[1], 2), Math.pow(vec[2], 2))
  }

  function vecNormalize(vec) {
    var length = vectorLength(vec);
    return [vec[0]/length, vec[1]/length, vec[2]/length]
  }

  function copyVec(vec) {
    var newVec = [vec[0], vec[1], vec[2]];
    return newVec;
  }

  function invertVec(vec) {
    return [-vec[0], -vec[1], -vec[2]];
  }

  function multVec(vec, value) {
    vec[0] *= value;
    vec[1] *= value;
    vec[2] *= value;
  }

  function addVectors(vec1, vec2) {
    vec1[0] += vec2[0];
    vec1[1] += vec2[1];
    vec1[2] += vec2[2];
  }

  function subVectors(vec1, vec2) {
    vec1[0] -= vec2[0];
    vec1[1] -= vec2[1];
    vec1[2] -= vec2[2]; 
  }