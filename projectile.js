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
    
    // Enhanced torpedo properties (set when weapon upgrade is active)
    this.enhanced = false;
    this.level = 0;
    this.damageMultiplier = 1.0;
    this.speedMultiplier = 1.0; 
    this.destructionMultiplier = 1.0;
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
    // Enhanced torpedoes have a higher chance to spawn particles
    let spawnChance = TORPEDO_TRAIL_PARTICLE_SPAWN_CHANCE;
    
    if (this.enhanced) {
      // Higher level means more particles
      spawnChance = min(1.0, spawnChance + (this.level * 0.15));
    }
    
    if (random() >= spawnChance) return;
    
    // For enhanced torpedoes, possibly spawn multiple particles 
    const particleCount = this.enhanced ? (1 + Math.floor(this.level / 1.5)) : 1;
    
    for (let i = 0; i < particleCount; i++) {
      const particlePosition = this.calculateTrailSpawnPosition();
      const particleVelocity = this.calculateParticleVelocity();
      
      // Base particle properties
      let lifespan = TORPEDO_TRAIL_PARTICLE_MAX_LIFESPAN;
      let minSize = TORPEDO_TRAIL_PARTICLE_MIN_SIZE;
      let maxSize = TORPEDO_TRAIL_PARTICLE_MAX_SIZE;
      let colorH = TORPEDO_TRAIL_PARTICLE_COLOR_H;
      let colorS = TORPEDO_TRAIL_PARTICLE_COLOR_S;
      let colorB = TORPEDO_TRAIL_PARTICLE_COLOR_B;
      let alphaMax = TORPEDO_TRAIL_PARTICLE_ALPHA_MAX;
      
      // Enhanced torpedo trail visuals
      if (this.enhanced) {
        // Level 1+: Longer lived, slightly larger particles
        lifespan *= (1 + this.level * 0.2);
        minSize *= (1 + this.level * 0.25);
        maxSize *= (1 + this.level * 0.25);
        
        // Level 2+: More saturated, brighter
        if (this.level >= 2) {
          colorS = min(100, colorS + 15);
          colorB = min(100, colorB + 10);
          
          // Level 3+: Particle color variation - more fiery/energetic look
          if (this.level >= 3) {
            // Randomly shift colors for some particles for a more energetic effect
            if (random() > 0.5) {
              colorH = (colorH + random(-30, 30)) % 360; 
            }
          }
        }
      }
      
      particles.push(new Particle(
        particlePosition.x,
        particlePosition.y,
        particleVelocity.x,
        particleVelocity.y,
        lifespan,
        minSize,
        maxSize,
        colorH,
        colorS,
        colorB,
        alphaMax
      ));
    }
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
    
    // Calculate destruction radius based on enhancement level
    let destructionRadius = 25; // Base radius
    
    // Apply enhanced destruction
    if (this.enhanced) {
      destructionRadius *= this.destructionMultiplier;
      if (DEBUG_MODE) {
        console.log(`Enhanced torpedo explosion: ${Math.round(destructionRadius)}px radius (${Math.round(this.destructionMultiplier * 100)}% of normal)`);
      }
    }
    
    cave.destroyBlocks(this.pos.x, this.pos.y, destructionRadius);
    createExplosion(this.pos.x, this.pos.y, 'wall', this.enhanced ? this.level : 0);
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
    
    // Base torpedo appearance
    let bodyLength = this.radius * TORPEDO_BODY_LENGTH_FACTOR;
    let bodyWidth = this.radius * TORPEDO_BODY_WIDTH_FACTOR;
    let colorH = TORPEDO_COLOR_H;
    let colorS = TORPEDO_COLOR_S;
    let colorB = TORPEDO_COLOR_B;
    let colorA = TORPEDO_COLOR_A;
    
    // Enhanced torpedo visuals
    if (this.enhanced) {
      // Scale size based on enhancement level (slight increase)
      bodyLength *= (1 + this.level * 0.15);
      bodyWidth *= (1 + this.level * 0.1);
      
      // More intense color for higher levels
      colorS = min(100, colorS + this.level * 10); // More saturated
      colorB = min(100, colorB + this.level * 5);  // Slightly brighter
      
      // Higher levels get more intense coloring
      if (this.level >= 2) {
        // Level 2+ gets an outer glow
        noFill();
        strokeWeight(1.5);
        stroke(colorH, colorS, colorB, 100);
        rect(0, 0, bodyLength + 4, bodyWidth + 4, 2);
        
        if (this.level >= 3) {
          // Level 3 gets a brighter, more intense color
          colorH = (colorH + frameCount % 10) % 360; // Subtle hue shift for top-level torpedoes
        }
      }
    }
    
    // Draw the main torpedo body
    noStroke();
    fill(colorH, colorS, colorB, colorA);
    rect(0, 0, bodyLength, bodyWidth, this.enhanced ? 2 : 0); // Rounded corners for enhanced torpedoes
  }
  
  renderTorpedoFins() {
    const bodyLength = this.radius * TORPEDO_BODY_LENGTH_FACTOR * (this.enhanced ? (1 + this.level * 0.15) : 1);
    const bodyWidth = this.radius * TORPEDO_BODY_WIDTH_FACTOR * (this.enhanced ? (1 + this.level * 0.1) : 1);
    const finOutwardSize = this.radius * TORPEDO_FIN_SIZE_FACTOR * (this.enhanced ? (1 + this.level * 0.2) : 1);
    const finBodyLength = bodyLength * (this.enhanced ? (0.35 + this.level * 0.05) : 0.35); // Slightly longer fins for enhanced torpedoes
    const finCenterX = -this.radius * TORPEDO_FIN_OFFSET_FACTOR; // Position towards the rear
    
    // Set fill color based on torpedo level
    if (this.enhanced) {
      // Higher level = more vibrant color
      let finColorH = TORPEDO_COLOR_H;
      let finColorS = TORPEDO_COLOR_S + (this.level * 5);
      let finColorB = TORPEDO_COLOR_B + (this.level * 5);
      
      // Level 3 gets a special color effect
      if (this.level >= 3) {
        // Make the fins glow and pulse
        finColorH = (TORPEDO_COLOR_H + frameCount % 30) % 360;
        finColorS = 100;
        finColorB = 90 + sin(frameCount * 0.1) * 10; // Pulsing brightness
      }
      
      fill(finColorH, finColorS, finColorB, TORPEDO_COLOR_A);
      
      // For level 2+, draw additional decorative fins
      if (this.level >= 2) {
        // Add diagonal stabilizer fins for level 2+
        const stabilizerSize = finOutwardSize * 0.7;
        const stabilizerX = finCenterX + finBodyLength * 0.3;
        
        // Upper-right fin
        push();
        translate(stabilizerX, -bodyWidth / 2);
        rotate(-PI / 4); // 45 degrees up-right
        rect(0, 0, stabilizerSize * 1.5, stabilizerSize * 0.5);
        pop();
        
        // Lower-right fin
        push();
        translate(stabilizerX, bodyWidth / 2);
        rotate(PI / 4); // 45 degrees down-right
        rect(0, 0, stabilizerSize * 1.5, stabilizerSize * 0.5);
        pop();
        
        if (this.level >= 3) {
          // Level 3 gets even more fins for a high-tech look
          push();
          translate(bodyLength/2 - stabilizerSize, 0);
          
          // Front upper stabilizer
          rotate(-PI / 4);
          rect(0, -stabilizerSize, stabilizerSize, stabilizerSize * 0.4);
          
          // Front lower stabilizer
          rotate(PI / 2);
          rect(0, -stabilizerSize, stabilizerSize, stabilizerSize * 0.4);
          pop();
        }
      }
    } else {
      // Regular torpedo color
      fill(TORPEDO_COLOR_H, TORPEDO_COLOR_S, TORPEDO_COLOR_B, TORPEDO_COLOR_A);
    }
    
    // Top fin: extends upwards from the body
    rect(finCenterX, -bodyWidth / 2 - finOutwardSize / 2, finBodyLength, finOutwardSize);
    
    // Bottom fin: extends downwards from the body
    rect(finCenterX, bodyWidth / 2 + finOutwardSize / 2, finBodyLength, finOutwardSize);
  }
  
  isOffscreen() {
    return this.life <= 0;
  }
}