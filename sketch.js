// --- Configuration Constants ---

// Game Mechanics & World
const CELL_SIZE = 20;
const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 2000;
const MAX_LEVELS = 3;
const INITIAL_AIR_SUPPLY_BASE = 4500; // Base air supply in frames
const AIR_SUPPLY_LEVEL_REDUCTION = 600; // Air reduction per level
const MIN_AIR_SUPPLY_PER_LEVEL = 1800; // Minimum air supply
const BASE_AIR_DEPLETION_RATE = 1; // Base air depletion per frame
const AIR_DEPLETION_LEVEL_INCREASE = 0.1; // Additional depletion per level
const LEVEL_EXIT_MAX_ENEMIES_THRESHOLD = 5; // Max enemies to exit level

// Player Constants
const PLAYER_RADIUS = 14;
const PLAYER_INITIAL_HEALTH = 100;
const PLAYER_THRUST_POWER = 0.08;
const PLAYER_REVERSE_THRUST_FACTOR = 0.6;
const PLAYER_TURN_SPEED = 0.04;
const PLAYER_DAMPING = 0.985;
const PLAYER_MAX_SPEED = 2.5;
const PLAYER_COLLISION_RADIUS_FACTOR = 0.7; // For cave collision checks
const PLAYER_BUMP_DAMAGE = 2;
const PLAYER_BUMP_RECOIL_FACTOR = 0.5;
const PLAYER_BUMP_VELOCITY_REVERSE_FACTOR = -0.5;
const PLAYER_ENEMY_COLLISION_DAMAGE = 15;
const PLAYER_ENEMY_COLLISION_KNOCKBACK = 1.5;
const PLAYER_LOW_AIR_THRESHOLD_FACTOR = 0.25; // Percentage of air remaining to trigger warning
const PLAYER_PROJECTILE_OFFSET_FACTOR = 0.8; // Multiplier of radius for projectile start

// Player Sonar
const PLAYER_SONAR_RANGE = 350;
const PLAYER_SONAR_PULSES = 180;
const PLAYER_SONAR_COOLDOWN_FRAMES = 90;
const PLAYER_SONAR_DISPLAY_TIME_FRAMES = 120;
const PLAYER_SONAR_RAY_STEP = 5;
const PLAYER_SONAR_ENEMY_INTENSITY_MAX = 1.3;
const PLAYER_SONAR_ENEMY_INTENSITY_MIN = 0.6;
const PLAYER_SONAR_WALL_INTENSITY_MAX = 1.0;
const PLAYER_SONAR_WALL_INTENSITY_MIN = 0.3;
const PLAYER_SONAR_HIT_MAX_AGE_FACTOR = 2; // Multiplier for sonarDisplayTime for filtering hits
const PLAYER_SONAR_HIT_ALPHA_MAX = 200;
const PLAYER_SONAR_HIT_ALPHA_MIN = 0;
const PLAYER_SONAR_HIT_SIZE_MAX = 12;
const PLAYER_SONAR_HIT_SIZE_MIN = 3;
const PLAYER_SONAR_HIT_OFFSCREEN_BUFFER = 20;
const PLAYER_SONAR_ENEMY_HIT_SIZE_FACTOR = 1.3;

// Player Rendering
const PLAYER_BODY_WIDTH_FACTOR = 2.2;
const PLAYER_BODY_HEIGHT_FACTOR = 1.2;
const PLAYER_SAIL_OFFSET_X_FACTOR = 0.1; // Renamed from PLAYER_COCKPIT_OFFSET_X_FACTOR
const PLAYER_SAIL_WIDTH_FACTOR = 0.8;    // Renamed from PLAYER_COCKPIT_WIDTH_FACTOR
const PLAYER_SAIL_HEIGHT_FACTOR = 1.4;   // Renamed from PLAYER_COCKPIT_HEIGHT_FACTOR
const PLAYER_SAIL_CORNER_RADIUS_FACTOR = 0.2; // Renamed from PLAYER_COCKPIT_CORNER_RADIUS_FACTOR
const PLAYER_FIN_X1_FACTOR = -0.9; const PLAYER_FIN_Y1_FACTOR = -0.5;
const PLAYER_FIN_X2_FACTOR = -0.9; const PLAYER_FIN_Y2_FACTOR = 0.5;
const PLAYER_FIN_X3_FACTOR = -1.4; const PLAYER_FIN_Y3_FACTOR = 0.3;
const PLAYER_FIN_X4_FACTOR = -1.4; const PLAYER_FIN_Y4_FACTOR = -0.3;
const PLAYER_SONAR_ARC_RADIUS_FACTOR = 3.5;
const PLAYER_SHOT_ARC_RADIUS_FACTOR = 2.5;

// Player Propeller Rendering (Side View)
const PLAYER_PROPELLER_X_OFFSET_FACTOR = -1.2; // Offset from player center, behind the body
const PLAYER_PROPELLER_MAX_SIDE_HEIGHT_FACTOR = 0.8; // New: Max apparent height from side view (relative to player radius)
const PLAYER_PROPELLER_THICKNESS_FACTOR = 0.3;   // New: Thickness of the propeller from side view (relative to player radius)
const PLAYER_PROPELLER_SPIN_SPEED_FACTOR = 0.2; // How fast it appears to spin (adjust for visual preference)

// Projectile Constants
const PROJECTILE_SPEED = 10;
const PROJECTILE_RADIUS = 4;
const PROJECTILE_LIFESPAN_FRAMES = 100;
const PLAYER_SHOT_COOLDOWN_FRAMES = 30;
const PROJECTILE_WALL_COLLISION_RADIUS_FACTOR = 0.5; // For more accurate feel

// Enemy Constants
const ENEMY_RADIUS = 14; // Note: PlayerSub also has radius 14, consider if they should differ
const ENEMY_MIN_BASE_SPEED = 0.4;
const ENEMY_MAX_BASE_SPEED = 0.8;
const ENEMY_SPEED_LEVEL_MULTIPLIER = 0.1;
const ENEMY_AI_NEW_VEL_MIN_SPEED_FACTOR = 0.3; // When AI decides new velocity
const ENEMY_AI_NEW_VEL_MAX_SPEED_FACTOR = 0.7; // When AI decides new velocity
const ENEMY_AI_DECISION_MIN_INTERVAL_FRAMES = 60; // Min frames before changing direction
const ENEMY_AI_DECISION_MAX_INTERVAL_BASE_FRAMES = 180; // Max base frames before changing direction
const ENEMY_AI_DECISION_INTERVAL_LEVEL_REDUCTION_FRAMES = 10; // Reduces max random interval per level
const ENEMY_AI_WALL_HIT_DECISION_MIN_INTERVAL_FRAMES = 20; // Quicker decision after hitting a wall
const ENEMY_AI_WALL_HIT_DECISION_MAX_INTERVAL_FRAMES = 60;

