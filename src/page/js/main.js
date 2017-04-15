var engine = new Engine();

engine.start(engineInitialized);

function engineInitialized() {
  setInterval(update, 10);
}

function update() {
  engine.drawScene();
}

function mouseCLicked() {
  engine.interact();
}

window.onmousedown = mouseCLicked;