// --- PlayerSub Class ---
class PlayerSub {
  constructor(x, y, initialAir, airDepletionRatePerFrame) {
    // Position and movement
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.angle = 0;
    
    // Physical properties
    this.radius = PLAYER_RADIUS;
    this.thrustPower = PLAYER_THRUST_POWER;
    this.turnSpeed = PLAYER_TURN_SPEED;
    this.damping = PLAYER_DAMPING;
    this.maxSpeed = PLAYER_MAX_SPEED;
    this.health = PLAYER_INITIAL_HEALTH;
    
    // Sonar system
    this.sonarHits = [];
    this.sonarRange = PLAYER_SONAR_RANGE;
    this.sonarPulses = PLAYER_SONAR_PULSES;
    this.sonarCooldown = PLAYER_SONAR_COOLDOWN_FRAMES;
    this.lastSonarTime = -this.sonarCooldown; // Allow immediate first sonar
    this.sonarDisplayTime = PLAYER_SONAR_DISPLAY_TIME_FRAMES;
    
    // Air supply system
    this.initialAirSupply = initialAir;
    this.airSupply = this.initialAirSupply;
    this.airDepletionRate = airDepletionRatePerFrame;
    
    // Weapon system
    this.shotCooldown = PLAYER_SHOT_COOLDOWN_FRAMES;
    this.lastShotTime = -this.shotCooldown; // Allow immediate first shot
    
    // Animation and state
    this.propellerAngle = 0;
    this.wasInCurrent = false;
  }
  fireSonar(cave, enemies, jellyfish) {
    this.lastSonarTime = frameCount;
    playSound('sonar');
    
    const playerInGoal = cave.isGoal(this.pos.x, this.pos.y);
    
    for (let i = 0; i < this.sonarPulses; i++) {
      this.castSonarRay(i, cave, enemies, jellyfish, playerInGoal);
    }
    
    this.cleanupOldSonarHits();
  }
  
  castSonarRay(rayIndex, cave, enemies, jellyfish, playerInGoal) {
    const rayAngle = this.angle - PI + (TWO_PI / this.sonarPulses) * rayIndex;
    let hitDetected = false;
    
    for (let dist = 0; dist < this.sonarRange && !hitDetected; dist += PLAYER_SONAR_RAY_STEP) {
      const checkX = this.pos.x + cos(rayAngle) * dist;
      const checkY = this.pos.y + sin(rayAngle) * dist;
      
      hitDetected = this.checkSonarHits(checkX, checkY, dist, cave, enemies, jellyfish, playerInGoal);
    }
  }
  
  checkSonarHits(checkX, checkY, dist, cave, enemies, jellyfish, playerInGoal) {
    // Check for goal hit first (only if player is not in goal)
    if (!playerInGoal && cave.isGoal(checkX, checkY)) {
      this.addSonarHit(checkX, checkY, 'goal', dist, 
        PLAYER_SONAR_GOAL_HIT_INTENSITY_MAX, PLAYER_SONAR_GOAL_HIT_INTENSITY_MIN);
      return true;
    }
    
    // Check for enemy hits
    if (this.checkEnemyHits(checkX, checkY, dist, enemies)) return true;
    
    // Check for jellyfish hits
    if (this.checkJellyfishHits(checkX, checkY, dist, jellyfish)) return true;
    
    // Check for wall hits
    if (cave.isWall(checkX, checkY)) {
      this.addSonarHit(checkX, checkY, 'wall', dist,
        PLAYER_SONAR_WALL_INTENSITY_MAX, PLAYER_SONAR_WALL_INTENSITY_MIN);
      return true;
    }
    
    return false;
  }
  
  checkEnemyHits(checkX, checkY, dist, enemies) {
    for (const enemy of enemies) {
      if (p5.Vector.dist(createVector(checkX, checkY), enemy.pos) < enemy.radius) {
        this.addSonarHit(checkX, checkY, 'enemy', dist,
          PLAYER_SONAR_ENEMY_INTENSITY_MAX, PLAYER_SONAR_ENEMY_INTENSITY_MIN);
        playSound('creatureGrowl');
        return true;
      }
    }
    return false;
  }
  