// Cave Generation
const CAVE_EXIT_X_OFFSET_CELLS = 10; // How many cells from the right edge the exit starts
const CAVE_PATH_Y_NOISE_FACTOR_1 = 0.03;
const CAVE_PATH_Y_NOISE_OFFSET_1 = 10; // Base offset, currentLevel added
const CAVE_PATH_Y_NOISE_MULT_1 = 2.5;
const CAVE_PATH_MIN_RADIUS_CELLS = 4.5; // Adjusted for more clearance (was 3.5)
const CAVE_PATH_MAX_RADIUS_CELLS = 7;
const CAVE_PATH_RADIUS_NOISE_FACTOR = 0.05;
const CAVE_PATH_RADIUS_NOISE_OFFSET = 20; // Base offset, currentLevel added
const CAVE_OBSTACLE_NOISE_FACTOR_1 = 0.1;
const CAVE_OBSTACLE_NOISE_OFFSET_1 = 30; // Base offset, currentLevel added
const CAVE_OBSTACLE_THRESHOLD_1 = 0.68;
const CAVE_OBSTACLE_DIST_BUFFER_1 = 1.5; // cells, from main path
const CAVE_CLEARING_NOISE_FACTOR = 0.08;
const CAVE_CLEARING_NOISE_OFFSET = 40; // Base offset, currentLevel added
const CAVE_CLEARING_THRESHOLD = 0.35;
const CAVE_WALL_CHECK_POINTS = 8; // Number of points to check around an object for wall collision

// Spawning
const MAX_PLAYER_SPAWN_ATTEMPTS = 50;
const PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR = 1.5; // Multiplier of CELL_SIZE
const PLAYER_START_X_BASE_CELLS = 5;
const PLAYER_START_X_ATTEMPT_INCREMENT_CELLS = 0.2;
const PLAYER_START_Y_RANDOM_RANGE_CELLS = 4; // +/- from center
const PLAYER_SPAWN_MAX_X_SEARCH_FACTOR = 1/5; // Max distance to search for player spawn (world width factor)

const BASE_ENEMY_COUNT = 10; // Initial number of enemies at level 1
const ENEMY_COUNT_PER_LEVEL_INCREASE = 4; // How many more enemies per level
const MAX_ENEMY_COUNT = 30; // Absolute maximum number of enemies
const ENEMY_SPAWN_MIN_X_WORLD_FACTOR = 0.15; // Spawn enemies in this fraction of world width
const ENEMY_SPAWN_MAX_X_WORLD_FACTOR = 0.9;
const ENEMY_SPAWN_MIN_Y_WORLD_FACTOR = 0.1;  // Spawn enemies in this fraction of world height
const ENEMY_SPAWN_MAX_Y_WORLD_FACTOR = 0.9;
const ENEMY_SPAWN_WALL_CHECK_RADIUS = 25; // Radius to check for walls when finding an enemy spawn point
const MAX_ENEMY_SPAWN_ATTEMPTS = 50;    // Max attempts to find a clear spawn spot for a single enemy


// Sound General
const LOW_AIR_BEEP_INTERVAL = 1000; // milliseconds

// Sound ADSR and Frequencies (AttackTime, DecayTime, SustainRatio, ReleaseTime, AttackLevel, ReleaseLevel)
const SONAR_ENV_ADSR = { aT: 0.01, dT: 0.1, sR: 0, rT: 0.1 };
const SONAR_ENV_LEVELS = { aL: 0.3, rL: 0 };
const SONAR_FREQ = 800;

const EXPLOSION_NOISE_ENV_ADSR = { aT: 0.01, dT: 0.25, sR: 0, rT: 0.15 };
const EXPLOSION_NOISE_ENV_LEVELS = { aL: 0.4, rL: 0 };
const EXPLOSION_BOOM_ENV_ADSR = { aT: 0.01, dT: 0.3, sR: 0, rT: 0.2 };
const EXPLOSION_BOOM_ENV_LEVELS = { aL: 0.5, rL: 0 };
const EXPLOSION_BOOM_MIN_FREQ = 60;
const EXPLOSION_BOOM_MAX_FREQ = 90;

const BUMP_ENV_ADSR = { aT: 0.005, dT: 0.15, sR: 0, rT: 0.1 };
const BUMP_ENV_LEVELS = { aL: 0.4, rL: 0 };
const BUMP_FREQ = 100;

const TORPEDO_ENV_ADSR = { aT: 0.02, dT: 0.3, sR: 0, rT: 0.2 };
const TORPEDO_ENV_LEVELS = { aL: 0.3, rL: 0 };

const LOW_AIR_ENV_ADSR = { aT: 0.05, dT: 0.1, sR: 0.6, rT: 0.2 };
const LOW_AIR_ENV_LEVELS = { aL: 0.2, rL: 0 };
const LOW_AIR_FREQ = 1200;

const GAME_OVER_IMPACT_ENV_ADSR = { aT: 0.005, dT: 0.1, sR: 0, rT: 0.05 };
const GAME_OVER_IMPACT_ENV_LEVELS = { aL: 0.6, rL: 0 };
const GAME_OVER_GROAN_ENV_ADSR = { aT: 0.2, dT: 1.5, sR: 0, rT: 0.5 };
const GAME_OVER_GROAN_ENV_LEVELS = { aL: 0.4, rL: 0 };
const GAME_OVER_GROAN_MIN_FREQ = 40;
const GAME_OVER_GROAN_MAX_FREQ = 70;
const GAME_OVER_GROAN_PITCH_DOWN_TARGET_FREQ = 30;
const GAME_OVER_GROAN_PITCH_DOWN_TIME = 1.5;
const GAME_OVER_GROAN_PITCH_DOWN_DELAY = 0.1;
const GAME_OVER_FINAL_BOOM_ENV_ADSR = { aT: 0.05, dT: 0.8, sR: 0, rT: 0.5 };
const GAME_OVER_FINAL_BOOM_ENV_LEVELS = { aL: 0.7, rL: 0 };
const GAME_OVER_GROAN_DELAY_MS = 50;
const GAME_OVER_FINAL_BOOM_DELAY_MS = 800;

// UI Colors & Styles
const BACKGROUND_COLOR_H = 220; const BACKGROUND_COLOR_S = 70; const BACKGROUND_COLOR_B = 15;
const DEFAULT_STROKE_WEIGHT = 1;

const PLAYER_COLOR_BODY_H = 80; const PLAYER_COLOR_BODY_S = 70; const PLAYER_COLOR_BODY_B = 90;
const PLAYER_COLOR_SAIL_H = 70; const PLAYER_COLOR_SAIL_S = 65; const PLAYER_COLOR_SAIL_B = 85; // Renamed from PLAYER_COLOR_COCKPIT
const PLAYER_COLOR_FIN_H = 75; const PLAYER_COLOR_FIN_S = 68; const PLAYER_COLOR_FIN_B = 88;
const PLAYER_COLOR_PROPELLER_H = 60; const PLAYER_COLOR_PROPELLER_S = 50; const PLAYER_COLOR_PROPELLER_B = 70; // New Propeller Color
const PROJECTILE_COLOR_H = 60; const PROJECTILE_COLOR_S = 100; const PROJECTILE_COLOR_B = 100; const PROJECTILE_COLOR_A = 200;
const PLAYER_SONAR_WALL_COLOR_H = 100; const PLAYER_SONAR_WALL_COLOR_S = 50; const PLAYER_SONAR_WALL_COLOR_B = 50;
const PLAYER_SONAR_ENEMY_COLOR_H = 0; const PLAYER_SONAR_ENEMY_COLOR_S = 70; const PLAYER_SONAR_ENEMY_COLOR_B = 70;
const PLAYER_SONAR_ARC_WEIGHT = 3;
const PLAYER_SONAR_ARC_COLOR_H = 120; const PLAYER_SONAR_ARC_COLOR_S = 100; const PLAYER_SONAR_ARC_COLOR_B = 100; const PLAYER_SONAR_ARC_COLOR_A = 100;
const PLAYER_SHOT_ARC_WEIGHT = 2;
const PLAYER_SHOT_ARC_COLOR_H = 0; const PLAYER_SHOT_ARC_COLOR_S = 100; const PLAYER_SHOT_ARC_COLOR_B = 100; const PLAYER_SHOT_ARC_COLOR_A = 80;
const ENEMY_COLOR_H = 0; const ENEMY_COLOR_S = 80; const ENEMY_COLOR_B = 80; // Example for direct enemy rendering if added

