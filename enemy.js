// --- Enemy Class ---
class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = ENEMY_RADIUS;
    this.type = 'enemy';
    this.nextDecisionTime = 0;
    
    // Initial velocity calculation
    const speedMultiplier = ENEMY_MIN_BASE_SPEED + 
      random(0, ENEMY_MAX_BASE_SPEED - ENEMY_MIN_BASE_SPEED) + 
      currentLevel * ENEMY_SPEED_LEVEL_MULTIPLIER;
    this.vel = p5.Vector.random2D().mult(speedMultiplier);
  }
  update(cave, player) {
    this.updateAI(player);
    this.updateMovement(cave);
    this.constrainToWorldBounds(cave);
  }
  
  updateAI(player) {
    if (frameCount <= this.nextDecisionTime) return;
    
    const newSpeed = this.calculateSpeed();
    
    if (this.shouldUseHomingBehavior(player)) {
      this.setHomingVelocity(player, newSpeed);
    } else {
      this.setRandomVelocity(newSpeed);
    }
    
    this.scheduleNextDecision();
  }
  
  calculateSpeed() {
    return random(
      ENEMY_MIN_BASE_SPEED, 
      ENEMY_MAX_BASE_SPEED + currentLevel * ENEMY_SPEED_LEVEL_MULTIPLIER
    );
  }
  
  shouldUseHomingBehavior(player) {
    return currentLevel >= ENEMY_HOMING_START_LEVEL && 
           player && 
           random() < ENEMY_HOMING_CHANCE;
  }
  
  setHomingVelocity(player, speed) {
    const directionToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
    this.vel = directionToPlayer.mult(speed);
  }
  
  setRandomVelocity(speed) {
    this.vel = p5.Vector.random2D().mult(speed);
  }
  
  scheduleNextDecision() {
    const maxInterval = max(
      ENEMY_AI_DECISION_MAX_INTERVAL_BASE_FRAMES - 
      currentLevel * ENEMY_AI_DECISION_INTERVAL_LEVEL_REDUCTION_FRAMES,
      ENEMY_AI_DECISION_MIN_INTERVAL_FRAMES
    );
    
    this.nextDecisionTime = frameCount + 
      random(ENEMY_AI_DECISION_MIN_INTERVAL_FRAMES, maxInterval);
  }
  
  updateMovement(cave) {
    const nextPos = p5.Vector.add(this.pos, this.vel);
    
    if (cave.isWall(nextPos.x, nextPos.y, this.radius)) {
      this.handleWallCollision();
    } else {
      this.pos.add(this.vel);
    }
  }
  
  handleWallCollision() {
    this.vel.mult(-1);
    this.nextDecisionTime = frameCount + 
      random(
        ENEMY_AI_WALL_HIT_DECISION_MIN_INTERVAL_FRAMES, 
        ENEMY_AI_WALL_HIT_DECISION_MAX_INTERVAL_FRAMES
      );
  }
  
  constrainToWorldBounds(cave) {
    this.pos.x = constrain(this.pos.x, this.radius, cave.worldWidth - this.radius);
    this.pos.y = constrain(this.pos.y, this.radius, cave.worldHeight - this.radius);
  }
  render(offsetX, offsetY) {
    // Enemies are detected via sonar - no visual rendering needed
    // Uncomment below for debug visualization:
    /*
    push();
    fill(ENEMY_COLOR_H, ENEMY_COLOR_S, ENEMY_COLOR_B);
    noStroke();
    ellipse(this.pos.x - offsetX, this.pos.y - offsetY, this.radius * 2);
    pop();
    */
  }
}

// --- Jellyfish Class ---
class Jellyfish {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = JELLYFISH_RADIUS;
    this.health = JELLYFISH_HEALTH;
    this.maxHealth = JELLYFISH_HEALTH;
    this.type = 'jellyfish';
    this.nextDecisionTime = 0;
    
    // Animation properties
    this.tentacleOffsets = [];
    this.tentaclePhase = random(TWO_PI);
    
    // Initialize movement
    this.vel = p5.Vector.random2D().mult(random(JELLYFISH_MIN_SPEED, JELLYFISH_MAX_SPEED));
    
    // Initialize tentacle animation offsets
    this.initializeTentacles();
  }
  
  initializeTentacles() {
    for (let i = 0; i < JELLYFISH_TENTACLE_COUNT; i++) {
      this.tentacleOffsets.push(random(TWO_PI));
    }
  }
  
  update(cave, player) {
    this.updateAI(player);
    this.updateMovement(cave);
    this.constrainToWorldBounds(cave);
    this.updateAnimation();
  }
  
  updateAI(player) {
    if (frameCount <= this.nextDecisionTime) return;
    
    const newSpeed = random(JELLYFISH_MIN_SPEED, JELLYFISH_MAX_SPEED);
    
    if (player) {
      this.setHomingVelocity(player, newSpeed);
    } else {
      this.setRandomVelocity(newSpeed);
    }
    
    this.scheduleNextDecision();
  }
  
  setHomingVelocity(player, speed) {
    const dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
    this.vel = dirToPlayer.mult(speed);
  }
  
  setRandomVelocity(speed) {
    this.vel = p5.Vector.random2D().mult(speed);
  }
  
  scheduleNextDecision() {
    this.nextDecisionTime = frameCount + random(120, 240);
  }
  
  updateMovement(cave) {
    if (cave.isWall(this.pos.x, this.pos.y)) {
      this.handleWallCollision();
    }
    this.pos.add(this.vel);
  }
  
  handleWallCollision() {
    this.vel.mult(-1);
    this.nextDecisionTime = frameCount + random(30, 90);
  }
  
  constrainToWorldBounds(cave) {
    this.pos.x = constrain(this.pos.x, this.radius, cave.worldWidth - this.radius);
    this.pos.y = constrain(this.pos.y, this.radius, cave.worldHeight - this.radius);
  }
  
  updateAnimation() {
    this.tentaclePhase += 0.05;
  }
  
  takeDamage() {
    this.health--;
    return this.health <= 0; // Return true if destroyed
  }
}