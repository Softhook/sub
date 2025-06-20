// --- Enemy Class ---
class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y); this.radius = ENEMY_RADIUS;
    // Initial velocity calculation uses ENEMY_MIN_BASE_SPEED and ENEMY_MAX_BASE_SPEED
    this.vel = p5.Vector.random2D().mult(random(ENEMY_MIN_BASE_SPEED, ENEMY_MAX_BASE_SPEED + currentLevel * ENEMY_SPEED_LEVEL_MULTIPLIER));
    this.type = 'enemy'; this.nextDecisionTime = 0; // For AI behavior
    

  }
  update(cave, player) { // Added player argument
    if (frameCount > this.nextDecisionTime) {
      // Speed calculation for new velocity decision
      // Note: The original code used ENEMY_AI_NEW_VEL_MIN_SPEED_FACTOR and MAX_SPEED_FACTOR here.
      // For consistency with constructor and homing, let's use the base speed logic.
      let newSpeed = random(ENEMY_MIN_BASE_SPEED, ENEMY_MAX_BASE_SPEED + currentLevel * ENEMY_SPEED_LEVEL_MULTIPLIER);

      if (currentLevel >= ENEMY_HOMING_START_LEVEL && player && random() < ENEMY_HOMING_CHANCE) {
        // Homing behavior
        let directionToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
        this.vel = directionToPlayer.mult(newSpeed);
      } else {
        // Standard random behavior
        this.vel = p5.Vector.random2D().mult(newSpeed);
      }
      // Reset decision time, ensuring it doesn't become too short or negative
      let maxDecisionInterval = ENEMY_AI_DECISION_MAX_INTERVAL_BASE_FRAMES - currentLevel * ENEMY_AI_DECISION_INTERVAL_LEVEL_REDUCTION_FRAMES;
      maxDecisionInterval = max(maxDecisionInterval, ENEMY_AI_DECISION_MIN_INTERVAL_FRAMES); // Ensure max is not less than min
      this.nextDecisionTime = frameCount + random(ENEMY_AI_DECISION_MIN_INTERVAL_FRAMES, maxDecisionInterval);
    }
    let nextPos = p5.Vector.add(this.pos, this.vel);
    if (cave.isWall(nextPos.x, nextPos.y, this.radius)) {
      this.vel.mult(-1); // Reverse direction
      // Quicker decision after hitting a wall
      this.nextDecisionTime = frameCount + random(ENEMY_AI_WALL_HIT_DECISION_MIN_INTERVAL_FRAMES, ENEMY_AI_WALL_HIT_DECISION_MAX_INTERVAL_FRAMES); 
    } else {
      this.pos.add(this.vel);
    }
    // Constrain enemy to world bounds (though cave should mostly handle this)
    this.pos.x = constrain(this.pos.x, this.radius, cave.worldWidth - this.radius);
    this.pos.y = constrain(this.pos.y, this.radius, cave.worldHeight - this.radius);
  }
  // Enemy render (simple circle, can be expanded) - Rendered in main draw loop if needed, or here
  render(offsetX, offsetY) {
    // Placeholder: Enemies are currently not explicitly rendered via their own render method in the main loop.
    // Sonar picks them up. If direct visual is needed, add it here and call from draw().
    // push();
    // fill(ENEMY_COLOR_H, ENEMY_COLOR_S, ENEMY_COLOR_B);
    // noStroke();
    // ellipse(this.pos.x - offsetX, this.pos.y - offsetY, this.radius * 2);
    // pop();
  }
}

// --- Jellyfish Class ---
class Jellyfish {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = JELLYFISH_RADIUS;
    this.health = JELLYFISH_HEALTH;
    this.maxHealth = JELLYFISH_HEALTH;
    this.vel = p5.Vector.random2D().mult(random(JELLYFISH_MIN_SPEED, JELLYFISH_MAX_SPEED));
    this.type = 'jellyfish';
    this.nextDecisionTime = 0;
    this.tentacleOffsets = []; // For tentacle animation
    this.tentaclePhase = random(TWO_PI); // Random starting phase for animation
    
    // Initialize tentacle offsets for wavy animation
    for (let i = 0; i < JELLYFISH_TENTACLE_COUNT; i++) {
      this.tentacleOffsets.push(random(TWO_PI));
    }
  }
  
  update(cave, player) {
    if (frameCount > this.nextDecisionTime) {
      let newSpeed = random(JELLYFISH_MIN_SPEED, JELLYFISH_MAX_SPEED);

      // Jellyfish always move toward player
      if (player) {
        let dirToPlayer = p5.Vector.sub(player.pos, this.pos);
        dirToPlayer.normalize();
        this.vel = dirToPlayer.mult(newSpeed);
      } else {
        // Fallback if player is not defined (should not happen in normal gameplay)
        this.vel = p5.Vector.random2D().mult(newSpeed);
      }
      
      let maxDecisionInterval = 240; // Slower decision making
      this.nextDecisionTime = frameCount + random(120, maxDecisionInterval);
    }
    
    // Handle wall collisions
    if (cave.isWall(this.pos.x, this.pos.y)) {
      this.vel.mult(-1); // Reverse direction
      this.nextDecisionTime = frameCount + random(30, 90);
    }
    
    this.pos.add(this.vel);
    
    // Keep jellyfish within world bounds
    this.pos.x = constrain(this.pos.x, this.radius, cave.worldWidth - this.radius);
    this.pos.y = constrain(this.pos.y, this.radius, cave.worldHeight - this.radius);
    
    // Update tentacle animation phase
    this.tentaclePhase += 0.05;
  }
  
  takeDamage() {
    this.health--;
    return this.health <= 0; // Return true if destroyed
  }
}