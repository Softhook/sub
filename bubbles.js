// --- SonarBubble Class ---
class SonarBubble {
  constructor(x, y) {
    this.pos = createVector(x, y); // Position is now exact as passed
    this.velY = random(SONAR_BUBBLE_MIN_SPEED_Y, SONAR_BUBBLE_MAX_SPEED_Y);
    this.lifespan = SONAR_BUBBLE_MAX_LIFESPAN_FRAMES;
    this.size = random(SONAR_BUBBLE_MIN_SIZE, SONAR_BUBBLE_MAX_SIZE);
    this.initialLifespan = this.lifespan;
  }

  update() {
    // Check if this bubble has custom velocity (from current areas)
    if (this.vel) {
      this.pos.add(this.vel); // Use vector velocity for current bubbles
    } else {
      this.pos.y -= this.velY; // Use default upward movement for regular sonar bubbles
    }
    this.lifespan--;
  }

  render(offsetX, offsetY) {
    let ageRatio = this.lifespan / this.initialLifespan;
    let alpha = SONAR_BUBBLE_ALPHA_MAX * ageRatio;
    fill(SONAR_BUBBLE_COLOR_H, SONAR_BUBBLE_COLOR_S, SONAR_BUBBLE_COLOR_B, alpha);
    noStroke();
    ellipse(this.pos.x - offsetX, this.pos.y - offsetY, this.size);
  }

  isOffscreen() {
    return this.lifespan <= 0;
  }
}

// --- Particle Class (for Torpedo Trails and other effects) ---
class Particle {
  constructor(x, y, velX, velY, lifespan, minSize, maxSize, colorH, colorS, colorB, alphaMax) {
    this.pos = createVector(x, y);
    this.vel = createVector(velX, velY);
    this.lifespan = lifespan;
    this.initialLifespan = lifespan;
    this.size = random(minSize, maxSize);
    this.colorH = colorH;
    this.colorS = colorS;
    this.colorB = colorB;
    this.alphaMax = alphaMax;
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan--;
  }

  render(offsetX, offsetY) {
    let ageRatio = this.lifespan / this.initialLifespan;
    let currentAlpha = this.alphaMax * ageRatio;
    fill(this.colorH, this.colorS, this.colorB, currentAlpha);
    noStroke();
    ellipse(this.pos.x - offsetX, this.pos.y - offsetY, this.size);
  }

  isOffscreen() {
    return this.lifespan <= 0;
  }
}

// --- CurrentArea Class ---
class CurrentArea {
  constructor(x, y, w, h, forceDirection, forceMagnitude) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.forceDirection = forceDirection; // p5.Vector
    this.forceMagnitude = forceMagnitude;
    this.force = p5.Vector.mult(this.forceDirection, this.forceMagnitude);
  }

  // Check if a point (px, py) is inside this current area
  contains(px, py) {
    return px >= this.x && px <= this.x + this.width &&
           py >= this.y && py <= this.y + this.height;
  }

  // Spawn bubbles within the area to indicate the current
  spawnBubbles(cave, cameraOffsetX, cameraOffsetY) {
    if (!cave) return; // Safety check
    
    // Only spawn bubbles if current area is visible on screen (with some margin)
    let margin = 100; // Extra margin to spawn bubbles just off-screen
    let screenLeft = cameraOffsetX - margin;
    let screenRight = cameraOffsetX + width + margin;
    let screenTop = cameraOffsetY - margin;
    let screenBottom = cameraOffsetY + height + margin;
    
    // Check if current area intersects with visible screen area
    if (this.x + this.width < screenLeft || this.x > screenRight ||
        this.y + this.height < screenTop || this.y > screenBottom) {
      return; // Current area not visible, skip bubble spawning
    }
    
    // Only calculate spawning for the visible portion of the current area
    let visibleLeft = Math.max(this.x, screenLeft);
    let visibleRight = Math.min(this.x + this.width, screenRight);
    let visibleTop = Math.max(this.y, screenTop);
    let visibleBottom = Math.min(this.y + this.height, screenBottom);
    
    let visibleWidth = visibleRight - visibleLeft;
    let visibleHeight = visibleBottom - visibleTop;
    
    if (visibleWidth <= 0 || visibleHeight <= 0) return;
    
    // Density determines how many bubbles to try to spawn per frame (based on visible area)
    let bubblesToSpawn = floor(visibleWidth * visibleHeight * CURRENT_BUBBLE_SPAWN_DENSITY);
    if (random() < (visibleWidth * visibleHeight * CURRENT_BUBBLE_SPAWN_DENSITY) % 1) {
        bubblesToSpawn++; // Probabilistically add one more bubble for fractional parts
    }

    for (let i = 0; i < bubblesToSpawn; i++) {
      let bubbleX = random(visibleLeft, visibleRight);
      let bubbleY = random(visibleTop, visibleBottom);
      
      // Only spawn bubbles in open water (not in walls)
      if (cave.isWall(bubbleX, bubbleY)) {
        continue; // Skip this bubble if it would spawn in a wall
      }
      
      // Bubbles should generally move with the current, but with some randomness
      let bubbleVel = p5.Vector.add(this.force, p5.Vector.random2D().mult(0.1)); // Slight random drift
      bubbleVel.mult(CURRENT_BUBBLE_SPEED_MULTIPLIER);

      // Create a sonar bubble instead of regular bubble
      let newBubble = new SonarBubble(bubbleX, bubbleY);
      
      // Override the default sonar bubble velocity to move with the current
      newBubble.vel = bubbleVel; // Override default upward movement
      
      // Adjust lifespan for current bubbles
      newBubble.lifespan = BUBBLE_LIFESPAN_FRAMES * CURRENT_BUBBLE_LIFESPAN_FACTOR;
      newBubble.initialLifespan = newBubble.lifespan;
      
      sonarBubbles.push(newBubble);
    }
  }

  // Render the current area (with debug visuals if enabled)
  render(offsetX, offsetY) {
    if (!debugShowWalls) return; // Early exit if debug mode is off
    
    // Only render if current area is visible on screen
    let screenLeft = offsetX;
    let screenRight = offsetX + width;
    let screenTop = offsetY;
    let screenBottom = offsetY + height;
    
    // Check if current area intersects with visible screen area
    if (this.x + this.width < screenLeft || this.x > screenRight ||
        this.y + this.height < screenTop || this.y > screenBottom) {
      return; // Current area not visible, skip rendering
    }
    
    // Debug visualization of current area
    push();
    stroke(255, 0, 0, 100); // Red border with transparency
    strokeWeight(2);
    noFill();
    rect(this.x - offsetX, this.y - offsetY, this.width, this.height);
    
    // Draw force direction arrow
    let centerX = this.x + this.width / 2 - offsetX;
    let centerY = this.y + this.height / 2 - offsetY;
    let arrowLength = 30;
    let arrowEndX = centerX + this.forceDirection.x * arrowLength;
    let arrowEndY = centerY + this.forceDirection.y * arrowLength;
    
    stroke(255, 255, 0, 150); // Yellow arrow
    strokeWeight(3);
    line(centerX, centerY, arrowEndX, arrowEndY);
    
    // Arrow head
    push();
    translate(arrowEndX, arrowEndY);
    rotate(atan2(this.forceDirection.y, this.forceDirection.x));
    noStroke();
    fill(255, 255, 0, 150);
    triangle(0, 0, -8, -3, -8, 3);
    pop();
    
    pop();
  }
}