// UI Text Sizes & Positions
const HUD_TEXT_COLOR_H = 50; const HUD_TEXT_COLOR_S = 80; const HUD_TEXT_COLOR_B = 100;
const HUD_TEXT_SIZE = 18;
const HUD_MARGIN_X = 10;
const HUD_MARGIN_Y = 10;
const HUD_LINE_SPACING = 25; // Was 25, derived from 35-10, 60-35 etc.
const AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR = 60; // Assuming 60fps for display

const START_SCREEN_TITLE_COLOR_H = 50; const START_SCREEN_TITLE_COLOR_S = 100; const START_SCREEN_TITLE_COLOR_B = 100;
const START_SCREEN_TITLE_TEXT_SIZE = 48;
const START_SCREEN_TITLE_Y_OFFSET = -140;
const START_SCREEN_INFO_TEXT_SIZE = 20;
const START_SCREEN_INFO_Y_OFFSET_1 = -80;
const START_SCREEN_INFO_Y_OFFSET_2 = -50;
const START_SCREEN_INFO_Y_OFFSET_3 = -20;
const START_SCREEN_INFO_Y_OFFSET_4 = 10;
const START_SCREEN_FULLSCREEN_Y_OFFSET = 40;
const START_SCREEN_PROMPT_TEXT_SIZE = 28;
const START_SCREEN_PROMPT_COLOR_H = 120; const START_SCREEN_PROMPT_COLOR_S = 100; const START_SCREEN_PROMPT_COLOR_B = 100;
const START_SCREEN_PROMPT_Y_OFFSET = 80;
const START_SCREEN_AUDIO_NOTE_TEXT_SIZE = 16;
const START_SCREEN_AUDIO_NOTE_COLOR_H = 200; const START_SCREEN_AUDIO_NOTE_COLOR_S = 80; const START_SCREEN_AUDIO_NOTE_COLOR_B = 80;
const START_SCREEN_AUDIO_NOTE_Y_OFFSET = 110;

const LEVEL_COMPLETE_TITLE_COLOR_H = 100; const LEVEL_COMPLETE_TITLE_COLOR_S = 100; const LEVEL_COMPLETE_TITLE_COLOR_B = 100;
const LEVEL_COMPLETE_TITLE_TEXT_SIZE = 48;
const LEVEL_COMPLETE_TITLE_Y_OFFSET = -40;
const LEVEL_COMPLETE_INFO_TEXT_SIZE = 24;
const LEVEL_COMPLETE_INFO_Y_OFFSET = 10;
const LEVEL_COMPLETE_PROMPT_Y_OFFSET = 50;

const GAME_COMPLETE_TITLE_COLOR_H = 120; const GAME_COMPLETE_TITLE_COLOR_S = 100; const GAME_COMPLETE_TITLE_COLOR_B = 100;
const GAME_COMPLETE_TITLE_TEXT_SIZE = 60;
const GAME_COMPLETE_TITLE_Y_OFFSET = -40;
const GAME_COMPLETE_INFO_TEXT_SIZE = 24;
const GAME_COMPLETE_INFO_Y_OFFSET = 20;
const GAME_COMPLETE_PROMPT_Y_OFFSET = 60;

const GAME_OVER_TITLE_COLOR_H = 0; const GAME_OVER_TITLE_COLOR_S = 80; const GAME_OVER_TITLE_COLOR_B = 70;
const GAME_OVER_TITLE_TEXT_SIZE = 60;
const GAME_OVER_TITLE_Y_OFFSET = -40;
const GAME_OVER_INFO_TEXT_SIZE = 24;
const GAME_OVER_INFO_Y_OFFSET = 10;
const GAME_OVER_PROMPT_Y_OFFSET = 50;

// Key Codes
const KEY_CODE_SPACE = 32;
const KEY_CODE_W = 87;
const KEY_CODE_S = 83;
const KEY_CODE_A = 65;
const KEY_CODE_D = 68;
// Note: ENTER key is already a p5.js constant, no need to redefine.

// Sound objects
let sonarOsc, sonarEnv;
let explosionNoise, explosionEnv, explosionBoomOsc, explosionBoomEnv; // Enemy Explosion
let bumpOsc, bumpEnv;
let torpedoNoise, torpedoEnv; // Changed from Osc to Noise for woosh
let lowAirOsc, lowAirEnv;
let gameOverImpactNoise, gameOverImpactEnv, gameOverGroanOsc, gameOverGroanEnv, gameOverFinalBoomNoise, gameOverFinalBoomEnv; // Sub Destruction

let audioInitialized = false;
let lastLowAirBeepTime = 0;

// Game Variables
let player;
let cave;
let enemies = [];
let projectiles = [];
let cameraOffsetX, cameraOffsetY;
let gameState = 'start';
let currentLevel = 1;

