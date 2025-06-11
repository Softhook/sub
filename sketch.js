
// Sound objects
let sonarOsc, sonarEnv;
let explosionNoise, explosionEnv, explosionBoomOsc, explosionBoomEnv; // Enemy Explosion
let bumpOsc, bumpEnv;
let torpedoNoise, torpedoEnv; // Changed from Osc to Noise for woosh
let lowAirOsc, lowAirEnv;
let gameOverImpactNoise, gameOverImpactEnv, gameOverGroanOsc, gameOverGroanEnv, gameOverFinalBoomNoise, gameOverFinalBoomEnv; // Sub Destruction

let audioInitialized = false;
let lastLowAirBeepTime = 0;
const LOW_AIR_BEEP_INTERVAL = 1000;

// Game Variables
let player;
let cave;
let enemies = [];
let projectiles = [];
let cameraOffsetX, cameraOffsetY;
const CELL_SIZE = 20;
const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 2000;
let gameState = 'start';
let currentLevel = 1;
const MAX_LEVELS = 3;

// --- Projectile Class ---
class Projectile {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle).mult(10);
    this.radius = 4; this.life = 100;
  }
  update(cave) {
    this.pos.add(this.vel); this.life--;
    if (cave.isWall(this.pos.x, this.pos.y, this.radius / 2)) this.life = 0;
  }
  render(offsetX, offsetY) {
    push(); fill(60, 100, 100, 200); noStroke();
    ellipse(this.pos.x - offsetX, this.pos.y - offsetY, this.radius * 2); pop();
  }
  isOffscreen() { return this.life <= 0; }
}

// --- Cave Class --- (No changes from previous complete version)
class Cave {
  constructor(worldWidth, worldHeight, cellSize) {
    this.worldWidth = worldWidth; this.worldHeight = worldHeight; this.cellSize = cellSize;
    this.gridWidth = Math.ceil(worldWidth / cellSize); this.gridHeight = Math.ceil(worldHeight / cellSize);
    this.grid = []; this.exitPathY = 0; this.exitPathRadius = 0;
    this.generateCave();
    this.exitX = worldWidth - cellSize * 10;
  }
  generateCave() {
    for (let i = 0; i < this.gridWidth; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridHeight; j++) this.grid[i][j] = false;
    }
    let pathY = this.gridHeight / 2; let currentPathRadius = 0;
    let pathMinRadius = 3.5; let pathMaxRadius = 7;
    noiseSeed(millis() + currentLevel * 1000);
    for (let i = 0; i < this.gridWidth; i++) {
      pathY += (noise(i * 0.03, 10 + currentLevel) - 0.5) * 2.5;
      pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1);
      currentPathRadius = map(noise(i * 0.05, 20 + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
      for (let j = 0; j < this.gridHeight; j++) {
        if (abs(j - pathY) > currentPathRadius) this.grid[i][j] = true;
      }
      if (i === this.gridWidth - 1) { this.exitPathY = pathY; this.exitPathRadius = currentPathRadius; }
    }
    for (let i = 1; i < this.gridWidth - 1; i++) {
      for (let j = 1; j < this.gridHeight - 1; j++) {
        if (!this.grid[i][j]) {
          if (noise(i * 0.1, j * 0.1, 30 + currentLevel) > 0.68 && dist(i, j, i, pathY) > currentPathRadius + 1.5) this.grid[i][j] = true;
        } else {
          if (noise(i * 0.08, j * 0.08, 40 + currentLevel) < 0.35) this.grid[i][j] = false;
        }
      }
    }
    for (let i = 0; i < this.gridWidth; i++) { this.grid[i][0] = true; this.grid[i][this.gridHeight - 1] = true; }
    for (let j = 0; j < this.gridHeight; j++) this.grid[0][j] = true;
    for (let j = 0; j < this.gridHeight; j++) {
      if (abs(j - this.exitPathY) > this.exitPathRadius) this.grid[this.gridWidth - 1][j] = true;
      else this.grid[this.gridWidth - 1][j] = false;
    }
  }
  isWall(worldX, worldY, objectRadius = 0) {
    if (worldX < 0 || worldX >= this.worldWidth || worldY < 0 || worldY >= this.worldHeight) return true;
    const checks = 8;
    for (let i = 0; i < checks; i++) {
      const angle = (TWO_PI / checks) * i;
      const checkX = worldX + cos(angle) * objectRadius; const checkY = worldY + sin(angle) * objectRadius;
      let gridX = floor(checkX / this.cellSize); let gridY = floor(checkY / this.cellSize);
      gridX = constrain(gridX, 0, this.gridWidth - 1); gridY = constrain(gridY, 0, this.gridHeight - 1);
      if (this.grid[gridX] && this.grid[gridX][gridY]) return true;
    }
    return false;
  }
}

