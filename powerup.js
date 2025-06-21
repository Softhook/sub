// --- Powerup System ---

// --- Powerup System Constants ---
const PWR_RADIUS = 15;
const PWR_LIFETIME_FRAMES = 60 * 60; // 15 seconds at 60 FPS
const PWR_SPAWN_COOLDOWN_FRAMES = 60 * 8; // Check every 8 seconds
const PWR_SPAWN_CHANCE_PER_CHECK = 1; // 30% chance when cooldown is up
const MAX_PWR_ON_SCREEN = 3;
const PWR_MIN_DISTANCE_FROM_PLAYER = 400;
const PWR_AIR_RESTORE_AMOUNT = 300; // frames worth of air

// Powerup configurations
const PWR_CONFIGS = {
  air: {
    color: {h: 200, s: 80, b: 90}, // Light blue
    airAmount: PWR_AIR_RESTORE_AMOUNT
  },
  weapon: {
    color: {h: 15, s: 90, b: 85}, // Orange/red
    duration: 60 * 20, // 20 seconds
    maxLevel: 3,
    weaponType: 'damage'
  },
  speed: {
    color: {h: 60, s: 100, b: 95}, // Bright yellow
    duration: 60 * 30, // 30 seconds
    speedMultiplier: 2
  },
  shield: {
    color: {h: 280, s: 70, b: 80}, // Purple
    duration: 60 * 30, // 30 seconds
    shieldHits: 3
  },
  sonar: {
    color: {h: 120, s: 80, b: 85}, // Green
    duration: 60 * 30, // 30 seconds
    sonarRangeMultiplier: 1.5,
    sonarCooldownReduction: 0.5
  }
};

// Spawn weight probabilities (higher = more likely)
const PWR_SPAWN_WEIGHTS = {
  air: 4,      // Most common - essential for survival
  weapon: 2,   // Moderate - combat enhancement
  speed: 2,    // Moderate - mobility
  shield: 1.5, // Less common - powerful protection
  sonar: 1     // Least common - exploration aid
};

// Powerup notification system
let powerupNotifications = [];

function showPowerupNotification(message, color) {
  powerupNotifications.push({
    message: message,
    color: color,
    startTime: frameCount,
    duration: 120, // 2 seconds at 60 FPS
    y: height * 0.3, // Position on screen
    alpha: 1
  });
}

function updatePowerupNotifications() {
  for (let i = powerupNotifications.length - 1; i >= 0; i--) {
    let notification = powerupNotifications[i];
    let age = frameCount - notification.startTime;
    
    // Fade out over time
    notification.alpha = 1 - (age / notification.duration);
    
    // Remove expired notifications
    if (age >= notification.duration) {
      powerupNotifications.splice(i, 1);
    }
  }
}

function renderPowerupNotifications() {
  textAlign(CENTER);
  textSize(24);
  
  for (let i = 0; i < powerupNotifications.length; i++) {
    let notification = powerupNotifications[i];
    let yOffset = i * 35; // Stack notifications vertically
    
    // Set color with alpha
    fill(notification.color.h, notification.color.s, notification.color.b, notification.alpha * 255);
    
    // Draw notification text
    text(notification.message, width / 2, notification.y + yOffset);
  }
}

class Powerup {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.type = type;
    this.radius = PWR_RADIUS;
    this.collected = false;
    this.spawnTime = frameCount;
    this.pulsePhase = random(TWO_PI);
    