// --- Projectile Class ---
class Projectile {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle).mult(PROJECTILE_SPEED);
    this.radius = PROJECTILE_RADIUS; this.life = PROJECTILE_LIFESPAN_FRAMES;
  }
  update(cave) {
    this.pos.add(this.vel); this.life--;
    // Check collision with a smaller radius for projectiles to feel more accurate
    if (cave.isWall(this.pos.x, this.pos.y, this.radius * PROJECTILE_WALL_COLLISION_RADIUS_FACTOR)) this.life = 0;
  }
  render(offsetX, offsetY) {
    push(); fill(PROJECTILE_COLOR_H, PROJECTILE_COLOR_S, PROJECTILE_COLOR_B, PROJECTILE_COLOR_A); noStroke();
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
    this.exitX = worldWidth - cellSize * CAVE_EXIT_X_OFFSET_CELLS;
  }
  generateCave() {
    for (let i = 0; i < this.gridWidth; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridHeight; j++) this.grid[i][j] = false; // Initialize as open space
    }
    let pathY = this.gridHeight / 2; let currentPathRadius = 0;
    let pathMinRadius = CAVE_PATH_MIN_RADIUS_CELLS; let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    noiseSeed(millis() + currentLevel * 1000); // Seed for consistent cave per level, varied by run
    for (let i = 0; i < this.gridWidth; i++) {
      pathY += (noise(i * CAVE_PATH_Y_NOISE_FACTOR_1, CAVE_PATH_Y_NOISE_OFFSET_1 + currentLevel) - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
      pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1); // Keep path within bounds
      currentPathRadius = map(noise(i * CAVE_PATH_RADIUS_NOISE_FACTOR, CAVE_PATH_RADIUS_NOISE_OFFSET + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
      for (let j = 0; j < this.gridHeight; j++) {
        if (abs(j - pathY) > currentPathRadius) this.grid[i][j] = true; // Mark as wall
      }
      if (i === this.gridWidth - 1) { this.exitPathY = pathY; this.exitPathRadius = currentPathRadius; } // Store exit path details
    }
    // Add some random obstacles and clearings
    for (let i = 1; i < this.gridWidth - 1; i++) {
      for (let j = 1; j < this.gridHeight - 1; j++) {
        if (!this.grid[i][j]) { // If it\'s currently open path
          if (noise(i * CAVE_OBSTACLE_NOISE_FACTOR_1, j * CAVE_OBSTACLE_NOISE_FACTOR_1, CAVE_OBSTACLE_NOISE_OFFSET_1 + currentLevel) > CAVE_OBSTACLE_THRESHOLD_1 && dist(i, j, i, pathY) > currentPathRadius + CAVE_OBSTACLE_DIST_BUFFER_1) {
            this.grid[i][j] = true; // Add an obstacle
          }
        } else { // If it\'s currently a wall
          if (noise(i * CAVE_CLEARING_NOISE_FACTOR, j * CAVE_CLEARING_NOISE_FACTOR, CAVE_CLEARING_NOISE_OFFSET + currentLevel) < CAVE_CLEARING_THRESHOLD) {
            this.grid[i][j] = false; // Carve a clearing
          }
        }
      }
    }
    // Ensure borders are walls
    for (let i = 0; i < this.gridWidth; i++) { this.grid[i][0] = true; this.grid[i][this.gridHeight - 1] = true; }
    for (let j = 0; j < this.gridHeight; j++) this.grid[0][j] = true;
    for (let j = 0; j < this.gridHeight; j++) {
      if (abs(j - this.exitPathY) > this.exitPathRadius) this.grid[this.gridWidth - 1][j] = true;
      else this.grid[this.gridWidth - 1][j] = false;
    }
  }
  isWall(worldX, worldY, objectRadius = 0) {
    if (worldX < 0 || worldX >= this.worldWidth || worldY < 0 || worldY >= this.worldHeight) return true; // Out of bounds is a wall
    const checks = CAVE_WALL_CHECK_POINTS;
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
    this.radius = PLAYER_RADIUS; this.thrustPower = PLAYER_THRUST_POWER; this.turnSpeed = PLAYER_TURN_SPEED;
    this.damping = PLAYER_DAMPING; this.maxSpeed = PLAYER_MAX_SPEED;
    this.sonarHits = []; this.sonarRange = PLAYER_SONAR_RANGE; this.sonarPulses = PLAYER_SONAR_PULSES;
    this.sonarCooldown = PLAYER_SONAR_COOLDOWN_FRAMES; this.lastSonarTime = -this.sonarCooldown; // Allow immediate first sonar
    this.sonarDisplayTime = PLAYER_SONAR_DISPLAY_TIME_FRAMES; this.health = PLAYER_INITIAL_HEALTH;
    this.initialAirSupply = initialAir; this.airSupply = this.initialAirSupply;
    this.airDepletionRate = airDepletionRatePerFrame;
    this.shotCooldown = PLAYER_SHOT_COOLDOWN_FRAMES; this.lastShotTime = -this.shotCooldown; // Allow immediate first shot
    this.propellerAngle = 0; // For propeller animation
  }
  fireSonar(cave, enemies) {
    this.lastSonarTime = frameCount; playSound('sonar');
    for (let i = 0; i < this.sonarPulses; i++) {
      let rayAngle = this.angle - PI + (TWO_PI / this.sonarPulses) * i; // Sonar sweeps around the sub
      let hitDetectedOnRay = false;
      for (let dist = 0; dist < this.sonarRange; dist += PLAYER_SONAR_RAY_STEP) {
        if (hitDetectedOnRay) break; // Optimization: stop ray if something is hit
        let checkX = this.pos.x + cos(rayAngle) * dist; let checkY = this.pos.y + sin(rayAngle) * dist;
        // Check for enemy hits first
        for (let enemy of enemies) {
          if (p5.Vector.dist(createVector(checkX, checkY), enemy.pos) < enemy.radius) {
            this.sonarHits.push({ x: checkX, y: checkY, type: 'enemy', receivedAt: frameCount, intensity: map(dist, 0, this.sonarRange, PLAYER_SONAR_ENEMY_INTENSITY_MAX, PLAYER_SONAR_ENEMY_INTENSITY_MIN) });
            hitDetectedOnRay = true; break;
          }
        }
        if (hitDetectedOnRay) break; // If enemy hit, don\'t check for wall at same spot
        // Check for wall hits
        if (cave.isWall(checkX, checkY)) {
          this.sonarHits.push({ x: checkX, y: checkY, type: 'wall', receivedAt: frameCount, intensity: map(dist, 0, this.sonarRange, PLAYER_SONAR_WALL_INTENSITY_MAX, PLAYER_SONAR_WALL_INTENSITY_MIN) });
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
      this.lastShotTime = frameCount; playSound('torpedo');
    }
  }
  update(cave, currentEnemies) {
    if (keyIsDown(UP_ARROW) || keyIsDown(KEY_CODE_W)) this.vel.add(p5.Vector.fromAngle(this.angle).mult(this.thrustPower));
    if (keyIsDown(DOWN_ARROW) || keyIsDown(KEY_CODE_S)) this.vel.add(p5.Vector.fromAngle(this.angle).mult(-this.thrustPower * PLAYER_REVERSE_THRUST_FACTOR));
    if (keyIsDown(LEFT_ARROW) || keyIsDown(KEY_CODE_A)) this.angle -= this.turnSpeed;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(KEY_CODE_D)) this.angle += this.turnSpeed;
    // Removed keyIsDown(32) for shooting from here, as it\'s handled in keyPressed for single press

    // Update propeller angle based on movement
    if (this.vel.magSq() > 0.01) { // Check if moving (magSq is cheaper than mag)
        this.propellerAngle += this.vel.mag() * PLAYER_PROPELLER_SPIN_SPEED_FACTOR;
    }


    if (frameCount - this.lastSonarTime >= this.sonarCooldown) this.fireSonar(cave, currentEnemies);

    this.vel.limit(this.maxSpeed); let nextPos = p5.Vector.add(this.pos, this.vel);
    if (cave.isWall(nextPos.x, nextPos.y, this.radius * PLAYER_COLLISION_RADIUS_FACTOR)) {
      this.pos.sub(this.vel.copy().mult(PLAYER_BUMP_RECOIL_FACTOR)); // Move back slightly
      this.vel.mult(PLAYER_BUMP_VELOCITY_REVERSE_FACTOR); // Reverse and dampen velocity
      this.health -= PLAYER_BUMP_DAMAGE; if (this.health < 0) this.health = 0; playSound('bump');
    } else {
      this.pos.add(this.vel);
    }
    this.vel.mult(this.damping); this.airSupply -= this.airDepletionRate;
    if (this.airSupply < 0) this.airSupply = 0;

    // Low air warning sound
    if (audioInitialized && this.airSupply > 0 && this.airSupply < this.initialAirSupply * PLAYER_LOW_AIR_THRESHOLD_FACTOR) {
      if (millis() - lastLowAirBeepTime > LOW_AIR_BEEP_INTERVAL) { playSound('lowAir'); lastLowAirBeepTime = millis(); }
    } else if (audioInitialized && lowAirOsc && lowAirOsc.started && typeof lowAirOsc.stop === 'function') {
      // Ensure low air sound stops if air is replenished or game not active
      lowAirEnv.triggerRelease(lowAirOsc);
    }
  }
  render(offsetX, offsetY) {
    push(); translate(width / 2, height / 2); rotate(this.angle); // Player is always centered and rotated
    // Submarine Body
    fill(PLAYER_COLOR_BODY_H, PLAYER_COLOR_BODY_S, PLAYER_COLOR_BODY_B); noStroke(); ellipse(0, 0, this.radius * PLAYER_BODY_WIDTH_FACTOR, this.radius * PLAYER_BODY_HEIGHT_FACTOR);
    // Sail (formerly Cockpit)
    fill(PLAYER_COLOR_SAIL_H, PLAYER_COLOR_SAIL_S, PLAYER_COLOR_SAIL_B); rectMode(CENTER); rect(this.radius * PLAYER_SAIL_OFFSET_X_FACTOR, 0, this.radius * PLAYER_SAIL_WIDTH_FACTOR, this.radius * PLAYER_SAIL_HEIGHT_FACTOR, this.radius * PLAYER_SAIL_CORNER_RADIUS_FACTOR);
    // Fin
    fill(PLAYER_COLOR_FIN_H, PLAYER_COLOR_FIN_S, PLAYER_COLOR_FIN_B); beginShape();
    vertex(-this.radius * PLAYER_FIN_X1_FACTOR, -this.radius * PLAYER_FIN_Y1_FACTOR); vertex(-this.radius * PLAYER_FIN_X2_FACTOR, this.radius * PLAYER_FIN_Y2_FACTOR);
    vertex(-this.radius * PLAYER_FIN_X3_FACTOR, this.radius * PLAYER_FIN_Y3_FACTOR); vertex(-this.radius * PLAYER_FIN_X4_FACTOR, -this.radius * PLAYER_FIN_Y4_FACTOR);
    endShape(CLOSE);

    // Propeller (Side View)
    push();
    translate(this.radius * PLAYER_PROPELLER_X_OFFSET_FACTOR, 0); // Position propeller at the back

    fill(PLAYER_COLOR_PROPELLER_H, PLAYER_COLOR_PROPELLER_S, PLAYER_COLOR_PROPELLER_B);
    noStroke();

    // Modulate the apparent height of the propeller based on its spin angle
    // abs(sin(angle)) gives a value from 0 to 1, cycling twice per full rotation (one full cycle of apparent motion)
    let apparentHeight = this.radius * PLAYER_PROPELLER_MAX_SIDE_HEIGHT_FACTOR * abs(sin(this.propellerAngle));
    let thickness = this.radius * PLAYER_PROPELLER_THICKNESS_FACTOR;

    rectMode(CENTER); // Draw the propeller centered at its translated origin
    rect(0, 0, thickness, apparentHeight); // Draw as a thin, vertically oriented rectangle that changes height

    pop(); // End propeller transformations

    rectMode(CORNER); // Reset rectMode for other drawing operations if any
    pop(); // End player transformations

    // Render Sonar Hits
    for (let i = this.sonarHits.length - 1; i >= 0; i--) {
      let hit = this.sonarHits[i]; let age = frameCount - hit.receivedAt;
      if (age < this.sonarDisplayTime) {
        let alpha = map(age, 0, this.sonarDisplayTime, PLAYER_SONAR_HIT_ALPHA_MAX, PLAYER_SONAR_HIT_ALPHA_MIN);
        let hitSize = map(age, 0, this.sonarDisplayTime, PLAYER_SONAR_HIT_SIZE_MAX, PLAYER_SONAR_HIT_SIZE_MIN) * hit.intensity;
        let displayX = hit.x - offsetX; let displayY = hit.y - offsetY;
        // Cull off-screen sonar pings for performance
        if (displayX < -PLAYER_SONAR_HIT_OFFSCREEN_BUFFER || displayX > width + PLAYER_SONAR_HIT_OFFSCREEN_BUFFER || displayY < -PLAYER_SONAR_HIT_OFFSCREEN_BUFFER || displayY > height + PLAYER_SONAR_HIT_OFFSCREEN_BUFFER) continue;

        if (hit.type === 'wall') fill(PLAYER_SONAR_WALL_COLOR_H, PLAYER_SONAR_WALL_COLOR_S, PLAYER_SONAR_WALL_COLOR_B, alpha * hit.intensity);
        else if (hit.type === 'enemy') { fill(PLAYER_SONAR_ENEMY_COLOR_H, PLAYER_SONAR_ENEMY_COLOR_S, PLAYER_SONAR_ENEMY_COLOR_B, alpha * hit.intensity); hitSize *= PLAYER_SONAR_ENEMY_HIT_SIZE_FACTOR; }
        noStroke(); ellipse(displayX, displayY, hitSize, hitSize);
      } else {
        this.sonarHits.splice(i, 1); // Remove old hits
      }
    }
    // Sonar Cooldown Indicator
    let sonarCycleProgress = (frameCount - this.lastSonarTime) / this.sonarCooldown;
    sonarCycleProgress = sonarCycleProgress - floor(sonarCycleProgress); // Keep it 0-1
    noFill(); strokeWeight(PLAYER_SONAR_ARC_WEIGHT); stroke(PLAYER_SONAR_ARC_COLOR_H, PLAYER_SONAR_ARC_COLOR_S, PLAYER_SONAR_ARC_COLOR_B, PLAYER_SONAR_ARC_COLOR_A);
    arc(width / 2, height / 2, this.radius * PLAYER_SONAR_ARC_RADIUS_FACTOR, this.radius * PLAYER_SONAR_ARC_RADIUS_FACTOR, -PI / 2, -PI / 2 + TWO_PI * sonarCycleProgress);

    // Shot Cooldown Indicator
    let shotCooldownProgress = min(1, (frameCount - this.lastShotTime) / this.shotCooldown);
    if (shotCooldownProgress < 1) {
      strokeWeight(PLAYER_SHOT_ARC_WEIGHT); stroke(PLAYER_SHOT_ARC_COLOR_H, PLAYER_SHOT_ARC_COLOR_S, PLAYER_SHOT_ARC_COLOR_B, PLAYER_SHOT_ARC_COLOR_A);
      arc(width / 2, height / 2, this.radius * PLAYER_SHOT_ARC_RADIUS_FACTOR, this.radius * PLAYER_SHOT_ARC_RADIUS_FACTOR, -PI / 2, -PI / 2 + TWO_PI * shotCooldownProgress);
    }
    strokeWeight(DEFAULT_STROKE_WEIGHT); // Reset stroke weight
  }
  handleEnemyCollisions(enemies) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      let d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
      if (d < this.radius * PLAYER_COLLISION_RADIUS_FACTOR + enemy.radius) { // Use consistent collision factor
        this.health -= PLAYER_ENEMY_COLLISION_DAMAGE; if (this.health < 0) this.health = 0;
        let knockbackPlayer = p5.Vector.sub(this.pos, enemy.pos).normalize().mult(PLAYER_ENEMY_COLLISION_KNOCKBACK);
        this.vel.add(knockbackPlayer);
        enemies.splice(i, 1); // Remove enemy
        playSound('explosion'); // Play explosion sound for enemy destruction
      }
    }
  }
}