// --- PlayerSub Class --- (Minor changes for sound triggers)
class PlayerSub {
  constructor(x, y, initialAir, airDepletionRatePerFrame) {
    this.pos = createVector(x, y); this.vel = createVector(0, 0); this.angle = 0;
    this.radius = 14; this.thrustPower = 0.08; this.turnSpeed = 0.04;
    this.damping = 0.985; this.maxSpeed = 2.5;
    this.sonarHits = []; this.sonarRange = 350; this.sonarPulses = 180;
    this.sonarCooldown = 90; this.lastSonarTime = -this.sonarCooldown;
    this.sonarDisplayTime = 120; this.health = 100;
    this.initialAirSupply = initialAir; this.airSupply = this.initialAirSupply;
    this.airDepletionRate = airDepletionRatePerFrame;
    this.shotCooldown = 30; this.lastShotTime = -this.shotCooldown;
  }
  fireSonar(cave, enemies) {
    this.lastSonarTime = frameCount; playSound('sonar');
    for (let i = 0; i < this.sonarPulses; i++) {
      let rayAngle = this.angle - PI + (TWO_PI / this.sonarPulses) * i;
      let hitDetectedOnRay = false;
      for (let dist = 0; dist < this.sonarRange; dist += 5) {
        if (hitDetectedOnRay) break;
        let checkX = this.pos.x + cos(rayAngle) * dist; let checkY = this.pos.y + sin(rayAngle) * dist;
        for (let enemy of enemies) {
          if (p5.Vector.dist(createVector(checkX, checkY), enemy.pos) < enemy.radius) {
            this.sonarHits.push({ x: checkX, y: checkY, type: 'enemy', receivedAt: frameCount, intensity: map(dist, 0, this.sonarRange, 1.3, 0.6) });
            hitDetectedOnRay = true; break;
          }
        }
        if (hitDetectedOnRay) break;
        if (cave.isWall(checkX, checkY)) {
          this.sonarHits.push({ x: checkX, y: checkY, type: 'wall', receivedAt: frameCount, intensity: map(dist, 0, this.sonarRange, 1, 0.3) });
          hitDetectedOnRay = true;
        }
      }
    }
    this.sonarHits = this.sonarHits.filter(hit => frameCount - hit.receivedAt < this.sonarDisplayTime * 2);
  }
  shoot() {
    if (frameCount - this.lastShotTime >= this.shotCooldown) {
      let pStartX = this.pos.x + cos(this.angle) * this.radius * 0.8;
      let pStartY = this.pos.y + sin(this.angle) * this.radius * 0.8;
      projectiles.push(new Projectile(pStartX, pStartY, this.angle));
      this.lastShotTime = frameCount; playSound('torpedo');
    }
  }
  update(cave, currentEnemies) {
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.vel.add(p5.Vector.fromAngle(this.angle).mult(this.thrustPower));
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.vel.add(p5.Vector.fromAngle(this.angle).mult(-this.thrustPower * 0.6));
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.angle -= this.turnSpeed;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.angle += this.turnSpeed;
    if (frameCount - this.lastSonarTime >= this.sonarCooldown) this.fireSonar(cave, currentEnemies);
    this.vel.limit(this.maxSpeed); let nextPos = p5.Vector.add(this.pos, this.vel);
    if (cave.isWall(nextPos.x, nextPos.y, this.radius * 0.7)) {
      this.pos.sub(this.vel.copy().mult(0.5)); this.vel.mult(-0.5);
      this.health -= 2; if (this.health < 0) this.health = 0; playSound('bump');
    } else this.pos.add(this.vel);
    this.vel.mult(this.damping); this.airSupply -= this.airDepletionRate;
    if (this.airSupply < 0) this.airSupply = 0;
    if (audioInitialized && this.airSupply > 0 && this.airSupply < this.initialAirSupply * 0.25) {
      if (millis() - lastLowAirBeepTime > LOW_AIR_BEEP_INTERVAL) { playSound('lowAir'); lastLowAirBeepTime = millis(); }
    } else if (audioInitialized && lowAirOsc && lowAirOsc.started && typeof lowAirOsc.stop === 'function') { lowAirEnv.triggerRelease(lowAirOsc); }
  }
  render(offsetX, offsetY) {
    push(); translate(width / 2, height / 2); rotate(this.angle);
    fill(80, 70, 90); noStroke(); ellipse(0, 0, this.radius * 2.2, this.radius * 1.2);
    fill(70, 65, 85); rectMode(CENTER); rect(this.radius * 0.1, 0, this.radius * 0.8, this.radius * 1.4, this.radius * 0.2);
    fill(75, 68, 88); beginShape();
    vertex(-this.radius * 0.9, -this.radius * 0.5); vertex(-this.radius * 0.9, this.radius * 0.5);
    vertex(-this.radius * 1.4, this.radius * 0.3); vertex(-this.radius * 1.4, -this.radius * 0.3);
    endShape(CLOSE); rectMode(CORNER); pop();
    for (let i = this.sonarHits.length - 1; i >= 0; i--) {
      let hit = this.sonarHits[i]; let age = frameCount - hit.receivedAt;
      if (age < this.sonarDisplayTime) {
        let alpha = map(age, 0, this.sonarDisplayTime, 200, 0);
        let hitSize = map(age, 0, this.sonarDisplayTime, 12, 3) * hit.intensity;
        let displayX = hit.x - offsetX; let displayY = hit.y - offsetY;
        if (displayX < -20 || displayX > width + 20 || displayY < -20 || displayY > height + 20) continue;
        if (hit.type === 'wall') fill(100, 50, 50, alpha * hit.intensity);
        else if (hit.type === 'enemy') { fill(0, 70, 70, alpha * hit.intensity); hitSize *= 1.3; }
        noStroke(); ellipse(displayX, displayY, hitSize, hitSize);
      } else this.sonarHits.splice(i, 1);
    }
    let sonarCycleProgress = (frameCount - this.lastSonarTime) / this.sonarCooldown;
    sonarCycleProgress = sonarCycleProgress - floor(sonarCycleProgress);
    noFill(); strokeWeight(3); stroke(120, 100, 100, 100);
    arc(width / 2, height / 2, this.radius * 3.5, this.radius * 3.5, -PI / 2, -PI / 2 + TWO_PI * sonarCycleProgress);
    let shotCooldownProgress = min(1, (frameCount - this.lastShotTime) / this.shotCooldown);
    if (shotCooldownProgress < 1) {
      strokeWeight(2); stroke(0, 100, 100, 80);
      arc(width / 2, height / 2, this.radius * 2.5, this.radius * 2.5, -PI / 2, -PI / 2 + TWO_PI * shotCooldownProgress);
    } strokeWeight(1);
  }
  handleEnemyCollisions(enemies) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      let d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
      if (d < this.radius * 0.7 + enemy.radius) {
        this.health -= 15; if (this.health < 0) this.health = 0;
        let knockbackPlayer = p5.Vector.sub(this.pos, enemy.pos).normalize().mult(1.5);
        this.vel.add(knockbackPlayer); enemies.splice(i, 1); playSound('explosion');
      }
    }
  }
}

