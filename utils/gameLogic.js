// --- Game Logic Functions ---

// Get kills required for a specific level
function getKillsRequiredForLevel(level) {
  return 5 + (level - 1) * 3; // 5 for level 1, +3 per level
}

// Initialize game objects for the current level
function initGameObjects() {
  currentCellSize = BASE_CELL_SIZE + (currentLevel - 1) * 2; // Calculate current cell size

  let baseAir = INITIAL_AIR_SUPPLY_BASE;
  let airForLevel = baseAir; // Initialize airForLevel with baseAir
  airForLevel = max(airForLevel, MIN_AIR_SUPPLY_PER_LEVEL); // Ensure minimum air
  let airDepletion = BASE_AIR_DEPLETION_RATE;
  
  let playerStartX, playerStartY;
  let attempts = 0;
  // MAX_PLAYER_SPAWN_ATTEMPTS is defined in Spawning constants
  let playerSpawnRadiusBuffer = currentCellSize * PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR; // Use currentCellSize

  cave = new Cave(WORLD_WIDTH, WORLD_HEIGHT, currentCellSize); // Pass currentCellSize to Cave constructor

  // Find a safe starting position for the player
  do {
    playerStartX = currentCellSize * (PLAYER_START_X_BASE_CELLS + attempts * PLAYER_START_X_ATTEMPT_INCREMENT_CELLS); // Use currentCellSize
    playerStartY = WORLD_HEIGHT / 2 + random(-currentCellSize * PLAYER_START_Y_RANDOM_RANGE_CELLS, currentCellSize * PLAYER_START_Y_RANDOM_RANGE_CELLS); // Use currentCellSize
    attempts++;
    if (playerStartX > WORLD_WIDTH * PLAYER_SPAWN_MAX_X_SEARCH_FACTOR) {
        playerStartX = currentCellSize * PLAYER_START_X_BASE_CELLS; 
        playerStartY = WORLD_HEIGHT / 2; 
        break; // Use currentCellSize
    }
  } while (cave.isWall(playerStartX, playerStartY, playerSpawnRadiusBuffer) && attempts < MAX_PLAYER_SPAWN_ATTEMPTS);
  
  if (attempts >= MAX_PLAYER_SPAWN_ATTEMPTS) { // If still no safe spot, use a default
      playerStartX = currentCellSize * PLAYER_START_X_BASE_CELLS; 
      playerStartY = WORLD_HEIGHT / 2; // Use currentCellSize
  }

  player = new PlayerSub(playerStartX, playerStartY, airForLevel, airDepletion);
  
  enemies = []; 
  projectiles = [];
  sonarBubbles = []; // Initialize sonar bubbles array
  particles = []; // Initialize global particles array
  currentAreas = []; // Initialize current areas array
  
  let enemyCount = ENEMIES_PER_LEVEL_BASE + (currentLevel-1) * ENEMIES_PER_LEVEL_INCREMENT;
  for (let i = 0; i < enemyCount; i++) {
    let enemyX, enemyY, eAttempts = 0;
    do { // Try to spawn enemy in the main path
      enemyX = random(WORLD_WIDTH * 0.3, WORLD_WIDTH * 0.9);
      enemyY = random(WORLD_HEIGHT * 0.2, WORLD_HEIGHT * 0.8); 
      eAttempts++;
    } while ((!cave.isOnMainPath(enemyX, enemyY, 2) || cave.isWall(enemyX, enemyY, ENEMY_RADIUS + 10)) && eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS);
    if (eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS) {
      // Check distance from player
      let distFromPlayer = dist(enemyX, enemyY, playerStartX, playerStartY);
      if (distFromPlayer > MIN_ENEMY_DISTANCE_FROM_PLAYER_CELLS * currentCellSize) {
        enemies.push(new Enemy(enemyX, enemyY));
      }
    }
  }
  
  // Spawn jellyfish - starting from level 2
  jellyfish = [];
  if (currentLevel >= JELLYFISH_START_LEVEL) {
    let jellyfishCount = JELLYFISH_PER_LEVEL_BASE + (currentLevel - JELLYFISH_START_LEVEL) * JELLYFISH_PER_LEVEL_INCREMENT;
    for (let i = 0; i < jellyfishCount; i++) {
      let jellyfishX, jellyfishY, jAttempts = 0;
      do { // Try to spawn jellyfish on the main path, away from player
        jellyfishX = random(WORLD_WIDTH * 0.3, WORLD_WIDTH * 0.9); // Spawn in middle to right area
        jellyfishY = random(WORLD_HEIGHT * 0.2, WORLD_HEIGHT * 0.8);
        jAttempts++;
      } while ((!cave.isOnMainPath(jellyfishX, jellyfishY, 3) || cave.isWall(jellyfishX, jellyfishY, JELLYFISH_RADIUS + 10)) && jAttempts < MAX_JELLYFISH_SPAWN_ATTEMPTS);
      
      if (jAttempts < MAX_JELLYFISH_SPAWN_ATTEMPTS) {
        // Make sure jellyfish isn't too close to player start
        let distFromPlayer = dist(jellyfishX, jellyfishY, playerStartX, playerStartY);
        if (distFromPlayer > MIN_JELLYFISH_DISTANCE_FROM_PLAYER_CELLS * currentCellSize) {
          jellyfish.push(new Jellyfish(jellyfishX, jellyfishY));
        }
      }
    }
  }

  // Create current areas
  for (let i = 0; i < CURRENT_AREAS_PER_LEVEL; i++) {
    createCurrentArea();
  }
}