// --- Enemy Class ---
class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y); this.radius = ENEMY_RADIUS;
    this.vel = p5.Vector.random2D().mult(random(ENEMY_MIN_BASE_SPEED, ENEMY_MAX_BASE_SPEED + currentLevel * ENEMY_SPEED_LEVEL_MULTIPLIER));
    this.type = 'enemy'; this.nextDecisionTime = 0; // For AI behavior
  }
  update(cave) {
    if (frameCount > this.nextDecisionTime) {
      this.vel = p5.Vector.random2D().mult(random(ENEMY_AI_NEW_VEL_MIN_SPEED_FACTOR, ENEMY_AI_NEW_VEL_MAX_SPEED_FACTOR + currentLevel * ENEMY_SPEED_LEVEL_MULTIPLIER));
      this.nextDecisionTime = frameCount + random(ENEMY_AI_DECISION_MIN_INTERVAL_FRAMES, ENEMY_AI_DECISION_MAX_INTERVAL_BASE_FRAMES - currentLevel * ENEMY_AI_DECISION_INTERVAL_LEVEL_REDUCTION_FRAMES);
    }
    let nextPos = p5.Vector.add(this.pos, this.vel);
    if (cave.isWall(nextPos.x, nextPos.y, this.radius)) {
      this.vel.mult(-1); // Reverse direction
      this.nextDecisionTime = frameCount + random(ENEMY_AI_WALL_HIT_DECISION_MIN_INTERVAL_FRAMES, ENEMY_AI_WALL_HIT_DECISION_MAX_INTERVAL_FRAMES); // Decide new path sooner
    } else {
      this.pos.add(this.vel);
    }
    // Constrain enemy to world bounds (though cave should mostly handle this)
    this.pos.x = constrain(this.pos.x, this.radius, cave.worldWidth - this.radius);
    this.pos.y = constrain(this.pos.y, this.radius, cave.worldHeight - this.radius);
  }
  // Enemy render (simple circle, can be expanded) - Rendered in main draw loop if needed, or here
  render(offsetX, offsetY) {
    // Placeholder: Enemies are currently not explicitly rendered via their own render method in the main loop.
    // Sonar picks them up. If direct visual is needed, add it here and call from draw().
    // push();
    // fill(ENEMY_COLOR_H, ENEMY_COLOR_S, ENEMY_COLOR_B);
    // noStroke();
    // ellipse(this.pos.x - offsetX, this.pos.y - offsetY, this.radius * 2);
    // pop();
  }
}

