var engine = new Engine();
var world = new World();

engine.start(engineInitialized);

function engineInitialized() {
  world.init(engine.getGl());
  setInterval(tick, 10);
}

function tick() {
  update();
  draw();
}

var lastUpdateTime = Date.now();

function update() {
  var currentTime = Date.now();
  world.update((currentTime - lastUpdateTime) / 1000.0);
  lastUpdateTime = currentTime;
}

function draw() {
  engine.drawEntities(world.getEntities());
}

function mouseCLicked() {
  world.interact();
}

window.onmousedown = mouseCLicked;