  checkJellyfishHits(checkX, checkY, dist, jellyfish) {
    for (const jelly of jellyfish) {
      if (p5.Vector.dist(createVector(checkX, checkY), jelly.pos) < jelly.radius) {
        this.addSonarHit(checkX, checkY, 'jellyfish', dist,
          PLAYER_SONAR_ENEMY_INTENSITY_MAX, PLAYER_SONAR_ENEMY_INTENSITY_MIN);
        playSound('creatureGrowl');
        return true;
      }
    }
    return false;
  }
  
  addSonarHit(x, y, type, distance, maxIntensity, minIntensity) {
    const intensity = map(distance, 0, this.sonarRange, maxIntensity, minIntensity);
    this.sonarHits.push({
      x, y, type,
      receivedAt: frameCount,
      intensity
    });
    
    // Set global flag if this is the first goal discovery
    if (type === 'goal' && !goalDiscoveredBySonar) {
      goalDiscoveredBySonar = true;
    }
  }
  
  cleanupOldSonarHits() {
    const maxAge = this.sonarDisplayTime * PLAYER_SONAR_HIT_MAX_AGE_FACTOR;
    this.sonarHits = this.sonarHits.filter(hit => 
      frameCount - hit.receivedAt < maxAge
    );
  }
  shoot() {
    if (frameCount - this.lastShotTime < this.shotCooldown) return;
    
    const projectileStartX = this.pos.x + cos(this.angle) * this.radius * PLAYER_PROJECTILE_OFFSET_FACTOR;
    const projectileStartY = this.pos.y + sin(this.angle) * this.radius * PLAYER_PROJECTILE_OFFSET_FACTOR;
    
    projectiles.push(new Projectile(projectileStartX, projectileStartY, this.angle));
    this.lastShotTime = frameCount;
    playSound('torpedo');
  }
  update(cave, currentEnemies) {
    this.handleInput();
    this.handleCurrentAreas();
    this.updatePropeller();
    this.updateMovement(cave);
    this.updateAirSupply();
    this.autoFireSonar(cave, currentEnemies);
  }
  
  handleInput() {
    // Thrust controls
    if (keyIsDown(UP_ARROW) || keyIsDown(KEY_CODE_W)) {
      this.vel.add(p5.Vector.fromAngle(this.angle).mult(this.thrustPower));
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(KEY_CODE_S)) {
      this.vel.add(p5.Vector.fromAngle(this.angle).mult(-this.thrustPower * PLAYER_REVERSE_THRUST_FACTOR));
    }
    
    // Rotation controls
    if (keyIsDown(LEFT_ARROW) || keyIsDown(KEY_CODE_A)) {
      this.angle -= this.turnSpeed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(KEY_CODE_D)) {
      this.angle += this.turnSpeed;
    }
  }
  
  handleCurrentAreas() {
    const inCurrentArea = this.checkCurrentAreaCollision();
    
    // Play sound when entering current area
    if (inCurrentArea && !this.wasInCurrent) {
      playSound('current_flow');
    }
    this.wasInCurrent = inCurrentArea;
    
    // Apply current forces
    this.applyCurrentForces();
  }
  
  checkCurrentAreaCollision() {
    for (const area of currentAreas) {
      if (area.contains(this.pos.x, this.pos.y)) {
        return true;
      }
    }
    return false;
  }
  
  applyCurrentForces() {
    for (const area of currentAreas) {
      if (area.contains(this.pos.x, this.pos.y)) {
        this.vel.add(area.force);
      }
    }
  }
  
  updatePropeller() {
    if (this.vel.magSq() <= 0.01) return;
    
    this.propellerAngle += this.vel.mag() * PLAYER_PROPELLER_SPIN_SPEED_FACTOR;
    this.spawnPropellerBubbles();
  }
  
