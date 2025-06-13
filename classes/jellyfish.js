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
