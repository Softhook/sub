// --- PlayerSub Class ---
class PlayerSub {
  constructor(x, y, initialAir, airDepletionRatePerFrame) {
    this.pos = createVector(x, y); 
    this.vel = createVector(0, 0); 
    this.angle = 0;
    this.radius = PLAYER_RADIUS; 
    this.thrustPower = PLAYER_THRUST_POWER; 
    this.turnSpeed = PLAYER_TURN_SPEED;
    this.damping = PLAYER_DAMPING; 
    this.maxSpeed = PLAYER_MAX_SPEED;
    this.sonarHits = []; 
    this.sonarRange = PLAYER_SONAR_RANGE; 
    this.sonarPulses = PLAYER_SONAR_PULSES;
    this.sonarCooldown = PLAYER_SONAR_COOLDOWN_FRAMES; 
    this.lastSonarTime = -this.sonarCooldown; // Allow immediate first sonar
    this.sonarDisplayTime = PLAYER_SONAR_DISPLAY_TIME_FRAMES; 
    this.health = PLAYER_INITIAL_HEALTH;
    this.initialAirSupply = initialAir; 
    this.airSupply = this.initialAirSupply;
    this.airDepletionRate = airDepletionRatePerFrame;
    this.shotCooldown = PLAYER_SHOT_COOLDOWN_FRAMES; 
    this.lastShotTime = -this.shotCooldown; // Allow immediate first shot
    this.propellerAngle = 0; // For propeller animation
  }

  fireSonar(cave, enemies, jellyfish) {
    this.lastSonarTime = frameCount; 
    playSound('sonar');
    let playerInGoal = cave.isGoal(this.pos.x, this.pos.y); // Check if player is in goal

    for (let i = 0; i < this.sonarPulses; i++) {
      let rayAngle = this.angle - PI + (TWO_PI / this.sonarPulses) * i; // Sonar sweeps around the sub
      let hitDetectedOnRay = false;
      for (let dist = 0; dist < this.sonarRange; dist += PLAYER_SONAR_RAY_STEP) {
        if (hitDetectedOnRay) break; // Optimization: stop ray if something is hit
        let checkX = this.pos.x + cos(rayAngle) * dist; 
        let checkY = this.pos.y + sin(rayAngle) * dist;
        
        // Check for goal hit first
        // Only detect goal with sonar if player is NOT in goal
        if (!playerInGoal && cave.isGoal(checkX, checkY)) { 
            this.sonarHits.push({ 
                x: checkX, y: checkY, type: 'goal', receivedAt: frameCount, 
                intensity: map(dist, 0, this.sonarRange, PLAYER_SONAR_GOAL_HIT_INTENSITY_MAX, PLAYER_SONAR_GOAL_HIT_INTENSITY_MIN) 
            });
            hitDetectedOnRay = true; 
            break; // Goal hit, stop this ray
        }

        // Check for enemy hits first
        for (let enemy of enemies) {
          if (p5.Vector.dist(createVector(checkX, checkY), enemy.pos) < enemy.radius) {
            this.sonarHits.push({ 
              x: checkX, y: checkY, type: 'enemy', receivedAt: frameCount, 
              intensity: map(dist, 0, this.sonarRange, PLAYER_SONAR_ENEMY_INTENSITY_MAX, PLAYER_SONAR_ENEMY_INTENSITY_MIN) 
            });
            hitDetectedOnRay = true; 
            playSound('creatureGrowl'); // Play creature growl when enemy hit by sonar
            break;
          }
        }
        if (hitDetectedOnRay) break; // If enemy hit, don't check for wall at same spot
        
        // Check for jellyfish hits
        for (let jelly of jellyfish) {
          if (p5.Vector.dist(createVector(checkX, checkY), jelly.pos) < jelly.radius) {
            this.sonarHits.push({ 
              x: checkX, y: checkY, type: 'jellyfish', receivedAt: frameCount, 
              intensity: map(dist, 0, this.sonarRange, PLAYER_SONAR_ENEMY_INTENSITY_MAX, PLAYER_SONAR_ENEMY_INTENSITY_MIN) 
            });
            hitDetectedOnRay = true;
            playSound('creatureGrowl');
            break;
          }
        }
        if (hitDetectedOnRay) break; // If jellyfish hit, don't check for wall at same spot
        
        // Check for wall hits
        if (cave.isWall(checkX, checkY)) {
          this.sonarHits.push({ 
            x: checkX, y: checkY, type: 'wall', receivedAt: frameCount, 
            intensity: map(dist, 0, this.sonarRange, PLAYER_SONAR_WALL_INTENSITY_MAX, PLAYER_SONAR_WALL_INTENSITY_MIN) 
          });
          hitDetectedOnRay = true;
        }
      }
    }
    // Filter out very old sonar hits to prevent memory buildup (though render also filters)
    this.sonarHits = this.sonarHits.filter(hit => frameCount - hit.receivedAt < this.sonarDisplayTime * PLAYER_SONAR_HIT_MAX_AGE_FACTOR);
  }

