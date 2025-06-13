// Main game variables
let gameState = 'start'; // 'start', 'playing', 'levelComplete', 'gameComplete', 'gameOver'
let currentLevel = 1;
let currentCellSize = BASE_CELL_SIZE;
let enemiesKilledThisLevel = 0;

// Game objects
let cave;
let player;
let enemies = [];
let projectiles = [];
let sonarBubbles = [];
let particles = [];
let jellyfish = [];
let currentAreas = [];

// Audio variables
let audioInitialized = false;
let lastLowAirBeepTime = 0;
let reactorHumAmplitude = 0;

// Audio objects - will be initialized in initializeSounds()
let sonarOsc, sonarEnv;
let explosionNoise, explosionEnv;
let explosionBoomOsc, explosionBoomEnv;
let bumpOsc, bumpEnv;
let torpedoNoise, torpedoEnv;
let lowAirOsc, lowAirEnv;
let reactorHumOsc, reactorHumEnv;
let creatureGrowlOsc, creatureGrowlEnv;
let gameOverImpactNoise, gameOverImpactEnv;
let gameOverGroanOsc, gameOverGroanEnv;
let gameOverFinalBoomNoise, gameOverFinalBoomEnv;

// Font
let customFont;

// Start screen submarine animation
let startScreenPropellerAngle = 0;

function preload() {
  customFont = loadFont('Berpatroli.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255); // Max values for HSB and Alpha
  textAlign(CENTER, CENTER); 
  textFont('monospace');
  
  if (customFont) {
    textFont(customFont);
  }
  
  initializeSounds(); 
  resetGame();
}

function draw() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);

  if (gameState === 'start') {
    drawStartScreen();
    return;
  }
  if (gameState === 'levelComplete') {
    drawLevelCompleteScreen();
    return;
  }
  if (gameState === 'gameComplete') {
    drawGameCompleteScreen();
    return;
  }
  if (gameState === 'gameOver') {
    drawGameOverScreen();
    return;
  }
  // gameState === 'playing'
  drawPlayingState();
}

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  
  // Animate submarine
  let subX = width / 2;
  let subY = height / 2 + START_SCREEN_TITLE_Y_OFFSET - 100;
  
  push();
  translate(subX, subY);
  
  // Use the same rendering as the gameplay submarine
  let subRadius = PLAYER_RADIUS; // Use actual player radius
  
  // Submarine body (same as _renderBody)
  fill(PLAYER_COLOR_BODY_H, PLAYER_COLOR_BODY_S, PLAYER_COLOR_BODY_B);
  noStroke();
  ellipse(0, 0, subRadius * PLAYER_BODY_WIDTH_FACTOR, subRadius * PLAYER_BODY_HEIGHT_FACTOR);
  
  // Sail (same as _renderSail)
  fill(PLAYER_COLOR_SAIL_H, PLAYER_COLOR_SAIL_S, PLAYER_COLOR_SAIL_B);
  rectMode(CENTER);
  rect(subRadius * PLAYER_SAIL_OFFSET_X_FACTOR, 0, subRadius * PLAYER_SAIL_WIDTH_FACTOR, subRadius * PLAYER_SAIL_HEIGHT_FACTOR, subRadius * PLAYER_SAIL_CORNER_RADIUS_FACTOR);
  rectMode(CORNER); // Reset rectMode
  
  // Fin (same as _renderFin)
  fill(PLAYER_COLOR_FIN_H, PLAYER_COLOR_FIN_S, PLAYER_COLOR_FIN_B);
  beginShape();
  vertex(-subRadius * PLAYER_FIN_X1_FACTOR, -subRadius * PLAYER_FIN_Y1_FACTOR);
  vertex(-subRadius * PLAYER_FIN_X2_FACTOR, subRadius * PLAYER_FIN_Y2_FACTOR);
  vertex(-subRadius * PLAYER_FIN_X3_FACTOR, subRadius * PLAYER_FIN_Y3_FACTOR);
  vertex(-subRadius * PLAYER_FIN_X4_FACTOR, -subRadius * PLAYER_FIN_Y4_FACTOR);
  endShape(CLOSE);
  
  // Propeller (same as _renderPropeller)
  push();
  translate(subRadius * PLAYER_PROPELLER_X_OFFSET_FACTOR, 0); // Position propeller at the back
  
  fill(PLAYER_COLOR_PROPELLER_H, PLAYER_COLOR_PROPELLER_S, PLAYER_COLOR_PROPELLER_B);
  noStroke();
  
  let apparentHeight = subRadius * PLAYER_PROPELLER_MAX_SIDE_HEIGHT_FACTOR * abs(sin(startScreenPropellerAngle));
  let thickness = subRadius * PLAYER_PROPELLER_THICKNESS_FACTOR;
  
  rectMode(CENTER);
  rect(0, 0, thickness, apparentHeight);
  rectMode(CORNER); // Reset rectMode
  pop();
  
  pop();
  
  // Update propeller animation
  startScreenPropellerAngle += 0.3;
  
  // Spawn bubbles from propeller
  if (frameCount % 10 === 0) {
    sonarBubbles.push(new SonarBubble(subX - 20 + random(-5, 5), subY + random(-5, 5)));
  }
  
  // Update and render bubbles
  for (let i = sonarBubbles.length - 1; i >= 0; i--) {
    sonarBubbles[i].update();
    sonarBubbles[i].render(0, 0);
    if (sonarBubbles[i].isOffscreen()) {
      sonarBubbles.splice(i, 1);
    }
  }
  
  fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B); 
  textSize(START_SCREEN_TITLE_TEXT_SIZE);
  text(`Reactor Dive`, width / 2, height / 2 + START_SCREEN_TITLE_Y_OFFSET);
  
  textSize(START_SCREEN_INFO_TEXT_SIZE);
  text("WASD/Arrows: Move. SPACE: Shoot.", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_2);
  let killsForLevel1 = getKillsRequiredForLevel(1);
  text(`Destroy ${killsForLevel1} mutated creatures and reach the flooded reactor`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_1);
  
  fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
  text("Press ENTER to start", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_4);
  
  fill(START_SCREEN_AUDIO_NOTE_COLOR_H, START_SCREEN_AUDIO_NOTE_COLOR_S, START_SCREEN_AUDIO_NOTE_COLOR_B);
  textSize(14);
  text("Turn on audio for the best experience", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_4 + 30);
}

