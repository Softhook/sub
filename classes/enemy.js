// --- Enemy Class ---
class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y); 
    this.radius = ENEMY_RADIUS;
    // Initial velocity calculation uses ENEMY_MIN_BASE_SPEED and ENEMY_MAX_BASE_SPEED
    this.vel = p5.Vector.random2D().mult(random(ENEMY_MIN_BASE_SPEED, ENEMY_MAX_BASE_SPEED + currentLevel * ENEMY_SPEED_LEVEL_MULTIPLIER));
    this.type = 'enemy'; 
    this.nextDecisionTime = 0; // For AI behavior
  }

  update(cave, player) { // Added player argument
    if (frameCount > this.nextDecisionTime) {
      // Speed calculation for new velocity decision
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