// Create a current area in a traversable cave path
function createCurrentArea() {
  let attempts = 0;
  let maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    // Random position in the cave
    let areaX = random(WORLD_WIDTH * 0.2, WORLD_WIDTH * 0.8);
    let areaY = random(WORLD_HEIGHT * 0.2, WORLD_HEIGHT * 0.8);
    let areaW = random(CURRENT_AREA_SIZE_MIN, CURRENT_AREA_SIZE_MAX);
    let areaH = random(CURRENT_AREA_SIZE_MIN, CURRENT_AREA_SIZE_MAX);
    
    // Check if area is in open cave space AND on the main path
    let validArea = true;
    let checkPoints = 8; // Number of points to check around the area
    
    for (let i = 0; i < checkPoints && validArea; i++) {
      let checkX = areaX + (i % 2) * areaW;
      let checkY = areaY + floor(i / 2) * (areaH / 2);
      
      if (cave.isWall(checkX, checkY, 10) || !cave.isOnMainPath(checkX, checkY, 1)) {
        validArea = false;
      }
    }
    
    // Additional check: ensure the center of the area is on the main path
    if (!cave.isOnMainPath(areaX + areaW/2, areaY + areaH/2, 2)) {
      validArea = false;
    }
    
    // Check distance from player spawn
    let playerDistSq = (areaX - player.pos.x) * (areaX - player.pos.x) + (areaY - player.pos.y) * (areaY - player.pos.y);
    if (playerDistSq < 150 * 150) { // Too close to player
      validArea = false;
    }
    
    // Check distance from goal
    let goalDistSq = (areaX - cave.goalPos.x) * (areaX - cave.goalPos.x) + (areaY - cave.goalPos.y) * (areaY - cave.goalPos.y);
    if (goalDistSq < 100 * 100) { // Too close to goal
      validArea = false;
    }
    
    if (validArea) {
      // Create random force direction and magnitude
      let forceDir = p5.Vector.random2D();
      let forceMag = random(CURRENT_FORCE_MAGNITUDE_MIN, CURRENT_FORCE_MAGNITUDE_MAX);
      
      currentAreas.push(new CurrentArea(areaX, areaY, areaW, areaH, forceDir, forceMag));
      return; // Successfully created area
    }
    
    attempts++;
  }
  
  // If we couldn't find a good spot, create a simple one away from player and goal
  let fallbackX = WORLD_WIDTH * 0.5;
  let fallbackY = WORLD_HEIGHT * 0.5;
  let fallbackW = CURRENT_AREA_SIZE_MIN;
  let fallbackH = CURRENT_AREA_SIZE_MIN;
  let forceDir = p5.Vector.random2D();
  let forceMag = CURRENT_FORCE_MAGNITUDE_MIN;
  
  currentAreas.push(new CurrentArea(fallbackX, fallbackY, fallbackW, fallbackH, forceDir, forceMag));
}

function resetGame() {
  currentLevel = 1;
  enemiesKilledThisLevel = 0; // Reset kills tracking
  // currentCellSize will be set in initGameObjects based on currentLevel
  initGameObjects();
  player.health = PLAYER_INITIAL_HEALTH; 
  player.airSupply = player.initialAirSupply; // Reset to full for new game
  player.lastSonarTime = frameCount - player.sonarCooldown; // Allow immediate sonar
  player.lastShotTime = frameCount - player.shotCooldown;   // Allow immediate shot
  sonarBubbles = []; // Clear bubbles on reset
  particles = []; // Clear global particles on reset
  gameState = 'start';
  if (audioInitialized && lowAirOsc && lowAirOsc.started) lowAirEnv.triggerRelease(lowAirOsc);
  // Reset reactor hum to zero volume when resetting game
  if (audioInitialized && reactorHumOsc && reactorHumOsc.started) {
    reactorHumOsc.amp(0, 0);
    reactorHumAmplitude = 0;
  }
  lastLowAirBeepTime = 0; // Reset beep timer
}