function drawLevelCompleteScreen() {
  textAlign(CENTER, CENTER);
  fill(LEVEL_COMPLETE_TITLE_COLOR_H, LEVEL_COMPLETE_TITLE_COLOR_S, LEVEL_COMPLETE_TITLE_COLOR_B); 
  textSize(LEVEL_COMPLETE_TITLE_TEXT_SIZE);
  text(`Level ${currentLevel} Complete!`, width / 2, height / 2 + LEVEL_COMPLETE_TITLE_Y_OFFSET);
  textSize(LEVEL_COMPLETE_PROMPT_TEXT_SIZE);
  text("Press ENTER for next level", width / 2, height / 2 + LEVEL_COMPLETE_PROMPT_Y_OFFSET);
}

function drawGameCompleteScreen() {
  textAlign(CENTER, CENTER);
  fill(LEVEL_COMPLETE_TITLE_COLOR_H, LEVEL_COMPLETE_TITLE_COLOR_S, LEVEL_COMPLETE_TITLE_COLOR_B); 
  textSize(LEVEL_COMPLETE_TITLE_TEXT_SIZE);
  text("All Reactors Secured!", width / 2, height / 2 + LEVEL_COMPLETE_TITLE_Y_OFFSET);
  textSize(LEVEL_COMPLETE_PROMPT_TEXT_SIZE);
  text("You've completed all levels!", width / 2, height / 2);
  text("Press ENTER to restart", width / 2, height / 2 + LEVEL_COMPLETE_PROMPT_Y_OFFSET);
}