// --- Enemy Class --- (No changes)
class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y); this.radius = 14;
    this.vel = p5.Vector.random2D().mult(random(0.4, 0.8 + currentLevel * 0.1));
    this.type = 'enemy'; this.nextDecisionTime = 0;
  }
  update(cave) {
    if (frameCount > this.nextDecisionTime) {
      this.vel = p5.Vector.random2D().mult(random(0.3, 0.7 + currentLevel * 0.1));
      this.nextDecisionTime = frameCount + random(60, 180 - currentLevel * 10);
    }
    let nextPos = p5.Vector.add(this.pos, this.vel);
    if (cave.isWall(nextPos.x, nextPos.y, this.radius)) {
      this.vel.mult(-1); this.nextDecisionTime = frameCount + random(20, 60);
    } else this.pos.add(this.vel);
    this.pos.x = constrain(this.pos.x, this.radius, cave.worldWidth - this.radius);
    this.pos.y = constrain(this.pos.y, this.radius, cave.worldHeight - this.radius);
  }
}

// --- Sound Setup and Functions ---
function initializeSounds() {
  sonarOsc = new p5.Oscillator('sine'); sonarEnv = new p5.Envelope();
  sonarEnv.setADSR(0.01, 0.1, 0, 0.1); sonarEnv.setRange(0.3, 0);
  sonarOsc.amp(sonarEnv);

  explosionNoise = new p5.Noise('white'); explosionEnv = new p5.Envelope();
  explosionEnv.setADSR(0.01, 0.25, 0, 0.15); explosionEnv.setRange(0.4, 0);
  explosionNoise.amp(explosionEnv);
  explosionBoomOsc = new p5.Oscillator('triangle'); explosionBoomEnv = new p5.Envelope();
  explosionBoomEnv.setADSR(0.01, 0.3, 0, 0.2); explosionBoomEnv.setRange(0.5, 0);
  explosionBoomOsc.amp(explosionBoomEnv);

  bumpOsc = new p5.Oscillator('triangle'); bumpEnv = new p5.Envelope();
  bumpEnv.setADSR(0.005, 0.15, 0, 0.1); bumpEnv.setRange(0.4, 0);
  bumpOsc.amp(bumpEnv);

  torpedoNoise = new p5.Noise('pink'); torpedoEnv = new p5.Envelope(); // Pink for lower woosh
  torpedoEnv.setADSR(0.02, 0.3, 0, 0.2); torpedoEnv.setRange(0.3, 0); // Quick attack, longer release
  torpedoNoise.amp(torpedoEnv);

  lowAirOsc = new p5.Oscillator('square'); lowAirEnv = new p5.Envelope();
  lowAirEnv.setADSR(0.05, 0.1, 0.6, 0.2); lowAirEnv.setRange(0.2, 0);
  lowAirOsc.amp(lowAirEnv);

  // Game Over Sounds
  gameOverImpactNoise = new p5.Noise('white'); gameOverImpactEnv = new p5.Envelope();
  gameOverImpactEnv.setADSR(0.005, 0.1, 0, 0.05); gameOverImpactEnv.setRange(0.6, 0);
  gameOverImpactNoise.amp(gameOverImpactEnv);

  gameOverGroanOsc = new p5.Oscillator('sawtooth'); gameOverGroanEnv = new p5.Envelope();
  gameOverGroanEnv.setADSR(0.2, 1.5, 0, 0.5); gameOverGroanEnv.setRange(0.4, 0); // Slow attack, long
  gameOverGroanOsc.amp(gameOverGroanEnv);

  gameOverFinalBoomNoise = new p5.Noise('brown'); gameOverFinalBoomEnv = new p5.Envelope();
  gameOverFinalBoomEnv.setADSR(0.05, 0.8, 0, 0.5); gameOverFinalBoomEnv.setRange(0.7, 0);
  gameOverFinalBoomNoise.amp(gameOverFinalBoomEnv);
}

