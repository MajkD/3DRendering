World = function () {

  var entities = []
  var worldBounds = [
    { min: -9.5, max: 9.5 }, // X axis
    { min: -6.5, max: 6.5 }, // Y axis
    { min: -25.0, max: -15.0 } // Z axis
  ];

  World.prototype.getEntities = function() { return entities; }

  World.prototype.init = function(gl) {
    entities[0] = new Entity(gl, [-2.0, 0.0, -20.0], "entity1", [0, 1, 1], "test2.png", [0, 1, 0]);
    entities[1] = new Entity(gl, [2.0, 0.0, -20.0], "entity2", [1, 0, 1], "test2.png", [1, 0, 0]);
    entities[2] = new Entity(gl, [0.0, 3.0, -20.0], "entity3", [1, 1, 0], "test2.png", [1, 0, 0]);
    entities[3] = new Entity(gl, [0.0, -3.0, -20.0], "entity4", [0, 0, 1], "test2.png", [0, 1, 0]);
    console.log("World Initialized...");
  }

  World.prototype.update = function(deltaTime) {
    for(var index = 0; index < entities.length; index++) {
      this.updateCollision(entities[index]);
      entities[index].update(deltaTime);
    }
  }

  World.prototype.interact = function () {
    for(var index = 0; index < entities.length; index++) {
      if (entities[index].velocity[0] != 0) {
        entities[index].velocity[0] = clamp(entities[index].velocity[0] * 2, -3, 3);
      } else {
        var rand = Math.floor(Math.random() - 0.5);
        entities[index].velocity[0] = rand;
      }
      if (entities[index].velocity[1] != 0) {
        entities[index].velocity[1] = clamp(entities[index].velocity[1] * 2, -3, 3);
      } else {
        var rand = Math.floor(Math.random() - 0.5);
        entities[index].velocity[1] = rand; 
      }
    }
  }

  World.prototype.updateCollision = function (entity) {
    this.worldCollision(entity);
    this.entityCollision(entity);
  }

  World.prototype.worldCollision = function (entity) {
    for(var index = 0; index <= 2; index++) {
      if (entity.pos[index] >= worldBounds[index].max) {
        entity.collideWorld(index, worldBounds[index].max);
      }
      if (entity.pos[index] <= worldBounds[index].min) {
        entity.collideWorld(index, worldBounds[index].min); 
      }  
    }
  }

  World.prototype.entityCollision = function (entity) {
    for(var index = 0; index < entities.length; index++) {
      var otherEntity = entities[index];
      if (otherEntity != entity) {
        var toOther = copyVec(otherEntity.pos);
        subVectors(toOther, entity.pos);
        if(vectorLength(toOther) < 2) {
          otherEntity.collideEntity(entity);
          entity.collideEntity(otherEntity);
        }
      }
    }
  }

}