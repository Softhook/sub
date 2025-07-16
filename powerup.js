// --- Powerup Class ---
class Powerup {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.type = type; // e.g. 'health', 'air', 'shield'
    this.radius = 15;
    this.age = 0;
    this.pulseRate = 0.05;
    this.collected = false;
    console.log(`Created new ${type} powerup at (${x}, ${y}) with radius ${this.radius}`);
  }
  
  update() {
    this.age++;
  }
  
  render(offsetX, offsetY) {
    push();
    // Pulse effect
    let pulseSize = this.radius * (1 + 0.2 * sin(this.age * this.pulseRate));
    
    // Draw based on type
    switch(this.type) {
      case 'health':
        fill(0, 100, 80); // Green
        noStroke();
        ellipse(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize * 2, pulseSize * 2);
        fill(0, 0, 100); // White
        rectMode(CENTER);
        rect(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize, pulseSize * 0.5); // Horizontal
        rect(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize * 0.5, pulseSize); // Vertical
        break;
        
      case 'air':
        fill(210, 100, 80); // Blue
        noStroke();
        ellipse(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize * 2, pulseSize * 2);
        fill(0, 0, 100); // White
        ellipse(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize, pulseSize);
        break;
        
      case 'shield':
        // Light blue-white color to match the shield effect
        fill(190, 30, 100); // Light blue-white
        noStroke();
        ellipse(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize * 2, pulseSize * 2);
        
        // Add glow effect
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = 'rgba(255, 255, 255, 0.6)';
        
        noFill();
        stroke(0, 0, 100, 200); // White
        strokeWeight(1.5);
        arc(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize * 1.5, pulseSize * 1.5, 0, PI);
        arc(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize * 1.5, pulseSize * 1.5, PI, TWO_PI);
        
        // Reset shadow
        drawingContext.shadowBlur = 0;
        break;
        
      default:
        // Generic powerup
        fill(300, 100, 80); // Purple
        noStroke();
        ellipse(this.pos.x - offsetX, this.pos.y - offsetY, pulseSize * 2, pulseSize * 2);
    }
    pop();
  }
  
  applyEffect(player) {
    switch(this.type) {
      case 'health':
        player.health = min(player.health + 25, PLAYER_INITIAL_HEALTH);
        break;
        
      case 'air':
        player.airSupply = min(player.airSupply + 1200, player.initialAirSupply);
        break;
        
      case 'shield':
        player.shield = true;
        player.shieldDuration = 600; // 10 seconds at 60fps
        break;
    }
    this.collected = true;
  }
}