function playSound(soundName) {
  if (!audioInitialized || (getAudioContext() && getAudioContext().state !== 'running')) return;
  try {
    if (soundName === 'sonar') {
      if (!sonarOsc.started) sonarOsc.start(); sonarOsc.freq(800); sonarEnv.play(sonarOsc);
    } else if (soundName === 'explosion') {
      if (!explosionNoise.started) explosionNoise.start(); explosionEnv.play(explosionNoise);
      if (!explosionBoomOsc.started) explosionBoomOsc.start(); explosionBoomOsc.freq(random(60, 90)); explosionBoomEnv.play(explosionBoomOsc);
    } else if (soundName === 'bump') {
      if (!bumpOsc.started) bumpOsc.start(); bumpOsc.freq(100); bumpEnv.play(bumpOsc);
    } else if (soundName === 'torpedo') {
      if (!torpedoNoise.started) torpedoNoise.start(); torpedoEnv.play(torpedoNoise);
    } else if (soundName === 'lowAir') {
      if (!lowAirOsc.started) lowAirOsc.start(); lowAirOsc.freq(1200); lowAirEnv.play(lowAirOsc);
    } else if (soundName === 'gameOver') {
      // Sequence the game over sounds
      if (!gameOverImpactNoise.started) gameOverImpactNoise.start();
      gameOverImpactEnv.play(gameOverImpactNoise);

      setTimeout(() => {
        if (!gameOverGroanOsc.started) gameOverGroanOsc.start();
        gameOverGroanOsc.freq(random(40,70)); // Low groan
        gameOverGroanEnv.play(gameOverGroanOsc);
        gameOverGroanOsc.freq(30, 1.5, 0.1); // Pitch down slowly
      }, 50); // Slight delay for impact

      setTimeout(() => {
        if (!gameOverFinalBoomNoise.started) gameOverFinalBoomNoise.start();
        gameOverFinalBoomEnv.play(gameOverFinalBoomNoise);
      }, 800); // After groan
    }
  } catch (e) { /* console.error("Sound error:", soundName, e); */ }
}

