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
  spawnBubbles() {
    // Density determines how many bubbles to try to spawn per frame
    let bubblesToSpawn = floor(this.width * this.height * CURRENT_BUBBLE_SPAWN_DENSITY);
    if (random() < (this.width * this.height * CURRENT_BUBBLE_SPAWN_DENSITY) % 1) {
        bubblesToSpawn++; // Probabilistically add one more bubble for fractional parts
    }

    for (let i = 0; i < bubblesToSpawn; i++) {
      let bubbleX = random(this.x, this.x + this.width);
      let bubbleY = random(this.y, this.y + this.height);
      
      // Bubbles should generally move with the current, but with some randomness
      let bubbleVel = p5.Vector.add(this.force, p5.Vector.random2D().mult(0.1)); // Slight random drift
      bubbleVel.mult(CURRENT_BUBBLE_SPEED_MULTIPLIER);

      let bubbleSize = random(CURRENT_BUBBLE_SIZE_MIN, CURRENT_BUBBLE_SIZE_MAX);
      let bubbleColor = color(PLAYER_BUBBLE_COLOR_H, PLAYER_BUBBLE_COLOR_S, PLAYER_BUBBLE_COLOR_B, PLAYER_BUBBLE_ALPHA * 0.7); // Slightly dimmer/different alpha
      let bubbleLifespan = BUBBLE_LIFESPAN_FRAMES * CURRENT_BUBBLE_LIFESPAN_FACTOR;

      // Add to global bubbles array. We might need a new bubble type or flag if they behave very differently.
      // For now, they'll use the existing Bubble class.
      let newBubble = new Bubble(bubbleX, bubbleY, bubbleSize, bubbleColor);
      newBubble.vel = bubbleVel; // Override default bubble velocity
      newBubble.lifespan = bubbleLifespan; // Override default lifespan
      bubbles.push(newBubble);
    }
  }

  // Render the current area (with debug visuals if enabled)
  render(offsetX, offsetY) {
    if (DEBUG_MODE) {
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
}