// --- Sound Setup and Functions ---
function initializeSounds() {
  sonarOsc = new p5.Oscillator('sine'); sonarEnv = new p5.Envelope();
  sonarEnv.setADSR(SONAR_ENV_ADSR.aT, SONAR_ENV_ADSR.dT, SONAR_ENV_ADSR.sR, SONAR_ENV_ADSR.rT);
  sonarEnv.setRange(SONAR_ENV_LEVELS.aL, SONAR_ENV_LEVELS.rL);
  sonarOsc.amp(sonarEnv);

  explosionNoise = new p5.Noise('white'); explosionEnv = new p5.Envelope();
  explosionEnv.setADSR(EXPLOSION_NOISE_ENV_ADSR.aT, EXPLOSION_NOISE_ENV_ADSR.dT, EXPLOSION_NOISE_ENV_ADSR.sR, EXPLOSION_NOISE_ENV_ADSR.rT);
  explosionEnv.setRange(EXPLOSION_NOISE_ENV_LEVELS.aL, EXPLOSION_NOISE_ENV_LEVELS.rL);
  explosionNoise.amp(explosionEnv);
  explosionBoomOsc = new p5.Oscillator('triangle'); explosionBoomEnv = new p5.Envelope();
  explosionBoomEnv.setADSR(EXPLOSION_BOOM_ENV_ADSR.aT, EXPLOSION_BOOM_ENV_ADSR.dT, EXPLOSION_BOOM_ENV_ADSR.sR, EXPLOSION_BOOM_ENV_ADSR.rT);
  explosionBoomEnv.setRange(EXPLOSION_BOOM_ENV_LEVELS.aL, EXPLOSION_BOOM_ENV_LEVELS.rL);
  explosionBoomOsc.amp(explosionBoomEnv);

  bumpOsc = new p5.Oscillator('triangle'); bumpEnv = new p5.Envelope();
  bumpEnv.setADSR(BUMP_ENV_ADSR.aT, BUMP_ENV_ADSR.dT, BUMP_ENV_ADSR.sR, BUMP_ENV_ADSR.rT);
  bumpEnv.setRange(BUMP_ENV_LEVELS.aL, BUMP_ENV_LEVELS.rL);
  bumpOsc.amp(bumpEnv);

  torpedoNoise = new p5.Noise('pink'); torpedoEnv = new p5.Envelope();
  torpedoEnv.setADSR(TORPEDO_ENV_ADSR.aT, TORPEDO_ENV_ADSR.dT, TORPEDO_ENV_ADSR.sR, TORPEDO_ENV_ADSR.rT);
  torpedoEnv.setRange(TORPEDO_ENV_LEVELS.aL, TORPEDO_ENV_LEVELS.rL);
  torpedoNoise.amp(torpedoEnv);

  lowAirOsc = new p5.Oscillator('square'); lowAirEnv = new p5.Envelope();
  lowAirEnv.setADSR(LOW_AIR_ENV_ADSR.aT, LOW_AIR_ENV_ADSR.dT, LOW_AIR_ENV_ADSR.sR, LOW_AIR_ENV_ADSR.rT);
  lowAirEnv.setRange(LOW_AIR_ENV_LEVELS.aL, LOW_AIR_ENV_LEVELS.rL);
  lowAirOsc.amp(lowAirEnv);

  gameOverImpactNoise = new p5.Noise('white'); gameOverImpactEnv = new p5.Envelope();
  gameOverImpactEnv.setADSR(GAME_OVER_IMPACT_ENV_ADSR.aT, GAME_OVER_IMPACT_ENV_ADSR.dT, GAME_OVER_IMPACT_ENV_ADSR.sR, GAME_OVER_IMPACT_ENV_ADSR.rT);
  gameOverImpactEnv.setRange(GAME_OVER_IMPACT_ENV_LEVELS.aL, GAME_OVER_IMPACT_ENV_LEVELS.rL);
  gameOverImpactNoise.amp(gameOverImpactEnv);

  gameOverGroanOsc = new p5.Oscillator('sawtooth'); gameOverGroanEnv = new p5.Envelope();
  gameOverGroanEnv.setADSR(GAME_OVER_GROAN_ENV_ADSR.aT, GAME_OVER_GROAN_ENV_ADSR.dT, GAME_OVER_GROAN_ENV_ADSR.sR, GAME_OVER_GROAN_ENV_ADSR.rT);
  gameOverGroanEnv.setRange(GAME_OVER_GROAN_ENV_LEVELS.aL, GAME_OVER_GROAN_ENV_LEVELS.rL);
  gameOverGroanOsc.amp(gameOverGroanEnv);

  gameOverFinalBoomNoise = new p5.Noise('brown'); gameOverFinalBoomEnv = new p5.Envelope();
  gameOverFinalBoomEnv.setADSR(GAME_OVER_FINAL_BOOM_ENV_ADSR.aT, GAME_OVER_FINAL_BOOM_ENV_ADSR.dT, GAME_OVER_FINAL_BOOM_ENV_ADSR.sR, GAME_OVER_FINAL_BOOM_ENV_ADSR.rT);
  gameOverFinalBoomEnv.setRange(GAME_OVER_FINAL_BOOM_ENV_LEVELS.aL, GAME_OVER_FINAL_BOOM_ENV_LEVELS.rL);
  gameOverFinalBoomNoise.amp(gameOverFinalBoomEnv);
}

