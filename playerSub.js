// --- PlayerSub Class ---
// Debug mode flag - set to false to disable console logs
const DEBUG_MODE = false;

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
    
    // Powerup halo animation
    this.haloSize = 1.0;
    this.haloPhase = 0;
    this.haloAlphaBase = 120; // Base alpha for the halo
    this.haloPulseSpeed = 0.05; // How fast the halo pulses
  }
  fireSonar(cave, enemies, jellyfish) {
    this.lastSonarTime = frameCount;
    playSound('sonar');
    
    // Log sonar boost if active
    if (this.sonarBoost) {
      console.log(`Sonar enhanced! Range: ${Math.round(this.getEffectiveSonarRange())} (${Math.round(this.sonarBoost.rangeMultiplier * 100)}% boost), Cooldown: ${Math.round(this.getEffectiveSonarCooldown())} frames (${Math.round(this.sonarBoost.cooldownReduction * 100)}% of normal)`);
    }
    
    const playerInGoal = cave.isGoal(this.pos.x, this.pos.y);
    
    for (let i = 0; i < this.sonarPulses; i++) {
      this.castSonarRay(i, cave, enemies, jellyfish, playerInGoal);
    }
    
    this.cleanupOldSonarHits();
  }
  
  castSonarRay(rayIndex, cave, enemies, jellyfish, playerInGoal) {
    const rayAngle = this.angle - PI + (TWO_PI / this.sonarPulses) * rayIndex;
    let hitDetected = false;
    
    // Use effective sonar range with boost
    const effectiveRange = this.getEffectiveSonarRange();
    
    for (let dist = 0; dist < effectiveRange && !hitDetected; dist += PLAYER_SONAR_RAY_STEP) {
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
  }
  
  cleanupOldSonarHits() {
    const maxAge = this.sonarDisplayTime * PLAYER_SONAR_HIT_MAX_AGE_FACTOR;
    this.sonarHits = this.sonarHits.filter(hit => 
      frameCount - hit.receivedAt < maxAge
    );
  }
  shoot() {
    // Check for normal cooldown if no weapon upgrade is active
    if (!this.weaponUpgrade) {
      if (frameCount - this.lastShotTime < this.shotCooldown) return;
    } else {
      // With weapon upgrade, reduce cooldown based on level
      const cooldownReduction = this.weaponUpgrade.level * 0.25; // 25% reduction per level
      const effectiveCooldown = Math.max(10, this.shotCooldown * (1 - cooldownReduction));
      if (frameCount - this.lastShotTime < effectiveCooldown) return;
      
      if (DEBUG_MODE) {
        console.log(`Firing enhanced torpedo with cooldown: ${Math.round(effectiveCooldown)} (${Math.round(cooldownReduction * 100)}% reduction)`);
      }
    }
    
    const projectileStartX = this.pos.x + cos(this.angle) * this.radius * PLAYER_PROJECTILE_OFFSET_FACTOR;
    const projectileStartY = this.pos.y + sin(this.angle) * this.radius * PLAYER_PROJECTILE_OFFSET_FACTOR;
    
    // Create base projectile
    const projectile = new Projectile(projectileStartX, projectileStartY, this.angle);
    
    // Apply weapon upgrade effects if active
    if (this.weaponUpgrade) {
      projectile.enhanced = true;
      projectile.level = this.weaponUpgrade.level;
      projectile.damageMultiplier = 1 + (this.weaponUpgrade.level * 0.5); // 50% more damage per level
      projectile.speedMultiplier = 1 + (this.weaponUpgrade.level * 0.3); // 30% faster per level
      projectile.destructionMultiplier = 1 + (this.weaponUpgrade.level * 0.75); // 75% larger destruction per level
      
      // Apply speed boost immediately
      projectile.vel.mult(projectile.speedMultiplier);
      
      // Fire additional torpedoes at higher levels (spread pattern)
      if (this.weaponUpgrade.level >= 2) {
        this.fireAdditionalTorpedoes(projectileStartX, projectileStartY);
      }
    }
    
    projectiles.push(projectile);
    this.lastShotTime = frameCount;
    
    // Create launch visual effect for enhanced torpedoes
    if (this.weaponUpgrade) {
      this.createTorpedoLaunchEffect(
        projectileStartX, 
        projectileStartY, 
        this.angle,
        this.weaponUpgrade.level
      );
    }
    
    // Play appropriate sound
    if (this.weaponUpgrade && this.weaponUpgrade.level >= 3) {
      // Play an enhanced sound for highest level torpedoes
      playSound('explosion');
      playSound('torpedo');
    } else {
      playSound('torpedo');
    }
    
    // Create launch effects for enhanced torpedoes
    this.createTorpedoLaunchEffect(projectileStartX, projectileStartY, this.angle, this.weaponUpgrade ? this.weaponUpgrade.level : 0);
  }
  
  fireAdditionalTorpedoes(x, y) {
    // Level 2: fire 1 additional torpedo (total 2)
    // Level 3: fire 2 additional torpedoes (total 3)
    const additionalCount = this.weaponUpgrade.level - 1;
    const spreadAngle = PI / 12; // 15 degrees
    
    for (let i = 1; i <= additionalCount; i++) {
      // Alternate left/right for multiple torpedoes
      const sideMultiplier = i % 2 === 0 ? 1 : -1;
      const angleOffset = spreadAngle * Math.ceil(i/2) * sideMultiplier;
      
      const projectile = new Projectile(x, y, this.angle + angleOffset);
      projectile.enhanced = true;
      projectile.level = this.weaponUpgrade.level;
      projectile.damageMultiplier = 1 + (this.weaponUpgrade.level * 0.5);
      projectile.speedMultiplier = 1 + (this.weaponUpgrade.level * 0.3);
      projectile.destructionMultiplier = 1 + (this.weaponUpgrade.level * 0.75);
      
      // Apply speed boost immediately
      projectile.vel.mult(projectile.speedMultiplier);
      
      projectiles.push(projectile);
      
      // Create launch effect for each additional torpedo
      this.createTorpedoLaunchEffect(
        x, 
        y,
        this.angle + angleOffset,
        this.weaponUpgrade.level
      );
    }
  }
  update(cave, currentEnemies) {
    this.handleInput();
    this.handleCurrentAreas();
    this.updatePropeller();
    this.updateMovement(cave);
    this.updateAirSupply();
    this.updatePowerupEffects(); // Update powerup effects and expiration
    this.autoFireSonar(cave, currentEnemies);
  }
  
  handleInput() {
    // Calculate effective thrust power (with speed boost if active)
    let effectiveThrust = this.thrustPower;
    if (this.speedBoost && frameCount < this.speedBoost.expiresAt) {
      effectiveThrust *= this.speedBoost.multiplier;
    }
    
    // Thrust controls
    if (keyIsDown(UP_ARROW) || keyIsDown(KEY_CODE_W)) {
      this.vel.add(p5.Vector.fromAngle(this.angle).mult(effectiveThrust));
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(KEY_CODE_S)) {
      this.vel.add(p5.Vector.fromAngle(this.angle).mult(-effectiveThrust * PLAYER_REVERSE_THRUST_FACTOR));
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
    
    // Check if we're about to hit a wall
    const willHitWall = cave.isWall(nextPos.x, nextPos.y, this.radius * PLAYER_COLLISION_RADIUS_FACTOR);
    
    // Wall collision handling
    if (willHitWall) {
      this.handleWallCollision(cave);
    } else {
      this.pos.add(this.vel);
    }
    
    this.vel.mult(this.damping);
  }
  
  handleWallCollision(cave) {
    // Check if shield is active before handling collision physics
    const shieldActive = this.hasActiveShield();
    
    if (shieldActive) {
      // With shield active, we still need to stop movement but with less recoil
      this.pos.sub(this.vel.copy().mult(PLAYER_BUMP_RECOIL_FACTOR * 0.5));
      this.vel.mult(0.1); // Minimal velocity reduction with shield
      
      // Apply damage silently (shield absorbs it)
      this.takeDamage(PLAYER_BUMP_DAMAGE, 'wall collision');
      
      // No sound or visual effects when shielded
      
      // Debug log only if needed
      if (DEBUG_MODE) {
        console.log("Shield protected from wall collision");
      }
    } else {
      // Normal collision handling without shield
      this.pos.sub(this.vel.copy().mult(PLAYER_BUMP_RECOIL_FACTOR));
      this.vel.mult(PLAYER_BUMP_VELOCITY_REVERSE_FACTOR);
      this.takeDamage(PLAYER_BUMP_DAMAGE, 'wall collision');
      playSound('bump');
    }
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
    // Use effective cooldown with boost
    const effectiveCooldown = this.getEffectiveSonarCooldown();
    
    if (frameCount - this.lastSonarTime >= effectiveCooldown) {
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

  _renderPowerupHalo() {
    // Update halo animation
    this.haloPhase += this.haloPulseSpeed;
    this.haloSize = 1.0 + sin(this.haloPhase) * 0.1; // Subtle pulsing effect
  
    // Check if any powerup is active
    const hasPowerup = this.speedBoost || this.shield || this.sonarBoost || this.weaponUpgrade;
    if (!hasPowerup) return;
    
    noStroke();
    
    // Create a layered halo effect for each active powerup
    let haloRadius = this.radius * 1.8 * this.haloSize;
    let haloAlpha = this.haloAlphaBase + sin(this.haloPhase) * 30;
    
    // Draw multiple halos for multiple active powerups
    // Each powerup adds a colored ring to the halo
    if (this.shield && this.shield.active) {
      fill(280, 70, 80, haloAlpha); // Shield: Purple
      ellipse(0, 0, haloRadius, haloRadius);
      haloRadius -= 6; // Shrink for next layer
    }
    
    if (this.speedBoost && frameCount < this.speedBoost.expiresAt) {
      fill(60, 100, 95, haloAlpha); // Speed: Bright yellow
      ellipse(0, 0, haloRadius, haloRadius);
      haloRadius -= 6; // Shrink for next layer
    }
    
    if (this.sonarBoost && frameCount < this.sonarBoost.expiresAt) {
      fill(120, 80, 85, haloAlpha); // Sonar: Green
      ellipse(0, 0, haloRadius, haloRadius);
      haloRadius -= 6; // Shrink for next layer
    }
    
    if (this.weaponUpgrade && frameCount < this.weaponUpgrade.expiresAt) {
      fill(15, 90, 85, haloAlpha); // Weapon: Orange/red
      ellipse(0, 0, haloRadius, haloRadius);
    }
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

    // Render powerup halo behind the submarine
    this._renderPowerupHalo();
    
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
        // Check if shield is active before applying any effects
        const shieldActive = this.hasActiveShield();
        
        if (shieldActive) {
          // With shield active - creature collision is completely blocked
          // Only do the minimum required to prevent overlap
          
          // Apply damage silently (will be absorbed by shield with no effects)
          this.takeDamage(creatureType === 'jellyfish' ? JELLYFISH_DAMAGE : PLAYER_ENEMY_COLLISION_DAMAGE, 
                          `${creatureType} collision`);
          
          // Very minimal knockback with shield (just enough to prevent overlap)
          const minimalKnockback = p5.Vector.sub(this.pos, creature.pos)
            .normalize()
            .mult(PLAYER_ENEMY_COLLISION_KNOCKBACK * 0.15); // Very slight knockback
          this.vel.add(minimalKnockback);
          
          // No sound effects with shield
          
          // Debug log only if needed
          if (DEBUG_MODE) {
            console.log(`Shield protected from ${creatureType} collision`);
          }
        } else {
          // No shield - normal damage and knockback
          this.applyCreatureCollisionDamage(creatureType);
          this.applyCreatureKnockback(creature, creatureType);
          playSound('explosion');
        }
      }
    }
  }
  
  applyCreatureCollisionDamage(creatureType) {
    const damage = creatureType === 'jellyfish' ? JELLYFISH_DAMAGE : PLAYER_ENEMY_COLLISION_DAMAGE;
    this.takeDamage(damage, `${creatureType} collision`);
  }
  
  applyCreatureKnockback(creature, creatureType) {
    const knockbackMultiplier = creatureType === 'jellyfish' ? 1.5 : 1.0;
    const knockback = p5.Vector.sub(this.pos, creature.pos)
      .normalize()
      .mult(PLAYER_ENEMY_COLLISION_KNOCKBACK * knockbackMultiplier);
    this.vel.add(knockback);
  }
  
  updatePowerupEffects() {
    // Check old powerup state before updates
    const hadPowerups = this.weaponUpgrade || this.speedBoost || this.shield || this.sonarBoost;
    const hadShield = this.shield && this.shield.active;
    
    // Update weapon upgrade
    if (this.weaponUpgrade && frameCount >= this.weaponUpgrade.expiresAt) {
      const level = this.weaponUpgrade.level;
      this.weaponUpgrade = null;
      
      // Create a more obvious notification for weapon expiration
      showPowerupNotification(`Weapon Upgrade Lv.${level} expired!`, {h: 15, s: 90, b: 85});
      
      // Play a sound to indicate expiration
      playSound('bump');
      
      // Create visual effect for powerup expiration
      this.createPowerupExpirationEffect('weapon');
    }
    
    // Update speed boost
    if (this.speedBoost && frameCount >= this.speedBoost.expiresAt) {
      // Create visual effect before removing the powerup
      this.createPowerupExpirationEffect('speed');
      
      this.speedBoost = null;
      showPowerupNotification("Speed Boost expired!", {h: 60, s: 100, b: 95});
      playSound('bump');
    }
    
    // Update shield
    if (this.shield && frameCount >= this.shield.expiresAt) {
      // Create visual effect before removing the powerup
      this.createPowerupExpirationEffect('shield');
      
      this.shield = null;
      showPowerupNotification("Shield expired!", {h: 280, s: 70, b: 80});
      playSound('bump');
      
      if (DEBUG_MODE) {
        console.log("Shield expired due to time limit");
      }
    }
    
    // Update sonar boost
    if (this.sonarBoost && frameCount >= this.sonarBoost.expiresAt) {
      // Create visual effect before removing the powerup
      this.createPowerupExpirationEffect('sonar');
      
      this.sonarBoost = null;
      showPowerupNotification("Sonar Boost expired!", {h: 160, s: 80, b: 90});
      playSound('bump');
    }
    
    // Check new powerup state after updates
    const hasPowerups = this.weaponUpgrade || this.speedBoost || this.shield || this.sonarBoost;
    
    // Reset the halo phase when powerups are newly activated
    if (!hadPowerups && hasPowerups) {
      this.haloPhase = 0;
      this.haloPulseSpeed = 0.05 + random(0.01, 0.03); // Slightly randomize pulse speed
    }
  }
  
  // Check if shield is active and can absorb damage
  hasActiveShield() {
    // Simpler validation: shield object exists, is marked active, and hasn't expired
    const isActive = this.shield && 
                     this.shield.active && 
                     frameCount < this.shield.expiresAt;
    
    // Debug logging only if enabled
    if (DEBUG_MODE && this.shield && frameCount % 60 === 0) {
      console.log(`Shield status: active=${isActive}, expires in ${this.shield.expiresAt - frameCount} frames`);
    }
    
    return isActive;
  }
  
  // Apply damage with shield protection
  takeDamage(amount, damageSource = 'unknown') {
    if (this.hasActiveShield()) {
      // Shield silently absorbs the damage - no hit counter, no effects
      // Only log for debugging if needed
      if (DEBUG_MODE) {
        console.log(`Shield absorbed ${amount} damage from ${damageSource}`);
      }
      
      return; // No damage taken and shield remains active
    }
    
    // No shield - take damage normally
    this.health -= amount;
    if (this.health < 0) this.health = 0;
    console.log(`Took ${amount} damage from ${damageSource}. Health: ${this.health}`);
  }
  
  createShieldEffect(damageSource = 'unknown') {
    // Create sparkle particles around the submarine when shield absorbs damage
    let particleCount = 16;
    let flashIntensity = 1.0;
    
    // More intense effect for certain damage types
    if (damageSource.includes('enemy') || damageSource.includes('jellyfish')) {
      particleCount = 24; // More particles
      flashIntensity = 1.5; // Larger flash
    }
    
    // Create sparkle particles in a ring around the submarine
    for (let i = 0; i < particleCount; i++) {
      let angle = (TWO_PI / particleCount) * i;
      let distance = this.radius + 5 + random(10, 20); // More varied distance
      particles.push(new Particle(
        this.pos.x + cos(angle) * distance,
        this.pos.y + sin(angle) * distance,
        cos(angle) * random(1.5, 4.0),
        sin(angle) * random(1.5, 4.0),
        25 + random(-5, 15), // longer, varied lifetime
        3,  // minSize (larger)
        12,  // maxSize (larger)
        280, // purple hue (shield color)
        70,  // saturation
        90,  // brightness (brighter)
        255  // alphaMax
      ));
    }
    
    // Create a shield "flash" effect with a quick larger circle
    particles.push(new Particle(
      this.pos.x, 
      this.pos.y,
      0, // no movement
      0,
      15, // lifetime
      this.radius * 2 * flashIntensity, // start larger
      this.radius * 3 * flashIntensity, // grow more
      280, // purple hue (shield color)
      70,  
      95, // brighter 
      180 // semi-transparent
    ));
    
    // Add a second shield flash that persists longer
    particles.push(new Particle(
      this.pos.x, 
      this.pos.y,
      0, // no movement
      0,
      30, // longer lifetime
      this.radius * 1.7 * flashIntensity, // different size
      this.radius * 1.9 * flashIntensity, // minimal growth
      290, // slightly different color
      60,  
      85,  
      150 // more transparent
    ));
    
    // Show shield impact notification with time remaining
    if (this.shield && this.shield.expiresAt) {
      const secondsRemaining = Math.ceil((this.shield.expiresAt - frameCount) / 60);
      showPowerupNotification(`Shield blocked damage! (${secondsRemaining}s left)`, {h: 280, s: 70, b: 80});
    }
  }

  // Get actual sonar range accounting for any active sonar boost
  getEffectiveSonarRange() {
    if (this.sonarBoost) {
      return this.sonarRange * this.sonarBoost.rangeMultiplier;
    }
    return this.sonarRange;
  }
  
  // Get actual sonar cooldown accounting for any active sonar boost
  getEffectiveSonarCooldown() {
    if (this.sonarBoost) {
      return this.sonarCooldown * this.sonarBoost.cooldownReduction;
    }
    return this.sonarCooldown;
  }
  
  createTorpedoLaunchEffect(x, y, angle, level = 0) {
    // Only create special effects for enhanced torpedoes
    if (level === 0) return;
    
    // Number of particles scales with torpedo level
    const particleCount = 5 + (level * 5);
    const spreadAngle = PI / 6; // 30 degrees cone behind torpedo
    
    for (let i = 0; i < particleCount; i++) {
      // Create particles in a cone behind the firing direction
      const particleAngle = angle + PI + random(-spreadAngle/2, spreadAngle/2);
      const particleSpeed = random(0.5, 2) * (1 + level * 0.3);
      const particleVel = p5.Vector.fromAngle(particleAngle, particleSpeed);
      
      // Particle size and lifespan increase with torpedo level
      const lifespan = random(10, 30) * (1 + level * 0.2);
      const minSize = 1 + (level * 0.5);
      const maxSize = 2 + (level * 1);
      
      // Color based on level - brighter, more saturated for higher levels
      let hue = 30 + random(-10, 10); // Base orange with slight variation
      let saturation = 80 + (level * 5);
      let brightness = 90 + (level * 3);
      
      // Level 3 gets special colors
      if (level >= 3) {
        // Random variation between orange and yellow for a more energetic effect
        hue = random([30, 40, 50]); 
      }
      
      particles.push(new Particle(
        x, y,
        particleVel.x, particleVel.y,
        lifespan,
        minSize, maxSize,
        hue, saturation, brightness,
        200 // Alpha
      ));
    }
    
    // For level 3, add a special muzzle flash effect
    if (level >= 3) {
      // Create a bright flash at the launch point
      const flashSize = 8 + random(4);
      const flashLifespan = 8 + random(4);
      
      particles.push(new Particle(
        x, y,
        0, 0, // Stationary
        flashLifespan,
        flashSize, flashSize,
        40, 70, 100, // Bright yellow
        200 // Alpha
      ));
    }
  }
  
  createPowerupExpirationEffect(type) {
    // Create a burst of particles around the sub to indicate a powerup expiring
    const particleCount = 20;
    const color = {
      weapon: {h: 15, s: 90, b: 85}, // Orange/red
      speed: {h: 60, s: 100, b: 95}, // Bright yellow
      shield: {h: 280, s: 70, b: 80}, // Purple
      sonar: {h: 160, s: 80, b: 90}, // Teal
    };
    
    const particleColor = color[type] || {h: 0, s: 0, b: 80}; // Default to gray
    
    for (let i = 0; i < particleCount; i++) {
      const angle = random(TWO_PI);
      const distance = this.radius * 1.5;
      const x = this.pos.x + cos(angle) * distance;
      const y = this.pos.y + sin(angle) * distance;
      
      // Particles move outward from sub
      const speed = random(1, 3);
      const vel = p5.Vector.fromAngle(angle, speed);
      
      particles.push(new Particle(
        x, y,
        vel.x, vel.y,
        random(20, 40), // lifespan
        2, 4, // size range
        particleColor.h, particleColor.s, particleColor.b,
        200 // alpha
      ));
    }
  }
}