  spawnPropellerBubbles() {
    if (random() >= PROPELLER_BUBBLE_SPAWN_CHANCE_MOVING) return;
    
    const numBubbles = floor(random(1, PROPELLER_BUBBLE_MAX_COUNT_PER_SPAWN + 1));
    
    for (let i = 0; i < numBubbles; i++) {
      const bubblePos = this.calculateBubblePosition();
      sonarBubbles.push(new SonarBubble(bubblePos.x, bubblePos.y));
    }
  }
  
  calculateBubblePosition() {
    const relativeSpawnX = this.radius * PROPELLER_BUBBLE_SPAWN_X_OFFSET_FACTOR;
    const offsetX = random(-PROPELLER_BUBBLE_SPAWN_AREA_RADIUS, PROPELLER_BUBBLE_SPAWN_AREA_RADIUS);
    const offsetY = random(-PROPELLER_BUBBLE_SPAWN_AREA_RADIUS, PROPELLER_BUBBLE_SPAWN_AREA_RADIUS);
    
    const rotatedOffsetX = cos(this.angle) * (relativeSpawnX + offsetX) - sin(this.angle) * offsetY;
    const rotatedOffsetY = sin(this.angle) * (relativeSpawnX + offsetX) + cos(this.angle) * offsetY;
    
    return {
      x: this.pos.x + rotatedOffsetX,
      y: this.pos.y + rotatedOffsetY
    };
  }
  
  updateMovement(cave) {
    this.vel.limit(this.maxSpeed);
    const nextPos = p5.Vector.add(this.pos, this.vel);
    
    if (cave.isWall(nextPos.x, nextPos.y, this.radius * PLAYER_COLLISION_RADIUS_FACTOR)) {
      this.handleWallCollision();
    } else {
      this.pos.add(this.vel);
    }
    
    this.vel.mult(this.damping);
  }
  
  handleWallCollision() {
    this.pos.sub(this.vel.copy().mult(PLAYER_BUMP_RECOIL_FACTOR));
    this.vel.mult(PLAYER_BUMP_VELOCITY_REVERSE_FACTOR);
    this.health -= PLAYER_BUMP_DAMAGE;
    if (this.health < 0) this.health = 0;
    playSound('bump');
  }
  
  updateAirSupply() {
    this.airSupply -= this.airDepletionRate;
    if (this.airSupply < 0) this.airSupply = 0;
    
    this.handleLowAirWarning();
  }
  
  handleLowAirWarning() {
    const isLowAir = this.airSupply > 0 && 
      this.airSupply < this.initialAirSupply * PLAYER_LOW_AIR_THRESHOLD_FACTOR;
    
    if (audioInitialized && isLowAir) {
      if (millis() - lastLowAirBeepTime > LOW_AIR_BEEP_INTERVAL) {
        playSound('lowAir');
        lastLowAirBeepTime = millis();
      }
    } else if (audioInitialized && lowAirOsc && lowAirOsc.started && typeof lowAirOsc.stop === 'function') {
      lowAirEnv.triggerRelease(lowAirOsc);
    }
  }
  
  autoFireSonar(cave, currentEnemies) {
    if (frameCount - this.lastSonarTime >= this.sonarCooldown) {
      this.fireSonar(cave, currentEnemies, jellyfish);
    }
  }
  _renderSonarHits(offsetX, offsetY) {
    for (let i = this.sonarHits.length - 1; i >= 0; i--) {
      const hit = this.sonarHits[i];
      const age = frameCount - hit.receivedAt;
      
      if (age < this.sonarDisplayTime) {
        this.renderSonarHit(hit, age, offsetX, offsetY);
      } else {
        this.sonarHits.splice(i, 1);
      }
    }
  }
  