function drawGameOverScreen() {
  textAlign(CENTER, CENTER);
  fill(GAME_OVER_TITLE_COLOR_H, GAME_OVER_TITLE_COLOR_S, GAME_OVER_TITLE_COLOR_B); 
  textSize(GAME_OVER_TITLE_TEXT_SIZE);
  text("Mission Failed", width / 2, height / 2 + GAME_OVER_TITLE_Y_OFFSET);
  textSize(GAME_OVER_PROMPT_TEXT_SIZE);
  text("Press ENTER to try again", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
}

function drawPlayingState() {
  let cameraOffsetX = player.pos.x - width / 2;
  let cameraOffsetY = player.pos.y - height / 2;

  // Cave walls
  fill(CAVE_WALL_COLOR_H, CAVE_WALL_COLOR_S, CAVE_WALL_COLOR_B);
  noStroke();
  for (let i = 0; i < cave.gridWidth; i++) {
    for (let j = 0; j < cave.gridHeight; j++) {
      if (cave.grid[i] && cave.grid[i][j]) {
        let x = i * cave.cellSize - cameraOffsetX;
        let y = j * cave.cellSize - cameraOffsetY;
        if (x > -cave.cellSize && x < width + cave.cellSize && y > -cave.cellSize && y < height + cave.cellSize) {
        //  rect(x, y, cave.cellSize, cave.cellSize);
        }
      }
    }
  }

  // Goal - only render when player is within the goal area
  if (cave.isGoal(player.pos.x, player.pos.y)) {
    cave.renderGoal(cameraOffsetX, cameraOffsetY);
  }

  // Update and render objects
  cleanupOldObjects(projectiles);
  cleanupOldObjects(sonarBubbles);
  cleanupOldObjects(particles);

  for (let proj of projectiles) {
    proj.update(cave);
    proj.render(cameraOffsetX, cameraOffsetY);
  }

  for (let bubble of sonarBubbles) {
    bubble.update();
    bubble.render(cameraOffsetX, cameraOffsetY);
  }

  for (let particle of particles) {
    particle.update();
    particle.render(cameraOffsetX, cameraOffsetY);
  }

  // Render current areas (this will also spawn their bubbles)
  for (let area of currentAreas) {
    if (cave) { // Only spawn bubbles if cave is initialized
      area.spawnBubbles(cave); // Spawn bubbles for current area, only in open space
    }
    //area.render(cameraOffsetX, cameraOffsetY);
  }

  player.update(cave, enemies, currentAreas); // Pass currentAreas to player update
  for (let enemy of enemies) enemy.update(cave, player);
  for (let jelly of jellyfish) jelly.update(cave, player);
  
  // Note: Jellyfish are not rendered directly - only visible through sonar hits
  player.handleEnemyCollisions(enemies);
  player.handleJellyfishCollisions(jellyfish);

  // Projectile-Enemy Collisions
  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (projectiles[i] && enemies[j]) {
        let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, enemies[j].pos.x, enemies[j].pos.y);
        if (d < projectiles[i].radius + enemies[j].radius) {
          createExplosion(projectiles[i].pos.x, projectiles[i].pos.y, 'enemy');
          enemies.splice(j, 1); 
          projectiles.splice(i, 1); 
          enemiesKilledThisLevel++;
          playSound('explosion'); 
          break; 
        }
      }
    }
  }

  // Projectile-Jellyfish Collisions
  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = jellyfish.length - 1; j >= 0; j--) {
      if (projectiles[i] && jellyfish[j]) {
        let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, jellyfish[j].pos.x, jellyfish[j].pos.y);
        if (d < projectiles[i].radius + jellyfish[j].radius) {
          let destroyed = jellyfish[j].takeDamage();
          createExplosion(projectiles[i].pos.x, projectiles[i].pos.y, 'enemy');
          projectiles.splice(i, 1);
          
          if (destroyed) {
            jellyfish.splice(j, 1);
            enemiesKilledThisLevel++;
            playSound('explosion');
          } else {
            playSound('bump');
          }
          break;
        }
      }
    }
  }

  player.render(cameraOffsetX, cameraOffsetY);

  // HUD
  fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B); 
  textSize(HUD_TEXT_SIZE); 
  textAlign(LEFT, TOP);
  text(`Hull: ${player.health}%`, HUD_MARGIN_X, HUD_MARGIN_Y);
  text(`Air: ${floor(player.airSupply / AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR)} seconds `, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING);
  const killsRequired = getKillsRequiredForLevel(currentLevel);
  let killsStillNeeded = Math.max(0, killsRequired - enemiesKilledThisLevel);
  text(`Kills Needed: ${killsStillNeeded}`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 2);
  let distanceToGoal = dist(player.pos.x, player.pos.y, cave.goalPos.x, cave.goalPos.y);
  text(`Distance to Reactor: ${floor(distanceToGoal)} meters`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 3);

  // Update reactor hum volume based on distance to goal (reactor)
  updateReactorHum(distanceToGoal);

  // Check Game Over / Level Complete Conditions
  if (player.health <= 0 || player.airSupply <= 0) {
      if(gameState === 'playing') playSound('gameOver');
      gameState = 'gameOver';
  } else if (cave.isGoal(player.pos.x, player.pos.y) && killsStillNeeded === 0) {
    gameState = (currentLevel >= MAX_LEVELS) ? 'gameComplete' : 'levelComplete';
  }
}

function mousePressed() {
    if (!audioInitialized) {
        startAudioRoutine();
    }
    let fs = fullscreen();
    fullscreen(!fs);
}

function keyPressed() {
  // Start audio on Enter press from certain game states if not already started
  if (!audioInitialized && (keyCode === ENTER && (gameState === 'start' || gameState === 'levelComplete' || gameState === 'gameOver' || gameState === 'gameComplete'))) {
    startAudioRoutine();
  }

  if (gameState === 'playing') {
    if (keyCode === KEY_CODE_SPACE) player.shoot();
  } else if (gameState === 'start' && keyCode === ENTER) {
    gameState = 'playing';
    player.lastSonarTime = frameCount - player.sonarCooldown;
    if (audioInitialized && reactorHumOsc && reactorHumOsc.started) {
      reactorHumOsc.amp(0, 0);
    }
 }  else if ((gameState === 'gameOver' || gameState === 'gameComplete') && keyCode === ENTER) {
    resetGame();
  } else if (gameState === 'levelComplete' && keyCode === ENTER) {
    prepareNextLevel();
  }
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}