// Helper function to create explosions
function createExplosion(x, y, type) {
  let particleCount = 0;
  let colorH, colorS, colorB;

  if (type === 'wall') {
    particleCount = EXPLOSION_PARTICLE_COUNT_TORPEDO_WALL;
    colorH = EXPLOSION_PARTICLE_COLOR_H_WALL;
    colorS = EXPLOSION_PARTICLE_COLOR_S_WALL;
    colorB = EXPLOSION_PARTICLE_COLOR_B_WALL;
  } else if (type === 'enemy') {
    particleCount = EXPLOSION_PARTICLE_COUNT_TORPEDO_ENEMY;
    colorH = EXPLOSION_PARTICLE_COLOR_H_ENEMY;
    colorS = EXPLOSION_PARTICLE_COLOR_S_ENEMY;
    colorB = EXPLOSION_PARTICLE_COLOR_B_ENEMY;
  }

  for (let i = 0; i < particleCount; i++) {
    let angle = random(TWO_PI);
    let speed = random(EXPLOSION_PARTICLE_SPEED_MIN, EXPLOSION_PARTICLE_SPEED_MAX);
    let vel = p5.Vector.fromAngle(angle, speed);
    particles.push(new Particle(
      x, y, 
      vel.x, vel.y, 
      EXPLOSION_PARTICLE_MAX_LIFESPAN, 
      EXPLOSION_PARTICLE_MIN_SIZE, 
      EXPLOSION_PARTICLE_MAX_SIZE, 
      colorH, colorS, colorB, 
      EXPLOSION_PARTICLE_ALPHA_MAX
    ));
  }
}

function prepareNextLevel() {
  currentLevel++;
  enemiesKilledThisLevel = 0; // Reset kills tracking
  initGameObjects(); // This will create new cave, player (with new air), enemies
  // Player position is set by initGameObjects to a safe start in the new cave
  player.vel = createVector(0,0); 
  player.angle = 0; // Reset movement
  player.health = PLAYER_INITIAL_HEALTH; // Replenish health
  // Air supply is set by initGameObjects based on the new level
  player.lastSonarTime = frameCount - player.sonarCooldown;
  player.lastShotTime = frameCount - player.shotCooldown;
  gameState = 'playing';
  // Reactor hum is continuously playing, just reset to zero volume
  if (audioInitialized && reactorHumOsc && reactorHumOsc.started) {
    reactorHumOsc.amp(0, 0);
  }
  if (audioInitialized && lowAirOsc && lowAirOsc.started) lowAirEnv.triggerRelease(lowAirOsc);
  lastLowAirBeepTime = 0;
}

function startAudioRoutine() {
    function startAllSoundObjects() {
        const soundObjects = [
            sonarOsc, explosionNoise, explosionBoomOsc, bumpOsc, torpedoNoise, 
            lowAirOsc, reactorHumOsc, creatureGrowlOsc, gameOverImpactNoise, gameOverGroanOsc, gameOverFinalBoomNoise
        ];
        for (const soundObj of soundObjects) {
            if (soundObj && !soundObj.started && typeof soundObj.start === 'function') {
                soundObj.start();
            }
        }
        // Start reactor hum playing continuously
        if (reactorHumOsc && reactorHumOsc.started) {
            // Reactor hum plays continuously, volume controlled by amp()
        }
    }

    if (typeof userStartAudio === 'function') {
        userStartAudio().then(() => { audioInitialized = true; startAllSoundObjects(); })
                        .catch(e => { /* console.error("userStartAudio error", e); */ });
    } else {
        let ctx = getAudioContext();
        if (ctx && ctx.state !== 'running') {
            ctx.resume().then(() => { audioInitialized = true; startAllSoundObjects(); })
                        .catch(e => { /* console.error("AudioContext.resume error", e); */ });
        } else if (ctx && ctx.state === 'running') { 
            audioInitialized = true; 
            startAllSoundObjects(); 
        }
    }
}

// Remove old objects from arrays for performance
function cleanupOldObjects(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let obj = arr[i];
    if (obj.isOffscreen && obj.isOffscreen()) {
      arr.splice(i, 1);
    }
  }
}