    // Type-specific properties
    this.config = PWR_CONFIGS[type];
    if (!this.config) {
      console.warn(`Unknown powerup type: ${type}`);
      this.config = PWR_CONFIGS.air; // fallback
    }
  }
  
  update() {
    if (this.collected) return;
    
    // Gentle floating animation
    this.pos.y += sin(frameCount * 0.02 + this.pulsePhase) * 0.3;
    
    // Check for collection by player
    if (this.checkPlayerCollection()) {
      this.collect();
    }
    
    // Auto-expire after time limit
    if (frameCount - this.spawnTime > PWR_LIFETIME_FRAMES) {
      this.collected = true;
    }
  }
  
  checkPlayerCollection() {
    if (!player) return false;
    let distance = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
    return distance < this.radius + player.radius;
  }
  
  collect() {
    if (this.collected) return;
    
    this.collected = true;
    
    // Debug logging before applying effect
    console.log(`Collecting ${this.type} powerup. Player air before: ${player?.airSupply}/${player?.maxAirSupply}`);
    
    this.applyEffect();
    
    // Visual and audio feedback
    this.createCollectionEffect();
    playSound('powerupCollect');
    
    console.log(`Collected powerup: ${this.type}`);
  }
  
  applyEffect() {
    switch(this.type) {
      case 'air':
        this.applyAirBoost();
        break;
      case 'weapon':
        this.applyWeaponUpgrade();
        break;
      case 'speed':
        this.applySpeedBoost();
        break;
      case 'shield':
        this.applyShield();
        break;
      case 'sonar':
        this.applySonarBoost();
        break;
    }
  }
  
  applyAirBoost() {
    let airToAdd = this.config.airAmount || PWR_AIR_RESTORE_AMOUNT;
    
    // Safety checks to prevent NaN
    if (!player || typeof player.airSupply !== 'number' || typeof player.maxAirSupply !== 'number') {
      console.warn("Player air values are invalid:", player?.airSupply, player?.maxAirSupply);
      return;
    }
    
    // Use Math.min instead of p5.js min() and ensure we don't exceed max
    let newAirSupply = player.airSupply + airToAdd;
    player.airSupply = Math.min(player.maxAirSupply, newAirSupply);
    
    console.log(`Air restored: +${airToAdd}, new air: ${player.airSupply}/${player.maxAirSupply}`);
    
    // Show HUD notification
    showPowerupNotification("Air Restored!", this.config.color);
  }
  
  applyWeaponUpgrade() {
    if (!player.weaponUpgrade || player.weaponUpgrade.level < this.config.maxLevel) {
      player.weaponUpgrade = {
        level: (player.weaponUpgrade?.level || 0) + 1,
        expiresAt: frameCount + this.config.duration,
        type: this.config.weaponType || 'damage'
      };
      
      showPowerupNotification(`Weapon Upgrade Lv.${player.weaponUpgrade.level}!`, this.config.color);
    }
  }
  
  applySpeedBoost() {
    player.speedBoost = {
      multiplier: this.config.speedMultiplier || 1.5,
      expiresAt: frameCount + this.config.duration
    };
    
    showPowerupNotification("Speed Boost!", this.config.color);
  }
  
  applyShield() {
    player.shield = {
      active: true,
      expiresAt: frameCount + this.config.duration,
      hits: this.config.shieldHits || 3
    };
    
    showPowerupNotification("Shield Active!", this.config.color);
  }
  
  applySonarBoost() {
    player.sonarBoost = {
      rangeMultiplier: this.config.sonarRangeMultiplier || 1.5,
      cooldownReduction: this.config.sonarCooldownReduction || 0.5,
      expiresAt: frameCount + this.config.duration
    };
    
    showPowerupNotification("Sonar Enhanced!", this.config.color);
  }
  
  createCollectionEffect() {
    // Create sparkle particles
    for (let i = 0; i < 8; i++) {
      let angle = (TWO_PI / 8) * i;
      let speed = random(2, 5);
      particles.push(new Particle(
        this.pos.x + cos(angle) * this.radius,
        this.pos.y + sin(angle) * this.radius,
        cos(angle) * speed,
        sin(angle) * speed,
        30, // lifetime
        2,  // minSize
        4,  // maxSize
        this.config.color.h,
        this.config.color.s,
        this.config.color.b,
        200 // alphaMax
      ));
    }
  }
  
  render(offsetX, offsetY) {
    if (this.collected) return;
    
    let screenX = this.pos.x - offsetX;
    let screenY = this.pos.y - offsetY;
    
    // Pulsing glow effect
    let pulseSize = 1 + sin(frameCount * 0.1 + this.pulsePhase) * 0.2;
    
    push();
    translate(screenX, screenY);
    
    // Outer glow
    fill(this.config.color.h, this.config.color.s, this.config.color.b, 0.3);
    noStroke();
    ellipse(0, 0, this.radius * 3 * pulseSize);
    
    // Main powerup body
    fill(this.config.color.h, this.config.color.s, this.config.color.b, 0.9);
    stroke(this.config.color.h, this.config.color.s, 100);
    strokeWeight(2);
    ellipse(0, 0, this.radius * 2);
    
    // Type-specific icon
    this.renderIcon();
    
    pop();
  }
  
  renderIcon() {
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.radius);
    
    switch(this.type) {
      case 'air':
        // Simple bubble
        fill(255, 255, 255, 150);
        ellipse(0, 0, this.radius * 0.8);
        break;
      case 'weapon':
        // Triangle for torpedo
        triangle(-this.radius*0.4, this.radius*0.3, 
                 this.radius*0.4, 0, 
                 -this.radius*0.4, -this.radius*0.3);
        break;
      case 'speed':
        // Lightning bolt
        text("⚡", 0, 0);
        break;
      case 'shield':
        // Shield symbol
        text("🛡", 0, 0);
        break;
      case 'sonar':
        // Radar waves
        noFill();
        stroke(0);
        strokeWeight(2);
        for (let i = 1; i <= 3; i++) {
          ellipse(0, 0, this.radius * 0.3 * i);
        }
        break;
    }
  }
}