  shoot() {
    if (frameCount - this.lastShotTime >= this.shotCooldown) {
      let pStartX = this.pos.x + cos(this.angle) * this.radius * PLAYER_PROJECTILE_OFFSET_FACTOR;
      let pStartY = this.pos.y + sin(this.angle) * this.radius * PLAYER_PROJECTILE_OFFSET_FACTOR;
      projectiles.push(new Projectile(pStartX, pStartY, this.angle));
      this.lastShotTime = frameCount; 
      playSound('torpedo');
    }
  }

  update(cave, currentEnemies, currentAreas = []) {
    if (keyIsDown(UP_ARROW) || keyIsDown(KEY_CODE_W)) this.vel.add(p5.Vector.fromAngle(this.angle).mult(this.thrustPower));
    if (keyIsDown(DOWN_ARROW) || keyIsDown(KEY_CODE_S)) this.vel.add(p5.Vector.fromAngle(this.angle).mult(-this.thrustPower * PLAYER_REVERSE_THRUST_FACTOR));
    if (keyIsDown(LEFT_ARROW) || keyIsDown(KEY_CODE_A)) this.angle -= this.turnSpeed;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(KEY_CODE_D)) this.angle += this.turnSpeed;

    // Update propeller angle based on movement
    if (this.vel.magSq() > 0.01) { // Check if moving (magSq is cheaper than mag)
        this.propellerAngle += this.vel.mag() * PLAYER_PROPELLER_SPIN_SPEED_FACTOR;

        // Generate propeller bubbles
        if (random() < PROPELLER_BUBBLE_SPAWN_CHANCE_MOVING) {
            let numBubbles = floor(random(1, PROPELLER_BUBBLE_MAX_COUNT_PER_SPAWN + 1));
            for (let i = 0; i < numBubbles; i++) {
                // Calculate bubble spawn position relative to player center, then rotate by player angle
                let relativeSpawnX = this.radius * PROPELLER_BUBBLE_SPAWN_X_OFFSET_FACTOR;
                let relativeSpawnY = 0; // Bubbles originate from the center of the propeller vertically

                // Add small random offset
                let offsetX = random(-PROPELLER_BUBBLE_SPAWN_AREA_RADIUS, PROPELLER_BUBBLE_SPAWN_AREA_RADIUS);
                let offsetY = random(-PROPELLER_BUBBLE_SPAWN_AREA_RADIUS, PROPELLER_BUBBLE_SPAWN_AREA_RADIUS);

                let rotatedOffsetX = cos(this.angle) * (relativeSpawnX + offsetX) - sin(this.angle) * offsetY;
                let rotatedOffsetY = sin(this.angle) * (relativeSpawnX + offsetX) + cos(this.angle) * offsetY;
                
                let bubbleX = this.pos.x + rotatedOffsetX;
                let bubbleY = this.pos.y + rotatedOffsetY;
                sonarBubbles.push(new SonarBubble(bubbleX, bubbleY));
            }
        }
    }

    // Apply current area forces
    for (let area of currentAreas) {
      if (area.contains(this.pos.x, this.pos.y)) {
        this.vel.add(area.force);
      }
    }

    if (frameCount - this.lastSonarTime >= this.sonarCooldown) this.fireSonar(cave, currentEnemies, jellyfish);

    this.vel.limit(this.maxSpeed); 
    let nextPos = p5.Vector.add(this.pos, this.vel);
    if (cave.isWall(nextPos.x, nextPos.y, this.radius * PLAYER_COLLISION_RADIUS_FACTOR)) {
      this.pos.sub(this.vel.copy().mult(PLAYER_BUMP_RECOIL_FACTOR)); // Move back slightly
      this.vel.mult(PLAYER_BUMP_VELOCITY_REVERSE_FACTOR); // Reverse and dampen velocity
      this.health -= PLAYER_BUMP_DAMAGE; 
      if (this.health < 0) this.health = 0; 
      playSound('bump');
    } else {
      this.pos.add(this.vel);
    }
    this.vel.mult(this.damping); 
    this.airSupply -= this.airDepletionRate;
    if (this.airSupply < 0) this.airSupply = 0;

