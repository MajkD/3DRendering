var engine = new Engine();

engine.start(engineInitialized);

function engineInitialized() {
  setInterval(update, 10);
}

// var squareRotation = 0.0;

function update() {
  // squareRotation += 1.0;
  // engine.drawScene();
}



// var currentTime = Date.now();
//   if (lastSquareUpdateTime) {
//     var delta = currentTime - lastSquareUpdateTime;
    
//     squareRotation += (30 * delta) / 1000.0;
//   }
  
//   lastSquareUpdateTime = currentTime;