// Powerup spawning and management
class PowerupManager {
  constructor() {
    this.powerups = [];
    this.lastSpawnTime = 0;
    this.spawnCooldown = PWR_SPAWN_COOLDOWN_FRAMES;
    console.log("PowerupManager initialized successfully!");
  }
  
  update(cave) {
    // Update existing powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      this.powerups[i].update();
      
      // Remove collected or expired powerups
      if (this.powerups[i].collected) {
        this.powerups.splice(i, 1);
      }
    }
    
    // Spawn new powerups occasionally
    if (frameCount - this.lastSpawnTime > this.spawnCooldown) {
      this.trySpawnPowerup(cave);
    }
  }
  
  trySpawnPowerup(cave) {
    // Don't spawn too many powerups
    if (this.powerups.length >= MAX_PWR_ON_SCREEN) return;
    
    // Random chance to spawn
    if (random() < PWR_SPAWN_CHANCE_PER_CHECK) {
      this.spawnRandomPowerup(cave);
    }
    
    this.lastSpawnTime = frameCount;
  }
  
  spawnRandomPowerup(cave) {
    // Choose powerup type based on weighted probabilities
    let type = this.chooseWeightedPowerupType();
    
    // Find a safe spawn location
    let spawnPos = this.findSafeSpawnLocation(cave);
    if (spawnPos) {
      this.powerups.push(new Powerup(spawnPos.x, spawnPos.y, type));
      console.log(`Spawned ${type} powerup at (${spawnPos.x}, ${spawnPos.y})`);
    }
  }
  
  chooseWeightedPowerupType() {
    // Adjust probabilities based on player needs
    let weights = {...PWR_SPAWN_WEIGHTS};
    
    // Increase air spawn chance if player is low on air
    if (player && player.airSupply < player.maxAirSupply * 0.3) {
      weights.air *= 3;
    }
    
    // Decrease weapon spawn chance if already upgraded
    if (player && player.weaponUpgrade && player.weaponUpgrade.level >= 2) {
      weights.weapon *= 0.3;
    }
    
    return this.weightedRandom(weights);
  }
  
  weightedRandom(weights) {
    let totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let [type, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) return type;
    }
    
    return 'air'; // fallback
  }
  
  findSafeSpawnLocation(cave, attempts = 20) {
    for (let i = 0; i < attempts; i++) {
      let x = random(cave.worldWidth * 0.1, cave.worldWidth * 0.9);
      let y = random(cave.worldHeight * 0.1, cave.worldHeight * 0.9);
      
      // Check if location is not in a wall
      if (!cave.isWall(x, y, PWR_RADIUS)) {
        // Check if not too close to player
        if (!player || dist(x, y, player.pos.x, player.pos.y) > PWR_MIN_DISTANCE_FROM_PLAYER) {
          return {x, y};
        }
      }
    }
    
    return null; // No safe location found
  }
  
  render(offsetX, offsetY) {
    for (let powerup of this.powerups) {
      powerup.render(offsetX, offsetY);
    }
  }
  
  reset() {
    this.powerups = [];
    this.lastSpawnTime = 0;
  }
}

// Debug: Verify PowerupManager is defined
console.log("PowerupManager class loaded:", typeof PowerupManager);