// --- Main Game Functions ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255);
  textAlign(CENTER, CENTER); textFont('monospace');
  initializeSounds(); resetGame();
}

function initGameObjects() {
  let baseAir = 4500; let airForLevel = baseAir - (currentLevel - 1) * 600;
  airForLevel = max(airForLevel, 1800);
  let airDepletion = 1 + (currentLevel - 1) * 0.1;
  
  // Find safe player start position
  let playerStartX, playerStartY;
  let attempts = 0; const MAX_PLAYER_SPAWN_ATTEMPTS = 50;
  let playerSpawnRadiusBuffer = CELL_SIZE * 1.5; // Approximate player size for collision check

  // Generate cave first
  cave = new Cave(WORLD_WIDTH, WORLD_HEIGHT, CELL_SIZE);

  do {
    playerStartX = CELL_SIZE * (5 + attempts * 0.2); 
    playerStartY = WORLD_HEIGHT / 2 + random(-CELL_SIZE * 4, CELL_SIZE * 4);
    attempts++;
    if (playerStartX > WORLD_WIDTH / 5) { // Don't search too far
        playerStartX = CELL_SIZE * 5; playerStartY = WORLD_HEIGHT / 2; break; 
    }
  } while (cave.isWall(playerStartX, playerStartY, playerSpawnRadiusBuffer) && attempts < MAX_PLAYER_SPAWN_ATTEMPTS);
  
  if (attempts >= MAX_PLAYER_SPAWN_ATTEMPTS) { // Fallback
      playerStartX = CELL_SIZE * 5; playerStartY = WORLD_HEIGHT / 2;
  }

  player = new PlayerSub(playerStartX, playerStartY, airForLevel, airDepletion);
  
  enemies = []; projectiles = [];
  let enemyCount = 10 + (currentLevel - 1) * 4; enemyCount = min(enemyCount, 30);
  for (let i = 0; i < enemyCount; i++) {
    let enemyX, enemyY, eAttempts = 0;
    do {
      enemyX = random(WORLD_WIDTH * 0.15, WORLD_WIDTH * 0.9);
      enemyY = random(WORLD_HEIGHT * 0.1, WORLD_HEIGHT * 0.9); eAttempts++;
    } while (cave.isWall(enemyX, enemyY, 25) && eAttempts < 50);
    if (eAttempts < 50) enemies.push(new Enemy(enemyX, enemyY));
  }
}

