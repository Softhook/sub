// --- Projectile Class ---
class Projectile {
  constructor(x, y, angle) {
    // Position and movement
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle).mult(PROJECTILE_SPEED);
    this.angle = angle;
    
    // Physical properties
    this.radius = PROJECTILE_RADIUS;
    this.life = PROJECTILE_LIFESPAN_FRAMES;
  }
  update(cave) {
    this.updatePosition();
    this.spawnTrailParticles();
    this.checkWallCollision(cave);
  }
  
  updatePosition() {
    this.pos.add(this.vel);
    this.life--;
  }
  
  spawnTrailParticles() {
    if (random() >= TORPEDO_TRAIL_PARTICLE_SPAWN_CHANCE) return;
    
    const particlePosition = this.calculateTrailSpawnPosition();
    const particleVelocity = this.calculateParticleVelocity();
    
    particles.push(new Particle(
      particlePosition.x,
      particlePosition.y,
      particleVelocity.x,
      particleVelocity.y,
      TORPEDO_TRAIL_PARTICLE_MAX_LIFESPAN,
      TORPEDO_TRAIL_PARTICLE_MIN_SIZE,
      TORPEDO_TRAIL_PARTICLE_MAX_SIZE,
      TORPEDO_TRAIL_PARTICLE_COLOR_H,
      TORPEDO_TRAIL_PARTICLE_COLOR_S,
      TORPEDO_TRAIL_PARTICLE_COLOR_B,
      TORPEDO_TRAIL_PARTICLE_ALPHA_MAX
    ));
  }
  
  calculateTrailSpawnPosition() {
    const trailSpawnX = this.pos.x + cos(this.angle) * (this.radius * TORPEDO_TRAIL_OFFSET_FACTOR);
    const trailSpawnY = this.pos.y + sin(this.angle) * (this.radius * TORPEDO_TRAIL_OFFSET_FACTOR);
    return { x: trailSpawnX, y: trailSpawnY };
  }
  
  calculateParticleVelocity() {
    const particleAngleOffset = random(-TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE / 2, TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE / 2);
    const particleBaseAngle = this.angle + Math.PI; // Particles move away from torpedo's rear
    const finalParticleAngle = particleBaseAngle + particleAngleOffset;
    const particleSpeed = random(TORPEDO_TRAIL_PARTICLE_SPEED_MIN, TORPEDO_TRAIL_PARTICLE_SPEED_MAX);
    
    return p5.Vector.fromAngle(finalParticleAngle, particleSpeed);
  }
  
  checkWallCollision(cave) {
    const collisionRadius = this.radius * PROJECTILE_WALL_COLLISION_RADIUS_FACTOR;
    
    if (cave.isWall(this.pos.x, this.pos.y, collisionRadius)) {
      this.handleWallImpact(cave);
    }
  }
  
  handleWallImpact(cave) {
    this.life = 0;
    cave.destroyBlocks(this.pos.x, this.pos.y, 25); // 25 pixel radius destruction
    createExplosion(this.pos.x, this.pos.y, 'wall');
    playSound('explosion');
  }
  render(offsetX, offsetY) {
    push();
    translate(this.pos.x - offsetX, this.pos.y - offsetY);
    rotate(this.angle);

    this.renderTorpedoBody();
    this.renderTorpedoFins();
    
    rectMode(CORNER); // Reset rectMode
    pop();
  }
  
  renderTorpedoBody() {
    rectMode(CENTER);
    fill(TORPEDO_COLOR_H, TORPEDO_COLOR_S, TORPEDO_COLOR_B, TORPEDO_COLOR_A);
    noStroke();
    
    const bodyLength = this.radius * TORPEDO_BODY_LENGTH_FACTOR;
    const bodyWidth = this.radius * TORPEDO_BODY_WIDTH_FACTOR;
    
    rect(0, 0, bodyLength, bodyWidth);
  }
  
  renderTorpedoFins() {
    const bodyLength = this.radius * TORPEDO_BODY_LENGTH_FACTOR;
    const bodyWidth = this.radius * TORPEDO_BODY_WIDTH_FACTOR;
    const finOutwardSize = this.radius * TORPEDO_FIN_SIZE_FACTOR;
    const finBodyLength = bodyLength * 0.35; // Fin length along the torpedo's body
    const finCenterX = -this.radius * TORPEDO_FIN_OFFSET_FACTOR; // Position towards the rear
    
    // Top fin: extends upwards from the body
    rect(finCenterX, -bodyWidth / 2 - finOutwardSize / 2, finBodyLength, finOutwardSize);
    
    // Bottom fin: extends downwards from the body
    rect(finCenterX, bodyWidth / 2 + finOutwardSize / 2, finBodyLength, finOutwardSize);
  }
  
  isOffscreen() {
    return this.life <= 0;
  }
}