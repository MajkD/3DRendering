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

  function copyVec(vec) {
    var newVec = [vec[0], vec[1], vec[2]];
    return newVec;
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