    // Low air warning sound
    if (audioInitialized && this.airSupply > 0 && this.airSupply < this.initialAirSupply * PLAYER_LOW_AIR_THRESHOLD_FACTOR) {
      if (millis() - lastLowAirBeepTime > LOW_AIR_BEEP_INTERVAL) { 
        playSound('lowAir'); 
        lastLowAirBeepTime = millis(); 
      }
    } else if (audioInitialized && lowAirOsc && lowAirOsc.started && typeof lowAirOsc.stop === 'function') {
      // Ensure low air sound stops if air is replenished or game not active
      lowAirEnv.triggerRelease(lowAirOsc);
    }
  }

  _renderSonarHits(offsetX, offsetY) {
    for (let i = this.sonarHits.length - 1; i >= 0; i--) {
      let hit = this.sonarHits[i]; 
      let age = frameCount - hit.receivedAt;
      if (age < this.sonarDisplayTime) {
        let alpha = map(age, 0, this.sonarDisplayTime, PLAYER_SONAR_HIT_ALPHA_MAX, PLAYER_SONAR_HIT_ALPHA_MIN);
        let hitSize = map(age, 0, this.sonarDisplayTime, PLAYER_SONAR_HIT_SIZE_MAX, PLAYER_SONAR_HIT_SIZE_MIN) * hit.intensity;
        let displayX = hit.x - offsetX; 
        let displayY = hit.y - offsetY;
        // Cull off-screen sonar pings for performance
        if (displayX < -PLAYER_SONAR_HIT_OFFSCREEN_BUFFER || displayX > width + PLAYER_SONAR_HIT_OFFSCREEN_BUFFER || 
            displayY < -PLAYER_SONAR_HIT_OFFSCREEN_BUFFER || displayY > height + PLAYER_SONAR_HIT_OFFSCREEN_BUFFER) continue;

        if (hit.type === 'wall') fill(PLAYER_SONAR_WALL_COLOR_H, PLAYER_SONAR_WALL_COLOR_S, PLAYER_SONAR_WALL_COLOR_B, alpha * hit.intensity);
        else if (hit.type === 'enemy') { 
          fill(PLAYER_SONAR_ENEMY_COLOR_H, PLAYER_SONAR_ENEMY_COLOR_S, PLAYER_SONAR_ENEMY_COLOR_B, alpha * hit.intensity); 
          hitSize *= PLAYER_SONAR_ENEMY_HIT_SIZE_FACTOR; 
        }
        else if (hit.type === 'goal') { 
          fill(PLAYER_SONAR_GOAL_HIT_COLOR_H, PLAYER_SONAR_GOAL_HIT_COLOR_S, PLAYER_SONAR_GOAL_HIT_COLOR_B, alpha * hit.intensity); 
        }
        else if (hit.type === 'jellyfish') { 
          fill(PLAYER_SONAR_JELLYFISH_COLOR_H, PLAYER_SONAR_JELLYFISH_COLOR_S, PLAYER_SONAR_JELLYFISH_COLOR_B, alpha * hit.intensity); 
          hitSize *= PLAYER_SONAR_ENEMY_HIT_SIZE_FACTOR; 
        }
        noStroke(); 
        ellipse(displayX, displayY, hitSize, hitSize);
      } else {
        this.sonarHits.splice(i, 1); // Remove old hits
      }
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

    pop(); // End player transformations
  }

  handleEnemyCollisions(enemies) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      let d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
      if (d < this.radius * PLAYER_COLLISION_RADIUS_FACTOR + enemy.radius) { // Use consistent collision factor
        this.health -= PLAYER_ENEMY_COLLISION_DAMAGE; 
        if (this.health < 0) this.health = 0;
        let knockbackPlayer = p5.Vector.sub(this.pos, enemy.pos).normalize().mult(PLAYER_ENEMY_COLLISION_KNOCKBACK);
        this.vel.add(knockbackPlayer);
        playSound('explosion'); // Play explosion sound for enemy destruction
      }
    }
  }

  handleJellyfishCollisions(jellyfish) {
    for (let i = jellyfish.length - 1; i >= 0; i--) {
      let jelly = jellyfish[i];
      let d = dist(this.pos.x, this.pos.y, jelly.pos.x, jelly.pos.y);
      if (d < this.radius * PLAYER_COLLISION_RADIUS_FACTOR + jelly.radius) {
        this.health -= JELLYFISH_DAMAGE; // More damage than regular enemies
        if (this.health < 0) this.health = 0;
        let knockbackPlayer = p5.Vector.sub(this.pos, jelly.pos).normalize().mult(PLAYER_ENEMY_COLLISION_KNOCKBACK * 1.5); // Stronger knockback
        this.vel.add(knockbackPlayer);
        playSound('explosion'); // Play explosion sound for collision
      }
    }
  }
}