function resetGame() {
  currentLevel = 1; initGameObjects();
  player.health = 100; player.airSupply = player.initialAirSupply;
  player.lastSonarTime = frameCount - player.sonarCooldown;
  player.lastShotTime = frameCount - player.shotCooldown;
  gameState = 'start';
  if (audioInitialized && lowAirOsc && lowAirOsc.started) lowAirEnv.triggerRelease(lowAirOsc);
  lastLowAirBeepTime = 0;
}

function prepareNextLevel() {
  currentLevel++; initGameObjects();
  player.pos = createVector(player.pos.x, player.pos.y); // Use the already calculated safe start
  player.vel = createVector(0,0); player.angle = 0;
  player.health = 100;
  player.lastSonarTime = frameCount - player.sonarCooldown; player.lastShotTime = frameCount - player.shotCooldown;
  gameState = 'playing';
  if (audioInitialized && lowAirOsc && lowAirOsc.started) lowAirEnv.triggerRelease(lowAirOsc);
  lastLowAirBeepTime = 0;
}

function startAudioRoutine() {
    function startOscillators() {
        if (sonarOsc && !sonarOsc.started) sonarOsc.start();
        if (explosionNoise && !explosionNoise.started) explosionNoise.start();
        if (explosionBoomOsc && !explosionBoomOsc.started) explosionBoomOsc.start();
        if (bumpOsc && !bumpOsc.started) bumpOsc.start();
        if (torpedoNoise && !torpedoNoise.started) torpedoNoise.start();
        if (lowAirOsc && !lowAirOsc.started) lowAirOsc.start();
        if (gameOverImpactNoise && !gameOverImpactNoise.started) gameOverImpactNoise.start();
        if (gameOverGroanOsc && !gameOverGroanOsc.started) gameOverGroanOsc.start();
        if (gameOverFinalBoomNoise && !gameOverFinalBoomNoise.started) gameOverFinalBoomNoise.start();
    }
    if (typeof userStartAudio === 'function') {
        userStartAudio().then(() => { audioInitialized = true; startOscillators(); })
                        .catch(e => { /* console.error("userStartAudio error", e); */ });
    } else {
        let ctx = getAudioContext();
        if (ctx && ctx.state !== 'running') {
            ctx.resume().then(() => { audioInitialized = true; startOscillators(); })
                        .catch(e => { /* console.error("AudioContext.resume error", e); */ });
        } else if (ctx && ctx.state === 'running') { audioInitialized = true; startOscillators(); }
    }
}

function mousePressed() {
    if (!audioInitialized) { // If audio not started, mouse click can also start it
        startAudioRoutine();
    }
    let fs = fullscreen();
    fullscreen(!fs);
}

function keyPressed() {
  if (!audioInitialized && (keyCode === ENTER && (gameState === 'start' || gameState === 'levelComplete' || gameState === 'gameOver' || gameState === 'gameComplete'))) {
    startAudioRoutine();
  }
  if (gameState === 'playing') {
    if (keyCode === 32) player.shoot();
  } else if (gameState === 'start' && keyCode === ENTER) {
    gameState = 'playing'; player.lastSonarTime = frameCount - player.sonarCooldown;
  } else if ((gameState === 'gameOver' || gameState === 'gameComplete') && keyCode === ENTER) {
    resetGame();
  } else if (gameState === 'levelComplete' && keyCode === ENTER) {
    prepareNextLevel();
  }
}

