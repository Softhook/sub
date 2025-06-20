// --- Projectile Class ---
class Projectile {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle).mult(PROJECTILE_SPEED);
    this.radius = PROJECTILE_RADIUS; // Base size for torpedo
    this.life = PROJECTILE_LIFESPAN_FRAMES;
    this.angle = angle; // Store the angle for rendering and trail
  }
  update(cave) {
    this.pos.add(this.vel); this.life--;

    // Spawn trail particles
    if (random() < TORPEDO_TRAIL_PARTICLE_SPAWN_CHANCE) {
        let particleAngleOffset = random(-TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE / 2, TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE / 2);
        let particleBaseAngle = this.angle + Math.PI; // Particles move away from torpedo\'s rear
        let finalParticleAngle = particleBaseAngle + particleAngleOffset;
        let particleSpeed = random(TORPEDO_TRAIL_PARTICLE_SPEED_MIN, TORPEDO_TRAIL_PARTICLE_SPEED_MAX);
        
        // Spawn particles from the rear of the torpedo
        let trailSpawnX = this.pos.x + cos(this.angle) * (this.radius * TORPEDO_TRAIL_OFFSET_FACTOR);
        let trailSpawnY = this.pos.y + sin(this.angle) * (this.radius * TORPEDO_TRAIL_OFFSET_FACTOR);

        let particleVel = p5.Vector.fromAngle(finalParticleAngle, particleSpeed); // More concise

        particles.push(new Particle(
            trailSpawnX,
            trailSpawnY,
            particleVel.x, // Use components of the vector
            particleVel.y,
            TORPEDO_TRAIL_PARTICLE_MAX_LIFESPAN,
            TORPEDO_TRAIL_PARTICLE_MIN_SIZE,
            TORPEDO_TRAIL_PARTICLE_MAX_SIZE,
            TORPEDO_TRAIL_PARTICLE_COLOR_H,
            TORPEDO_TRAIL_PARTICLE_COLOR_S,
            TORPEDO_TRAIL_PARTICLE_COLOR_B,
            TORPEDO_TRAIL_PARTICLE_ALPHA_MAX
        ));
    }

    // Check collision with a smaller radius for projectiles to feel more accurate
    if (cave.isWall(this.pos.x, this.pos.y, this.radius * PROJECTILE_WALL_COLLISION_RADIUS_FACTOR)) {
        this.life = 0;
        
        // Destroy cave blocks around the impact point
        cave.destroyBlocks(this.pos.x, this.pos.y, 25); // 25 pixel radius destruction
        
        createExplosion(this.pos.x, this.pos.y, 'wall');
        playSound('explosion'); // Play explosion sound for wall hit
    }
  }
  render(offsetX, offsetY) {
    push();
    translate(this.pos.x - offsetX, this.pos.y - offsetY);
    rotate(this.angle); // Rotate by the stored angle

    rectMode(CENTER);
    fill(TORPEDO_COLOR_H, TORPEDO_COLOR_S, TORPEDO_COLOR_B, TORPEDO_COLOR_A);
    noStroke();

    let bodyLen = this.radius * TORPEDO_BODY_LENGTH_FACTOR;
    let bodyWid = this.radius * TORPEDO_BODY_WIDTH_FACTOR;

    // Body
    rect(0, 0, bodyLen, bodyWid);

    // Fins
    // TORPEDO_FIN_SIZE_FACTOR determines the fin's dimension extending outwards from the body.
    // TORPEDO_FIN_OFFSET_FACTOR determines how far back from the torpedo's center the fin's center is.
    let finOutwardSize = this.radius * TORPEDO_FIN_SIZE_FACTOR;
    let finBodyLength = bodyLen * 0.35; // Fin length along the torpedo's body (e.g., 35% of body length)
    let finCenterX = -this.radius * TORPEDO_FIN_OFFSET_FACTOR; // Negative to place it towards the rear

    // Top Fin: Extends upwards from the body
    // rect(x_center_of_fin, y_center_of_fin, fin_length_along_torpedo, fin_width_extending_outward)
    rect(finCenterX, -bodyWid / 2 - finOutwardSize / 2, finBodyLength, finOutwardSize);

    // Bottom Fin: Extends downwards from the body
    rect(finCenterX,  bodyWid / 2 + finOutwardSize / 2, finBodyLength, finOutwardSize);
    
    rectMode(CORNER); // Reset rectMode
    pop();
  }
  isOffscreen() { return this.life <= 0; }
}