  renderSonarHit(hit, age, offsetX, offsetY) {
    const alpha = map(age, 0, this.sonarDisplayTime, PLAYER_SONAR_HIT_ALPHA_MAX, PLAYER_SONAR_HIT_ALPHA_MIN);
    let hitSize = map(age, 0, this.sonarDisplayTime, PLAYER_SONAR_HIT_SIZE_MAX, PLAYER_SONAR_HIT_SIZE_MIN) * hit.intensity;
    
    const displayX = hit.x - offsetX;
    const displayY = hit.y - offsetY;
    
    // Cull off-screen sonar pings for performance
    if (this.isOffScreen(displayX, displayY)) return;
    
    this.setSonarHitColor(hit.type, alpha, hit.intensity);
    
    if (hit.type === 'enemy' || hit.type === 'jellyfish') {
      hitSize *= PLAYER_SONAR_ENEMY_HIT_SIZE_FACTOR;
    }
    
    noStroke();
    ellipse(displayX, displayY, hitSize, hitSize);
  }
  
  isOffScreen(x, y) {
    const buffer = PLAYER_SONAR_HIT_OFFSCREEN_BUFFER;
    return x < -buffer || x > width + buffer || y < -buffer || y > height + buffer;
  }
  
  setSonarHitColor(type, alpha, intensity) {
    switch (type) {
      case 'wall':
        fill(PLAYER_SONAR_WALL_COLOR_H, PLAYER_SONAR_WALL_COLOR_S, PLAYER_SONAR_WALL_COLOR_B, alpha * intensity);
        break;
      case 'enemy':
        fill(PLAYER_SONAR_ENEMY_COLOR_H, PLAYER_SONAR_ENEMY_COLOR_S, PLAYER_SONAR_ENEMY_COLOR_B, alpha * intensity);
        break;
      case 'goal':
        fill(PLAYER_SONAR_GOAL_HIT_COLOR_H, PLAYER_SONAR_GOAL_HIT_COLOR_S, PLAYER_SONAR_GOAL_HIT_COLOR_B, alpha * intensity);
        break;
      case 'jellyfish':
        fill(PLAYER_SONAR_JELLYFISH_COLOR_H, PLAYER_SONAR_JELLYFISH_COLOR_S, PLAYER_SONAR_JELLYFISH_COLOR_B, alpha * intensity);
        break;
    }
  }

  _renderBody() {
    fill(PLAYER_COLOR_BODY_H, PLAYER_COLOR_BODY_S, PLAYER_COLOR_BODY_B);
    noStroke();
    ellipse(0, 0, this.radius * PLAYER_BODY_WIDTH_FACTOR, this.radius * PLAYER_BODY_HEIGHT_FACTOR);
  }

  _renderSail() {
    fill(PLAYER_COLOR_SAIL_H, PLAYER_COLOR_SAIL_S, PLAYER_COLOR_SAIL_B);
    rectMode(CENTER);
    rect(this.radius * PLAYER_SAIL_OFFSET_X_FACTOR, 0, this.radius * PLAYER_SAIL_WIDTH_FACTOR, this.radius * PLAYER_SAIL_HEIGHT_FACTOR, this.radius * PLAYER_SAIL_CORNER_RADIUS_FACTOR);
    rectMode(CORNER); // Reset rectMode
  }

  _renderFin() {
    fill(PLAYER_COLOR_FIN_H, PLAYER_COLOR_FIN_S, PLAYER_COLOR_FIN_B);
    beginShape();
    vertex(-this.radius * PLAYER_FIN_X1_FACTOR, -this.radius * PLAYER_FIN_Y1_FACTOR);
    vertex(-this.radius * PLAYER_FIN_X2_FACTOR, this.radius * PLAYER_FIN_Y2_FACTOR);
    vertex(-this.radius * PLAYER_FIN_X3_FACTOR, this.radius * PLAYER_FIN_Y3_FACTOR);
    vertex(-this.radius * PLAYER_FIN_X4_FACTOR, -this.radius * PLAYER_FIN_Y4_FACTOR);
    endShape(CLOSE);
  }