function playSound(soundName) {
  if (!audioInitialized || (getAudioContext() && getAudioContext().state !== 'running')) return;
  try {
    if (soundName === 'sonar') {
      if (!sonarOsc.started) sonarOsc.start(); sonarOsc.freq(SONAR_FREQ); sonarEnv.play(sonarOsc);
    } else if (soundName === 'explosion') {
      if (!explosionNoise.started) explosionNoise.start(); explosionEnv.play(explosionNoise);
      if (!explosionBoomOsc.started) explosionBoomOsc.start(); explosionBoomOsc.freq(random(EXPLOSION_BOOM_MIN_FREQ, EXPLOSION_BOOM_MAX_FREQ)); explosionBoomEnv.play(explosionBoomOsc);
    } else if (soundName === 'bump') {
      if (!bumpOsc.started) bumpOsc.start(); bumpOsc.freq(BUMP_FREQ); bumpEnv.play(bumpOsc);
    } else if (soundName === 'torpedo') {
      if (!torpedoNoise.started) torpedoNoise.start(); torpedoEnv.play(torpedoNoise);
    } else if (soundName === 'lowAir') {
      if (!lowAirOsc.started) lowAirOsc.start(); lowAirOsc.freq(LOW_AIR_FREQ); lowAirEnv.play(lowAirOsc);
    } else if (soundName === 'gameOver') {
      if (!gameOverImpactNoise.started) gameOverImpactNoise.start();
      gameOverImpactEnv.play(gameOverImpactNoise);

      setTimeout(() => {
        if (!gameOverGroanOsc.started) gameOverGroanOsc.start();
        gameOverGroanOsc.freq(random(GAME_OVER_GROAN_MIN_FREQ, GAME_OVER_GROAN_MAX_FREQ));
        gameOverGroanEnv.play(gameOverGroanOsc);
        gameOverGroanOsc.freq(GAME_OVER_GROAN_PITCH_DOWN_TARGET_FREQ, GAME_OVER_GROAN_PITCH_DOWN_TIME, GAME_OVER_GROAN_PITCH_DOWN_DELAY); // Pitch down
      }, GAME_OVER_GROAN_DELAY_MS);

      setTimeout(() => {
        if (!gameOverFinalBoomNoise.started) gameOverFinalBoomNoise.start();
        gameOverFinalBoomEnv.play(gameOverFinalBoomNoise);
      }, GAME_OVER_FINAL_BOOM_DELAY_MS);
    }
  } catch (e) { /* console.error("Sound error:", soundName, e); */ }
}

// --- Main Game Functions ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255); // Max values for HSB and Alpha
  textAlign(CENTER, CENTER); textFont('monospace');
  initializeSounds(); resetGame();
}

function initGameObjects() {
  let baseAir = INITIAL_AIR_SUPPLY_BASE;
  let airForLevel = baseAir - (currentLevel - 1) * AIR_SUPPLY_LEVEL_REDUCTION;
  airForLevel = max(airForLevel, MIN_AIR_SUPPLY_PER_LEVEL); // Ensure minimum air
  let airDepletion = BASE_AIR_DEPLETION_RATE + (currentLevel - 1) * AIR_DEPLETION_LEVEL_INCREASE;
  
  let playerStartX, playerStartY;
  let attempts = 0;
  // MAX_PLAYER_SPAWN_ATTEMPTS is defined in Spawning constants
  let playerSpawnRadiusBuffer = CELL_SIZE * PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR;

  cave = new Cave(WORLD_WIDTH, WORLD_HEIGHT, CELL_SIZE); // Generate cave first

  // Find a safe starting position for the player
  do {
    playerStartX = CELL_SIZE * (PLAYER_START_X_BASE_CELLS + attempts * PLAYER_START_X_ATTEMPT_INCREMENT_CELLS); 
    playerStartY = WORLD_HEIGHT / 2 + random(-CELL_SIZE * PLAYER_START_Y_RANDOM_RANGE_CELLS, CELL_SIZE * PLAYER_START_Y_RANDOM_RANGE_CELLS);
    attempts++;
    if (playerStartX > WORLD_WIDTH * PLAYER_SPAWN_MAX_X_SEARCH_FACTOR) { // Don\'t search too far into the cave
        playerStartX = CELL_SIZE * PLAYER_START_X_BASE_CELLS; playerStartY = WORLD_HEIGHT / 2; break; // Fallback
    }
  } while (cave.isWall(playerStartX, playerStartY, playerSpawnRadiusBuffer) && attempts < MAX_PLAYER_SPAWN_ATTEMPTS);
  
  if (attempts >= MAX_PLAYER_SPAWN_ATTEMPTS) { // If still no safe spot, use a default
      playerStartX = CELL_SIZE * PLAYER_START_X_BASE_CELLS; playerStartY = WORLD_HEIGHT / 2;
  }

  player = new PlayerSub(playerStartX, playerStartY, airForLevel, airDepletion);
  
  enemies = []; projectiles = [];
  let enemyCount = BASE_ENEMY_COUNT + (currentLevel - 1) * ENEMY_COUNT_PER_LEVEL_INCREASE;
  enemyCount = min(enemyCount, MAX_ENEMY_COUNT); // Cap enemy count
  for (let i = 0; i < enemyCount; i++) {
    let enemyX, enemyY, eAttempts = 0;
    do { // Try to spawn enemy in a clear area
      enemyX = random(WORLD_WIDTH * ENEMY_SPAWN_MIN_X_WORLD_FACTOR, WORLD_WIDTH * ENEMY_SPAWN_MAX_X_WORLD_FACTOR);
      enemyY = random(WORLD_HEIGHT * ENEMY_SPAWN_MIN_Y_WORLD_FACTOR, WORLD_HEIGHT * ENEMY_SPAWN_MAX_Y_WORLD_FACTOR); eAttempts++;
    } while (cave.isWall(enemyX, enemyY, ENEMY_SPAWN_WALL_CHECK_RADIUS) && eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS);
    if (eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS) enemies.push(new Enemy(enemyX, enemyY));
  }
}

function resetGame() {
  currentLevel = 1; initGameObjects();
  player.health = PLAYER_INITIAL_HEALTH; player.airSupply = player.initialAirSupply; // Reset to full for new game
  player.lastSonarTime = frameCount - player.sonarCooldown; // Allow immediate sonar
  player.lastShotTime = frameCount - player.shotCooldown;   // Allow immediate shot
  gameState = 'start';
  if (audioInitialized && lowAirOsc && lowAirOsc.started) lowAirEnv.triggerRelease(lowAirOsc);
  lastLowAirBeepTime = 0; // Reset beep timer
}