function draw() {
  background(220, 70, 15);
  if (gameState === 'start') {
    fill(50, 100, 100); textSize(48);
    text(`DEEP SEA SONAR ${currentLevel > 1 ? `(Restart)`: ''}`, width / 2, height / 2 - 140);
    textSize(20);
    text("WASD/Arrows: Move. SPACE: Shoot.", width / 2, height / 2 - 80);
    text("Sonar pings automatically. Watch your Air Supply!", width / 2, height / 2 - 50);
    text(`Goal: Reach X > ${cave.exitX} with < 5 enemies.`, width / 2, height / 2 - 20);
    text(`Complete ${MAX_LEVELS} levels to win.`, width / 2, height / 2 + 10);
    text("MOUSE CLICK for Fullscreen.", width/2, height/2 + 40);
    textSize(28); fill(120, 100, 100);
    text("Press ENTER to Dive", width / 2, height / 2 + 80);
    if (!audioInitialized) {
        textSize(16); fill(200,80,80);
        text("(Sound will enable after you press Enter or Click)", width/2, height/2 + 110);
    }
    return;
  }
  if (gameState === 'levelComplete') {
    fill(100, 100, 100); textSize(48);
    text(`LEVEL ${currentLevel -1} CLEARED!`, width / 2, height / 2 - 40);
    textSize(24);
    text(`Air Supply Replenished. Prepare for Level ${currentLevel}.`, width/2, height/2 + 10);
    text("Press ENTER to Continue", width / 2, height / 2 + 50);
    return;
  }
  if (gameState === 'gameComplete') {
    fill(120, 100, 100); textSize(60);
    text("MISSION ACCOMPLISHED!", width / 2, height / 2 - 40);
    textSize(24);
    text(`You cleared all ${MAX_LEVELS} levels!`, width/2, height/2 + 20);
    text("Press ENTER to Play Again", width / 2, height / 2 + 60);
    return;
  }
  if (gameState === 'gameOver') {
    // Game over sound is triggered once when state changes to 'gameOver'
    fill(0, 80, 70); textSize(60);
    text("GAME OVER", width / 2, height / 2 - 40);
    textSize(24);
    text(player.health <= 0 ? "Submarine Destroyed!" : "Air Supply Depleted!", width/2, height/2 + 10);
    text("Press ENTER to Restart", width / 2, height / 2 + 50);
    return;
  }

  cameraOffsetX = player.pos.x - width / 2; cameraOffsetY = player.pos.y - height / 2;
  player.update(cave, enemies);
  for (let enemy of enemies) enemy.update(cave);
  player.handleEnemyCollisions(enemies);

  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update(cave); projectiles[i].render(cameraOffsetX, cameraOffsetY);
    if (projectiles[i].isOffscreen()) projectiles.splice(i, 1);
  }
  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (projectiles[i] && enemies[j]) {
        let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, enemies[j].pos.x, enemies[j].pos.y);
        if (d < projectiles[i].radius + enemies[j].radius) {
          enemies.splice(j, 1); projectiles.splice(i, 1); playSound('explosion'); break;
        }
      }
    }
  }
  player.render(cameraOffsetX, cameraOffsetY);
  fill(50, 80, 100); textSize(18); textAlign(LEFT, TOP);
  text(`Level: ${currentLevel}/${MAX_LEVELS}`, 10, 10);
  text(`Health: ${player.health}`, 10, 35);
  text(`Air: ${floor(player.airSupply / 60)}s (${floor(player.airSupply)})`, 10, 60);
  text(`Enemies: ${enemies.length}`, 10, 85);
  text(`Position: ${floor(player.pos.x)}, ${floor(player.pos.y)}`, 10, 110);
  text(`Target: X > ${cave.exitX}`, 10, 135);

  if (player.health <= 0 || player.airSupply <= 0) {
      if(gameState === 'playing') { // Trigger game over sound only once
          playSound('gameOver');
      }
      gameState = 'gameOver';
  } else if (player.pos.x > cave.exitX && enemies.length < 5) {
    if (currentLevel >= MAX_LEVELS) gameState = 'gameComplete';
    else gameState = 'levelComplete';
  }
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