  _renderPropeller() {
    push();
    translate(this.radius * PLAYER_PROPELLER_X_OFFSET_FACTOR, 0); // Position propeller at the back

    fill(PLAYER_COLOR_PROPELLER_H, PLAYER_COLOR_PROPELLER_S, PLAYER_COLOR_PROPELLER_B);
    noStroke();

    let apparentHeight = this.radius * PLAYER_PROPELLER_MAX_SIDE_HEIGHT_FACTOR * abs(sin(this.propellerAngle));
    let thickness = this.radius * PLAYER_PROPELLER_THICKNESS_FACTOR;

    rectMode(CENTER);
    rect(0, 0, thickness, apparentHeight);
    rectMode(CORNER); // Reset rectMode

    pop(); // End propeller transformations
  }

  render(offsetX, offsetY) {
    // Render Sonar Hits FIRST, so they are behind the player sub
    this._renderSonarHits(offsetX, offsetY);

    push();
    translate(width / 2, height / 2); // Player is always centered
    rotate(this.angle); // And rotated

    this._renderBody();
    this._renderSail();
    this._renderFin();
    this._renderPropeller();
    
    // Note: rectMode(CORNER) is reset inside _renderSail and _renderPropeller if they use CENTER.
    // If other parts used rectMode(CENTER) and didn't reset, it might be an issue.
    // However, ellipse and beginShape/endShape are not affected by rectMode.
    // The main pop() will restore the drawing context anyway.

    pop(); // End player transformations

    // Sonar Cooldown Indicator (currently commented out)
    //let sonarCycleProgress = (frameCount - this.lastSonarTime) / this.sonarCooldown;
    //sonarCycleProgress = sonarCycleProgress - floor(sonarCycleProgress); // Keep it 0-1
    //noFill(); strokeWeight(PLAYER_SONAR_ARC_WEIGHT); stroke(PLAYER_SONAR_ARC_COLOR_H, PLAYER_SONAR_ARC_COLOR_S, PLAYER_SONAR_ARC_COLOR_B, PLAYER_SONAR_ARC_COLOR_A);
    //arc(width / 2, height / 2, this.radius * PLAYER_SONAR_ARC_RADIUS_FACTOR, this.radius * PLAYER_SONAR_ARC_RADIUS_FACTOR, -PI / 2, -PI / 2 + TWO_PI * sonarCycleProgress);

    strokeWeight(DEFAULT_STROKE_WEIGHT); // Reset stroke weight
  }
  handleEnemyCollisions(enemies) {
    this.handleCreatureCollisions(enemies, 'enemy');
  }
  
  handleJellyfishCollisions(jellyfish) {
    this.handleCreatureCollisions(jellyfish, 'jellyfish');
  }
  
  handleCreatureCollisions(creatures, creatureType) {
    for (let i = creatures.length - 1; i >= 0; i--) {
      const creature = creatures[i];
      const distance = dist(this.pos.x, this.pos.y, creature.pos.x, creature.pos.y);
      const collisionRadius = this.radius * PLAYER_COLLISION_RADIUS_FACTOR + creature.radius;
      
      if (distance < collisionRadius) {
        this.applyCreatureCollisionDamage(creatureType);
        this.applyCreatureKnockback(creature, creatureType);
        playSound('explosion');
      }
    }
  }
  
  applyCreatureCollisionDamage(creatureType) {
    const damage = creatureType === 'jellyfish' ? JELLYFISH_DAMAGE : PLAYER_ENEMY_COLLISION_DAMAGE;
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }
  
  applyCreatureKnockback(creature, creatureType) {
    const knockbackMultiplier = creatureType === 'jellyfish' ? 1.5 : 1.0;
    const knockback = p5.Vector.sub(this.pos, creature.pos)
      .normalize()
      .mult(PLAYER_ENEMY_COLLISION_KNOCKBACK * knockbackMultiplier);
    this.vel.add(knockback);
  }
}