function prepareNextLevel() {
  currentLevel++; initGameObjects(); // This will create new cave, player (with new air), enemies
  // Player position is set by initGameObjects to a safe start in the new cave
  player.vel = createVector(0,0); player.angle = 0; // Reset movement
  player.health = PLAYER_INITIAL_HEALTH; // Replenish health
  // Air supply is set by initGameObjects based on the new level
  player.lastSonarTime = frameCount - player.sonarCooldown;
  player.lastShotTime = frameCount - player.shotCooldown;
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
  // Start audio on Enter press from certain game states if not already started
  if (!audioInitialized && (keyCode === ENTER && (gameState === 'start' || gameState === 'levelComplete' || gameState === 'gameOver' || gameState === 'gameComplete'))) {
    startAudioRoutine();
  }

  if (gameState === 'playing') {
    if (keyCode === KEY_CODE_SPACE) player.shoot(); // Use constant for space key
  } else if (gameState === 'start' && keyCode === ENTER) {
    gameState = 'playing';
    player.lastSonarTime = frameCount - player.sonarCooldown; // Ensure sonar is ready
  } else if ((gameState === 'gameOver' || gameState === 'gameComplete') && keyCode === ENTER) {
    resetGame();
  } else if (gameState === 'levelComplete' && keyCode === ENTER) {
    prepareNextLevel();
  }
}

function draw() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);

  if (gameState === 'start') {
    fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B); textSize(START_SCREEN_TITLE_TEXT_SIZE);
    text(`DEEP SEA SONAR ${currentLevel > 1 ? '(Restart)': ''}`, width / 2, height / 2 + START_SCREEN_TITLE_Y_OFFSET);
    textSize(START_SCREEN_INFO_TEXT_SIZE);
    text("WASD/Arrows: Move. SPACE: Shoot.", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_1);
    text("Sonar pings automatically. Watch your Air Supply!", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_2);
    text(`Goal: Reach X > ${cave.exitX} with < ${LEVEL_EXIT_MAX_ENEMIES_THRESHOLD} enemies.`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_3);
    text(`Complete ${MAX_LEVELS} levels to win.`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_4);
    text("MOUSE CLICK for Fullscreen.", width/2, height/2 + START_SCREEN_FULLSCREEN_Y_OFFSET);
    textSize(START_SCREEN_PROMPT_TEXT_SIZE); fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    text("Press ENTER to Dive", width / 2, height / 2 + START_SCREEN_PROMPT_Y_OFFSET);
    if (!audioInitialized) {
        textSize(START_SCREEN_AUDIO_NOTE_TEXT_SIZE); fill(START_SCREEN_AUDIO_NOTE_COLOR_H, START_SCREEN_AUDIO_NOTE_COLOR_S, START_SCREEN_AUDIO_NOTE_COLOR_B);
        text("(Sound will enable after you press Enter or Click)", width/2, height/2 + START_SCREEN_AUDIO_NOTE_Y_OFFSET);
    }
    return;
  }
  if (gameState === 'levelComplete') {
    fill(LEVEL_COMPLETE_TITLE_COLOR_H, LEVEL_COMPLETE_TITLE_COLOR_S, LEVEL_COMPLETE_TITLE_COLOR_B); textSize(LEVEL_COMPLETE_TITLE_TEXT_SIZE);
    text(`LEVEL ${currentLevel -1} CLEARED!`, width / 2, height / 2 + LEVEL_COMPLETE_TITLE_Y_OFFSET); // currentLevel was already incremented
    textSize(LEVEL_COMPLETE_INFO_TEXT_SIZE);
    text(`Air Supply Replenished. Prepare for Level ${currentLevel}.`, width/2, height / 2 + LEVEL_COMPLETE_INFO_Y_OFFSET);
    text("Press ENTER to Continue", width / 2, height / 2 + LEVEL_COMPLETE_PROMPT_Y_OFFSET);
    return;
  }
  if (gameState === 'gameComplete') {
    fill(GAME_COMPLETE_TITLE_COLOR_H, GAME_COMPLETE_TITLE_COLOR_S, GAME_COMPLETE_TITLE_COLOR_B); textSize(GAME_COMPLETE_TITLE_TEXT_SIZE);
    text("MISSION ACCOMPLISHED!", width / 2, height / 2 + GAME_COMPLETE_TITLE_Y_OFFSET);
    textSize(GAME_COMPLETE_INFO_TEXT_SIZE);
    text(`You cleared all ${MAX_LEVELS} levels!`, width/2, height/2 + GAME_COMPLETE_INFO_Y_OFFSET);
    text("Press ENTER to Play Again", width / 2, height / 2 + GAME_COMPLETE_PROMPT_Y_OFFSET);
    return;
  }
  if (gameState === 'gameOver') {
    fill(GAME_OVER_TITLE_COLOR_H, GAME_OVER_TITLE_COLOR_S, GAME_OVER_TITLE_COLOR_B); textSize(GAME_OVER_TITLE_TEXT_SIZE);
    text("GAME OVER", width / 2, height / 2 + GAME_OVER_TITLE_Y_OFFSET);
    textSize(GAME_OVER_INFO_TEXT_SIZE);
    text(player.health <= 0 ? "Submarine Destroyed!" : "Air Supply Depleted!", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET);
    text("Press ENTER to Restart", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
    return;
  }

  // --- Playing State ---
  cameraOffsetX = player.pos.x - width / 2; cameraOffsetY = player.pos.y - height / 2;

  player.update(cave, enemies);
  for (let enemy of enemies) enemy.update(cave); // Enemies update themselves
  // No explicit enemy render call here, sonar handles their "visibility"
  player.handleEnemyCollisions(enemies);

  // Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update(cave); projectiles[i].render(cameraOffsetX, cameraOffsetY);
    if (projectiles[i].isOffscreen()) projectiles.splice(i, 1);
  }
  // Projectile-Enemy Collisions
  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (projectiles[i] && enemies[j]) { // Ensure both exist before checking
        let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, enemies[j].pos.x, enemies[j].pos.y);
        if (d < projectiles[i].radius + enemies[j].radius) {
          enemies.splice(j, 1); projectiles.splice(i, 1); playSound('explosion'); break; // break inner loop since projectile is gone
        }
      }
    }
  }

  player.render(cameraOffsetX, cameraOffsetY); // Player renders self and its sonar hits

  // HUD
  fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B); textSize(HUD_TEXT_SIZE); textAlign(LEFT, TOP);
  text(`Level: ${currentLevel}/${MAX_LEVELS}`, HUD_MARGIN_X, HUD_MARGIN_Y);
  text(`Health: ${player.health}`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING);
  text(`Air: ${floor(player.airSupply / AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR)}s (${floor(player.airSupply)})`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 2);
  text(`Enemies: ${enemies.length}`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 3);
  text(`Position: ${floor(player.pos.x)}, ${floor(player.pos.y)}`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 4);
  text(`Target: X > ${cave.exitX}`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 5);

  // Check Game Over / Level Complete Conditions
  if (player.health <= 0 || player.airSupply <= 0) {
      if(gameState === 'playing') { // Trigger game over sound only once on transition
          playSound('gameOver');
      }
      gameState = 'gameOver';
  } else if (player.pos.x > cave.exitX && enemies.length < LEVEL_EXIT_MAX_ENEMIES_THRESHOLD) {
    if (currentLevel >= MAX_LEVELS) {
        gameState = 'gameComplete';
    } else {
        gameState = 'levelComplete';
        // Note: prepareNextLevel() is called on ENTER press from 'levelComplete' state
    }
  }
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

