// --- Configuration Constants ---

// Game Mechanics & World
const BASE_CELL_SIZE = 20; // Base size, will increase per level
let currentCellSize = BASE_CELL_SIZE; // Variable to hold current cell size
const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 2000;
const MAX_LEVELS = 10;
const INITIAL_AIR_SUPPLY_BASE = 6000; // Base air supply in frames
const AIR_SUPPLY_LEVEL_REDUCTION = 0; // Air reduction per level
const MIN_AIR_SUPPLY_PER_LEVEL = 3000; // Minimum air supply
const BASE_AIR_DEPLETION_RATE = 1; // Base air depletion per frame
const AIR_DEPLETION_LEVEL_INCREASE = 0.1; // Additional depletion per level
const LEVEL_EXIT_MAX_ENEMIES_THRESHOLD = 0; // Max enemies to exit level

// Fullscreen on initial interaction
let initialInteractionDone = false;

// Player Constants
const PLAYER_RADIUS = 14;
const PLAYER_INITIAL_HEALTH = 100;
const PLAYER_THRUST_POWER = 0.08;
const PLAYER_REVERSE_THRUST_FACTOR = 0.6;
const PLAYER_TURN_SPEED = 0.04;
const PLAYER_DAMPING = 0.985;
const PLAYER_MAX_SPEED = 2.5;
const PLAYER_COLLISION_RADIUS_FACTOR = 0.7; // For cave collision checks
const PLAYER_BUMP_DAMAGE = 10;
const PLAYER_BUMP_RECOIL_FACTOR = 0.5;
const PLAYER_BUMP_VELOCITY_REVERSE_FACTOR = -0.5;
const PLAYER_ENEMY_COLLISION_DAMAGE = 20;
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
const PLAYER_SONAR_HIT_SIZE_MAX = 25;
const PLAYER_SONAR_HIT_SIZE_MIN = 10;
const PLAYER_SONAR_HIT_OFFSCREEN_BUFFER = 20;
const PLAYER_SONAR_ENEMY_HIT_SIZE_FACTOR = 1.3;

// Sonar Bubbles (Now Propeller Bubbles - constants might be reused or renamed)

const SONAR_BUBBLE_GROUP_SPAWN_CHANCE = 0.3; // Kept for reference, but new mechanism below
const SONAR_BUBBLE_MAX_COUNT = 5; // Kept for reference
const SONAR_BUBBLE_MAX_LIFESPAN_FRAMES = 75;
const SONAR_BUBBLE_MIN_SPEED_Y = 0.2;
const SONAR_BUBBLE_MAX_SPEED_Y = 0.5;
const SONAR_BUBBLE_MIN_SIZE = 1;
const SONAR_BUBBLE_MAX_SIZE = 2;
const SONAR_BUBBLE_COLOR_H = 180; const SONAR_BUBBLE_COLOR_S = 70; const SONAR_BUBBLE_COLOR_B = 95;
const SONAR_BUBBLE_ALPHA_MAX = 180;

// General Bubble Constants
const BUBBLE_LIFESPAN_FRAMES = 180; // 3 seconds at 60fps - for current area bubbles

// Propeller Bubble Constants
const PLAYER_PROPELLER_X_OFFSET_FACTOR = -1.2; // Offset from player center, behind the body
const PLAYER_PROPELLER_MAX_SIDE_HEIGHT_FACTOR = 0.8; // New: Max apparent height from side view (relative to player radius)
const PLAYER_PROPELLER_THICKNESS_FACTOR = 0.3;   // New: Thickness of the propeller from side view (relative to player radius)
const PLAYER_PROPELLER_SPIN_SPEED_FACTOR = 0.2; // How fast it appears to spin (adjust for visual preference)
const PROPELLER_BUBBLE_SPAWN_CHANCE_MOVING = 0.4; // Chance each frame when moving
const PROPELLER_BUBBLE_MAX_COUNT_PER_SPAWN = 1;  // Max bubbles if chance passes
const PROPELLER_BUBBLE_SPAWN_X_OFFSET_FACTOR = PLAYER_PROPELLER_X_OFFSET_FACTOR; // Spawn near propeller
const PROPELLER_BUBBLE_SPAWN_AREA_RADIUS = 8; // Small radius for spawn randomization


// Player Rendering
const PLAYER_BODY_WIDTH_FACTOR = 2.2;
const PLAYER_BODY_HEIGHT_FACTOR = 1;
const PLAYER_SAIL_OFFSET_X_FACTOR = 0.1; // Renamed from PLAYER_COCKPIT_OFFSET_X_FACTOR
const PLAYER_SAIL_WIDTH_FACTOR = 0.8;    // Renamed from PLAYER_COCKPIT_WIDTH_FACTOR
const PLAYER_SAIL_HEIGHT_FACTOR = 1.2;   // Renamed from PLAYER_COCKPIT_HEIGHT_FACTOR
const PLAYER_SAIL_CORNER_RADIUS_FACTOR = 0.2; // Renamed from PLAYER_COCKPIT_CORNER_RADIUS_FACTOR
const PLAYER_FIN_X1_FACTOR = -0.9; const PLAYER_FIN_Y1_FACTOR = -0.5;
const PLAYER_FIN_X2_FACTOR = -0.9; const PLAYER_FIN_Y2_FACTOR = 0.5;
const PLAYER_FIN_X3_FACTOR = -1.4; const PLAYER_FIN_Y3_FACTOR = 0.3;
const PLAYER_FIN_X4_FACTOR = -1.4; const PLAYER_FIN_Y4_FACTOR = -0.3;
const PLAYER_SONAR_ARC_RADIUS_FACTOR = 3.5;
const PLAYER_SHOT_ARC_RADIUS_FACTOR = 2.5;

// Projectile Constants
const PROJECTILE_SPEED = 3;
const PROJECTILE_RADIUS = 3; // This will be the base for torpedo size
const PROJECTILE_LIFESPAN_FRAMES = 100;
const PLAYER_SHOT_COOLDOWN_FRAMES = 70;
const PROJECTILE_WALL_COLLISION_RADIUS_FACTOR = 0.5; // For more accurate feel

// New Torpedo Visual Constants
const TORPEDO_BODY_LENGTH_FACTOR = 3.5; // e.g., 3.5 * PROJECTILE_RADIUS
const TORPEDO_BODY_WIDTH_FACTOR = 1;  // e.g., PROJECTILE_RADIUS
const TORPEDO_FIN_SIZE_FACTOR = 0.3;    // e.g., 1.0 * PROJECTILE_RADIUS (for small side fins)
const TORPEDO_FIN_OFFSET_FACTOR = 0.7; // How far back fins are from center
const TORPEDO_COLOR_H = 30; // Orange-ish
const TORPEDO_COLOR_S = 80;
const TORPEDO_COLOR_B = 90;
const TORPEDO_COLOR_A = 220; // Slightly more opaque

// New Torpedo Trail Particle Constants
const TORPEDO_TRAIL_PARTICLE_SPAWN_CHANCE = 0.7; // High chance per frame per torpedo
const TORPEDO_TRAIL_PARTICLE_MAX_LIFESPAN = 40; // Shorter lifespan
const TORPEDO_TRAIL_PARTICLE_MIN_SIZE = 0.5;
const TORPEDO_TRAIL_PARTICLE_MAX_SIZE = 1.5;
const TORPEDO_TRAIL_PARTICLE_SPEED_MIN = 0.1; // Slow drift
const TORPEDO_TRAIL_PARTICLE_SPEED_MAX = 0.3;
const TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE = Math.PI / 4; // Cone of spread for particles - USE Math.PI
const TORPEDO_TRAIL_OFFSET_FACTOR = -1.8; // How far behind the torpedo center particles spawn (negative of TORPEDO_BODY_LENGTH_FACTOR / 2)
const TORPEDO_TRAIL_PARTICLE_COLOR_H = 180; // Similar to sonar bubbles
const TORPEDO_TRAIL_PARTICLE_COLOR_S = 60;
const TORPEDO_TRAIL_PARTICLE_COLOR_B = 90;
const TORPEDO_TRAIL_PARTICLE_ALPHA_MAX = 150;

// New Explosion Particle Constants
const EXPLOSION_PARTICLE_COUNT_TORPEDO_WALL = 15;
const EXPLOSION_PARTICLE_COUNT_TORPEDO_ENEMY = 25;
const EXPLOSION_PARTICLE_MAX_LIFESPAN = 30; // Slightly longer than trail
const EXPLOSION_PARTICLE_MIN_SIZE = 1;
const EXPLOSION_PARTICLE_MAX_SIZE = 3;
const EXPLOSION_PARTICLE_SPEED_MIN = 0.5;
const EXPLOSION_PARTICLE_SPEED_MAX = 1.1; // Faster than trail
const EXPLOSION_PARTICLE_COLOR_H_WALL = 200; // Bluish-grey for wall impact
const EXPLOSION_PARTICLE_COLOR_S_WALL = 10;
const EXPLOSION_PARTICLE_COLOR_B_WALL = 70;
const EXPLOSION_PARTICLE_COLOR_H_ENEMY = 30; // Orange/Yellow for enemy explosion
const EXPLOSION_PARTICLE_COLOR_S_ENEMY = 90;
const EXPLOSION_PARTICLE_COLOR_B_ENEMY = 90;
const EXPLOSION_PARTICLE_ALPHA_MAX = 200;


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
const ENEMY_HOMING_START_LEVEL = 0; // New: Level at which enemies start homing
const ENEMY_HOMING_CHANCE = 0.3; // 30% chance of homing behavior

// Jellyfish Constants
const JELLYFISH_RADIUS = 40; // Larger than regular enemies
const JELLYFISH_HEALTH = 3; // Requires 3 hits
const JELLYFISH_DAMAGE = 30; // More damage than regular enemies (was 20)
const JELLYFISH_MIN_SPEED = 0.2; // Slower than regular enemies
const JELLYFISH_MAX_SPEED = 0.5;
const JELLYFISH_TENTACLE_COUNT = 8; // Number of tentacles
const JELLYFISH_TENTACLE_LENGTH = 40; // Length of tentacles
const JELLYFISH_BODY_COLOR_H = 280; // Purple/magenta hue
const JELLYFISH_BODY_COLOR_S = 80;
const JELLYFISH_BODY_COLOR_B = 70;
const JELLYFISH_TENTACLE_COLOR_H = 290;
const JELLYFISH_TENTACLE_COLOR_S = 60;
const JELLYFISH_TENTACLE_COLOR_B = 50;

// Cave Generation
const CAVE_EXIT_X_OFFSET_CELLS = 10; // How many cells from the right edge the exit starts
const GOAL_SQUARE_SIZE_CELLS = 3; // Size of the goal square in terms of cells
const GOAL_SQUARE_VISUAL_COLOR_H = 60; // Yellow for drawing the goal
const GOAL_SQUARE_VISUAL_COLOR_S = 100;
const GOAL_SQUARE_VISUAL_COLOR_B = 100;
const PLAYER_SONAR_GOAL_HIT_COLOR_H = 55; // Distinct Yellow/Gold for sonar hit on goal
const PLAYER_SONAR_GOAL_HIT_COLOR_S = 100;
const PLAYER_SONAR_GOAL_HIT_COLOR_B = 100;
const PLAYER_SONAR_GOAL_HIT_INTENSITY_MAX = 1.2; // Slightly brighter sonar hit for goal
const PLAYER_SONAR_GOAL_HIT_INTENSITY_MIN = 0.5;

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

// Current Area Constants
const CURRENT_AREAS_PER_LEVEL = 3;
const CURRENT_AREA_MIN_WIDTH = 80;
const CURRENT_AREA_MAX_WIDTH = 200;
const CURRENT_AREA_MIN_HEIGHT = 60;
const CURRENT_AREA_MAX_HEIGHT = 150;
const CURRENT_FORCE_MAGNITUDE_MIN = 0.1;
const CURRENT_FORCE_MAGNITUDE_MAX = 0.5;
const CURRENT_BUBBLE_SPAWN_DENSITY = 0.00002; // Reduced from 0.002 for better performance
const CURRENT_BUBBLE_SPEED_MULTIPLIER = 0.8;
const CURRENT_BUBBLE_LIFESPAN_FACTOR = 1.5;
const CURRENT_AREA_PADDING_FROM_PLAYER_START = 100;
const CURRENT_AREA_PADDING_FROM_GOAL = 80;

// Spawning
const MAX_PLAYER_SPAWN_ATTEMPTS = 50;
const PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR = 1.5; // Multiplier of CELL_SIZE
const PLAYER_START_X_BASE_CELLS = 5;
const PLAYER_START_X_ATTEMPT_INCREMENT_CELLS = 0.2;
const PLAYER_START_Y_RANDOM_RANGE_CELLS = 4; // +/- from center
const PLAYER_SPAWN_MAX_X_SEARCH_FACTOR = 1/5; // Max distance to search for player spawn (world width factor)

const BASE_ENEMY_COUNT = 7; // Initial number of enemies at level 1
const ENEMY_COUNT_PER_LEVEL_INCREASE = 5; // How many more enemies per level
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

// Shorter, snappier explosion (reduced decay times)
const EXPLOSION_NOISE_ENV_ADSR = { aT: 0.001, dT: 0.6, sR: 0, rT: 0.4 };
const EXPLOSION_NOISE_ENV_LEVELS = { aL: 0.9, rL: 0 };
const EXPLOSION_BOOM_ENV_ADSR = { aT: 0.001, dT: 1.5, sR: 0, rT: 0.5 };
const EXPLOSION_BOOM_ENV_LEVELS = { aL: 0.8, rL: 0 };
const EXPLOSION_BOOM_MIN_FREQ = 40;
const EXPLOSION_BOOM_MAX_FREQ = 80;
const EXPLOSION_BASS_ENV_ADSR = { aT: 0.002, dT: 1.0, sR: 0, rT: 0.8 };
const EXPLOSION_BASS_ENV_LEVELS = { aL: 1.0, rL: 0 };
const EXPLOSION_BASS_MIN_FREQ = 15;
const EXPLOSION_BASS_MAX_FREQ = 30;

const BUMP_ENV_ADSR = { aT: 0.005, dT: 0.15, sR: 0, rT: 0.1 };
const BUMP_ENV_LEVELS = { aL: 0.4, rL: 0 };
const BUMP_FREQ = 100;

const TORPEDO_ENV_ADSR = { aT: 0.02, dT: 0.3, sR: 0, rT: 0.2 };
const TORPEDO_ENV_LEVELS = { aL: 0.3, rL: 0 };

// Current Flow Sound Constants
const CURRENT_FLOW_NOISE_ENV_ADSR = { aT: 0.2, dT: 0.4, sR: 0.7, rT: 0.6 };
const CURRENT_FLOW_NOISE_ENV_LEVELS = { aL: 0.25, rL: 0 };
const CURRENT_FLOW_BASS_ENV_ADSR = { aT: 0.15, dT: 0.3, sR: 0.6, rT: 0.5 };
const CURRENT_FLOW_BASS_ENV_LEVELS = { aL: 0.35, rL: 0 };
const CURRENT_FLOW_BASS_MIN_FREQ = 30;
const CURRENT_FLOW_BASS_MAX_FREQ = 60;

// Creature Growl/Scream Constants
const CREATURE_GROWL_ENV_ADSR = { aT: 0.05, dT: 0.2, sR: 0.3, rT: 0.4 };
const CREATURE_GROWL_ENV_LEVELS = { aL: 0.25, rL: 0 };
const CREATURE_GROWL_MIN_FREQ = 80;
const CREATURE_GROWL_MAX_FREQ = 85;

// Reactor Hum Constants
const REACTOR_HUM_ENV_ADSR = { aT: 0.1, dT: 0.1, sR: 1.0, rT: 0.1 }; // Quick attack, sustain continuously
const REACTOR_HUM_ENV_LEVELS = { aL: 0.15, rL: 0 };
const REACTOR_HUM_FREQ = 35; // Lower frequency hum (was 60)
const REACTOR_HUM_MAX_DISTANCE = 2500; // Max distance where hum is audible

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
const GAME_OVER_FINAL_BOOM_DELAY_MS = 2000;

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
const PLAYER_SONAR_JELLYFISH_COLOR_H = 280; const PLAYER_SONAR_JELLYFISH_COLOR_S = 80; const PLAYER_SONAR_JELLYFISH_COLOR_B = 80; // Purple for jellyfish
const PLAYER_SONAR_GOAL_COLOR_H = 60; const PLAYER_SONAR_GOAL_COLOR_S = 100; const PLAYER_SONAR_GOAL_COLOR_B = 100; // Yellow for goal
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
const START_SCREEN_TITLE_TEXT_SIZE = 60;
const START_SCREEN_TITLE_Y_OFFSET = -180; // Title at top
const START_SCREEN_INFO_TEXT_SIZE = 20;
const START_SCREEN_INFO_Y_OFFSET_1 = -60; // Game objective
const START_SCREEN_INFO_Y_OFFSET_2 = -30; // Controls
const START_SCREEN_INFO_Y_OFFSET_3 = -90; // Credit
const START_SCREEN_INFO_Y_OFFSET_4 = 10; // Not used
const START_SCREEN_FULLSCREEN_Y_OFFSET = 40;
const START_SCREEN_PROMPT_TEXT_SIZE = 28;
const START_SCREEN_PROMPT_COLOR_H = 120; const START_SCREEN_PROMPT_COLOR_S = 100; const START_SCREEN_PROMPT_COLOR_B = 100;
const START_SCREEN_PROMPT_Y_OFFSET = 80; // Enter prompt
const START_SCREEN_AUDIO_NOTE_TEXT_SIZE = 16;
const START_SCREEN_AUDIO_NOTE_COLOR_H = 200; const START_SCREEN_AUDIO_NOTE_COLOR_S = 80; const START_SCREEN_AUDIO_NOTE_COLOR_B = 80;
const START_SCREEN_AUDIO_NOTE_Y_OFFSET = 110;

const LEVEL_COMPLETE_TITLE_COLOR_H = 100; const LEVEL_COMPLETE_TITLE_COLOR_S = 100; const LEVEL_COMPLETE_TITLE_COLOR_B = 100;
const LEVEL_COMPLETE_TITLE_TEXT_SIZE = 48;
const LEVEL_COMPLETE_TITLE_Y_OFFSET = -80; // Title higher up
const LEVEL_COMPLETE_INFO_TEXT_SIZE = 24;
const LEVEL_COMPLETE_INFO_Y_OFFSET = -20; // Score info area
const LEVEL_COMPLETE_PROMPT_Y_OFFSET = 80; // Enter prompt lower

const GAME_COMPLETE_TITLE_COLOR_H = 120; const GAME_COMPLETE_TITLE_COLOR_S = 100; const GAME_COMPLETE_TITLE_COLOR_B = 100;
const GAME_COMPLETE_TITLE_TEXT_SIZE = 60;
const GAME_COMPLETE_TITLE_Y_OFFSET = -80; // Title higher up
const GAME_COMPLETE_INFO_TEXT_SIZE = 24;
const GAME_COMPLETE_INFO_Y_OFFSET = -20; // Info area
const GAME_COMPLETE_PROMPT_Y_OFFSET = 80; // Enter prompt lower

const GAME_OVER_TITLE_COLOR_H = 0; const GAME_OVER_TITLE_COLOR_S = 80; const GAME_OVER_TITLE_COLOR_B = 70;
const GAME_OVER_TITLE_TEXT_SIZE = 60;
const GAME_OVER_TITLE_Y_OFFSET = -80; // Title higher up
const GAME_OVER_INFO_TEXT_SIZE = 24;
const GAME_OVER_INFO_Y_OFFSET = -20; // Info area
const GAME_OVER_PROMPT_Y_OFFSET = 80; // Enter prompt lower

// Key Codes
const KEY_CODE_SPACE = 32;
const KEY_CODE_W = 87;
const KEY_CODE_S = 83;
const KEY_CODE_A = 65;
const KEY_CODE_D = 68;
// Note: ENTER key is already a p5.js constant, no need to redefine.

// Sound objects
let audioInitialized = false;
let lastLowAirBeepTime = 0;
var sonarOsc, sonarEnv;
var explosionNoise, explosionEnv, explosionBoomOsc, explosionBoomEnv, explosionBassOsc, explosionBassEnv; // Wall Explosion
var creatureExplosionNoise, creatureExplosionEnv, creatureExplosionBoomOsc, creatureExplosionBoomEnv, creatureExplosionBassOsc, creatureExplosionBassEnv; // Creature Explosion
var bumpOsc, bumpEnv;
var torpedoNoise, torpedoEnv; // Changed from Osc to Noise for woosh
var lowAirOsc, lowAirEnv;
var gameOverImpactNoise, gameOverImpactEnv, gameOverGroanOsc, gameOverGroanEnv, gameOverFinalBoomNoise, gameOverFinalBoomEnv; // Sub Destruction

// Current Flow Audio
var currentFlowNoise, currentFlowNoiseEnv, currentFlowBassOsc, currentFlowBassEnv;

// Reactor Hum Audio
let reactorHumOsc, reactorHumEnv;
let reactorHumAmplitude = 0;

// Creature Growl Audio
let creatureGrowlOsc, creatureGrowlEnv;

// Game Variables
let player;
let cave;
let enemies = [];
let jellyfish = []; // Array for jellyfish creatures
let projectiles = [];
let sonarBubbles = [];
let particles = []; // New global array for torpedo trail particles
let currentAreas = []; // Array for underwater current areas
let cameraOffsetX, cameraOffsetY;
let gameState = 'start';
let currentLevel = 1;
let enemiesKilledThisLevel = 0; // New variable to track enemies killed this level
let caveGenerationProgress = 0; // Progress of cave generation (0-1)
let loadingStartTime = 0; // Time when loading started (for smooth animation)
let startScreenPropellerAngle = 0; // Animation variable for start screen submarine propeller
let totalScore = 0; // Total accumulated score across all completed levels
let levelScore = 0; // Score for the current level
let debugShowWalls = false; // Debug mode to show all cave walls

// --- JSONBin HighScore Manager ---
class JSONBinHighScores {
  constructor() {
    this.apiKey = '$2a$10$7wznneBgwFUQbnCsNIQ.eO/O9UBheBQomVH6oNlSv7voOtxDaawFW';
    this.binId = null;
    this.baseUrl = 'https://api.jsonbin.io/v3/b';
    this.binName = 'SUBMARINE';
  }

  async initializeBin() {
    try {
      const existingBin = await this.findExistingBin();
      if (existingBin) {
        this.binId = existingBin;
        console.log('Found existing SUBMARINE highscore bin:', this.binId);
        return true;
      }

      const response = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.apiKey,
          'X-Bin-Name': this.binName
        },
        body: JSON.stringify({
          scores: [],
          gameInfo: {
            name: 'Submarine Cave Explorer',
            created: new Date().toISOString(),
            version: '1.0',
            description: 'High scores for the submarine cave exploration game'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.binId = data.metadata.id;
        console.log('Created new SUBMARINE highscore bin:', this.binId);
        localStorage.setItem('submarine-highscore-bin-id', this.binId);
        return true;
      } else {
        console.error('Failed to create bin:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error initializing bin:', error);
      return false;
    }
  }

  async findExistingBin() {
    const savedBinId = localStorage.getItem('submarine-highscore-bin-id');
    if (savedBinId) {
      try {
        const response = await fetch(`${this.baseUrl}/${savedBinId}`, {
          headers: { 'X-Master-Key': this.apiKey }
        });
        if (response.ok) {
          return savedBinId;
        }
      } catch (error) {
        localStorage.removeItem('submarine-highscore-bin-id');
      }
    }
    return null;
  }

  async getHighScores() {
    if (!this.binId) {
      const initialized = await this.initializeBin();
      if (!initialized) return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
        headers: { 'X-Master-Key': this.apiKey }
      });

      if (response.ok) {
        const data = await response.json();
        const scores = data.record.scores || [];
        return scores.sort((a, b) => b.score - a.score).slice(0, 10);
      }
      return [];
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  }

  async submitScore(playerName, score) {
    if (!this.binId) {
      const initialized = await this.initializeBin();
      if (!initialized) return false;
    }

    try {
      const currentData = await this.getCurrentBinData();
      if (!currentData) return false;

      const newScore = {
        name: playerName.substring(0, 20),
        score: score,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        gameVersion: '1.0'
      };

      if (!currentData.scores) currentData.scores = [];
      currentData.scores.push(newScore);
      currentData.scores = currentData.scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

      const response = await fetch(`${this.baseUrl}/${this.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.apiKey
        },
        body: JSON.stringify(currentData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error submitting score:', error);
      return false;
    }
  }

  async getCurrentBinData() {
    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
        headers: { 'X-Master-Key': this.apiKey }
      });
      return response.ok ? (await response.json()).record : null;
    } catch (error) {
      return null;
    }
  }

  async isHighScore(score) {
    const scores = await this.getHighScores();
    return scores.length < 10 || score > (scores[scores.length - 1]?.score || 0);
  }
}

// Initialize the highscore manager
const highScoreManager = new JSONBinHighScores();

// Helper function to process game object arrays (update, render, remove offscreen)
function processGameObjectArray(arr, offsetX, offsetY, caveContext = null) {
  let margin = 50; // Margin for objects slightly off-screen
  
  for (let i = arr.length - 1; i >= 0; i--) {
    let obj = arr[i];
    
    // Always update object logic
    if (obj.update) {
        if (caveContext && obj instanceof Projectile) {
            obj.update(caveContext);
        } else {
            obj.update(); 
        }
    }
    
    // Only render if object is near the viewport
    if (obj.render && obj.pos) {
      let objRadius = obj.radius || obj.size || 10; // Default radius if not specified
      
      if (obj.pos.x + objRadius >= offsetX - margin &&
          obj.pos.x - objRadius <= offsetX + width + margin &&
          obj.pos.y + objRadius >= offsetY - margin &&
          obj.pos.y - objRadius <= offsetY + height + margin) {
        obj.render(offsetX, offsetY);
      }
    } else if (obj.render) {
      // Fallback for objects without position (render anyway)
      obj.render(offsetX, offsetY);
    }
    
    // Remove dead objects
    if (obj.isOffscreen && obj.isOffscreen()) {
      arr.splice(i, 1);
    }
  }
}

// --- Projectile Class ---
class Projectile {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle).mult(PROJECTILE_SPEED);
    this.radius = PROJECTILE_RADIUS; // Base size for torpedo
    this.life = PROJECTILE_LIFESPAN_FRAMES;
    this.angle = angle; // Store the angle for rendering and trail
  }
  update(cave) {
    this.pos.add(this.vel); this.life--;

    // Spawn trail particles
    if (random() < TORPEDO_TRAIL_PARTICLE_SPAWN_CHANCE) {
        let particleAngleOffset = random(-TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE / 2, TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE / 2);
        let particleBaseAngle = this.angle + Math.PI; // Particles move away from torpedo\'s rear
        let finalParticleAngle = particleBaseAngle + particleAngleOffset;
        let particleSpeed = random(TORPEDO_TRAIL_PARTICLE_SPEED_MIN, TORPEDO_TRAIL_PARTICLE_SPEED_MAX);
        
        // Spawn particles from the rear of the torpedo
        let trailSpawnX = this.pos.x + cos(this.angle) * (this.radius * TORPEDO_TRAIL_OFFSET_FACTOR);
        let trailSpawnY = this.pos.y + sin(this.angle) * (this.radius * TORPEDO_TRAIL_OFFSET_FACTOR);

        let particleVel = p5.Vector.fromAngle(finalParticleAngle, particleSpeed); // More concise

        particles.push(new Particle(
            trailSpawnX,
            trailSpawnY,
            particleVel.x, // Use components of the vector
            particleVel.y,
            TORPEDO_TRAIL_PARTICLE_MAX_LIFESPAN,
            TORPEDO_TRAIL_PARTICLE_MIN_SIZE,
            TORPEDO_TRAIL_PARTICLE_MAX_SIZE,
            TORPEDO_TRAIL_PARTICLE_COLOR_H,
            TORPEDO_TRAIL_PARTICLE_COLOR_S,
            TORPEDO_TRAIL_PARTICLE_COLOR_B,
            TORPEDO_TRAIL_PARTICLE_ALPHA_MAX
        ));
    }

    // Check collision with a smaller radius for projectiles to feel more accurate
    if (cave.isWall(this.pos.x, this.pos.y, this.radius * PROJECTILE_WALL_COLLISION_RADIUS_FACTOR)) {
        this.life = 0;
        
        // Destroy cave blocks around the impact point
        cave.destroyBlocks(this.pos.x, this.pos.y, 25); // 25 pixel radius destruction
        
        createExplosion(this.pos.x, this.pos.y, 'wall');
        playSound('explosion'); // Play explosion sound for wall hit
    }
  }
  render(offsetX, offsetY) {
    push();
    translate(this.pos.x - offsetX, this.pos.y - offsetY);
    rotate(this.angle); // Rotate by the stored angle

    rectMode(CENTER);
    fill(TORPEDO_COLOR_H, TORPEDO_COLOR_S, TORPEDO_COLOR_B, TORPEDO_COLOR_A);
    noStroke();

    let bodyLen = this.radius * TORPEDO_BODY_LENGTH_FACTOR;
    let bodyWid = this.radius * TORPEDO_BODY_WIDTH_FACTOR;

    // Body
    rect(0, 0, bodyLen, bodyWid);

    // Fins
    // TORPEDO_FIN_SIZE_FACTOR determines the fin's dimension extending outwards from the body.
    // TORPEDO_FIN_OFFSET_FACTOR determines how far back from the torpedo's center the fin's center is.
    let finOutwardSize = this.radius * TORPEDO_FIN_SIZE_FACTOR;
    let finBodyLength = bodyLen * 0.35; // Fin length along the torpedo's body (e.g., 35% of body length)
    let finCenterX = -this.radius * TORPEDO_FIN_OFFSET_FACTOR; // Negative to place it towards the rear

    // Top Fin: Extends upwards from the body
    // rect(x_center_of_fin, y_center_of_fin, fin_length_along_torpedo, fin_width_extending_outward)
    rect(finCenterX, -bodyWid / 2 - finOutwardSize / 2, finBodyLength, finOutwardSize);

    // Bottom Fin: Extends downwards from the body
    rect(finCenterX,  bodyWid / 2 + finOutwardSize / 2, finBodyLength, finOutwardSize);
    
    rectMode(CORNER); // Reset rectMode
    pop();
  }
  isOffscreen() { return this.life <= 0; }
}

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

// --- Cave Class ---
class Cave {
  constructor(worldWidth, worldHeight, cellSize) { // Accept cellSize as a parameter
    // Reset progress at start of cave creation
    caveGenerationProgress = 0;
    
    // Validate constructor parameters
    if (isNaN(worldWidth) || worldWidth <= 0) worldWidth = 4000;
    if (isNaN(worldHeight) || worldHeight <= 0) worldHeight = 2000;
    if (isNaN(cellSize) || cellSize <= 0) cellSize = 20;
    
    this.worldWidth = worldWidth; this.worldHeight = worldHeight; this.cellSize = cellSize; // Use passed cellSize
    this.gridWidth = Math.ceil(worldWidth / this.cellSize); // Use this.cellSize
    this.gridHeight = Math.ceil(worldHeight / this.cellSize); // Use this.cellSize
    this.grid = []; this.exitPathY = 0; this.exitPathRadius = 0;
    this.goalPos = createVector(0,0);
    this.goalSize = GOAL_SQUARE_SIZE_CELLS * this.cellSize; // Use this.cellSize
    
    // Initialize exitX before cave generation (needed for validation)
    this.exitX = worldWidth - this.cellSize * CAVE_EXIT_X_OFFSET_CELLS; // Use this.cellSize
  }

  generateMainPath() {
    this.mainPath = [];
    noiseSeed(random(1000));
    let y = this.gridHeight / 2;
    let radius = random(CAVE_PATH_MIN_RADIUS_CELLS, CAVE_PATH_MAX_RADIUS_CELLS);

    for (let x = 0; x < this.gridWidth; x++) {
      let yNoise = noise(x * CAVE_PATH_Y_NOISE_FACTOR_1, currentLevel + CAVE_PATH_Y_NOISE_OFFSET_1);
      y += (yNoise - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
      y = constrain(y, radius, this.gridHeight - radius);

      let rNoise = noise(x * CAVE_PATH_RADIUS_NOISE_FACTOR, currentLevel + CAVE_PATH_RADIUS_NOISE_OFFSET);
      radius = map(rNoise, 0, 1, CAVE_PATH_MIN_RADIUS_CELLS, CAVE_PATH_MAX_RADIUS_CELLS);

      this.mainPath.push({ x: x, y: y, radius: radius });

      if (x * this.cellSize >= this.exitX && this.exitPathY === 0) {
        this.exitPathY = y;
        this.exitPathRadius = radius;
      }
    }
  }

  generateObstacles() {
    noiseSeed(random(1000));
    for (let y = 0; y < this.gridHeight; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        let isPath = false;
        for (let seg of this.mainPath) {
          if (dist(x, y, seg.x, seg.y) < seg.radius) {
            isPath = true;
            break;
          }
        }

        if (isPath) {
          this.grid[y][x] = 0;
        } else {
          let noiseVal = noise(x * CAVE_OBSTACLE_NOISE_FACTOR_1, y * CAVE_OBSTACLE_NOISE_FACTOR_1, currentLevel + CAVE_OBSTACLE_NOISE_OFFSET_1);
          let distToPath = 1000;
          for (let seg of this.mainPath) {
            distToPath = min(distToPath, dist(x, y, seg.x, seg.y));
          }

          if (noiseVal > CAVE_OBSTACLE_THRESHOLD_1 && distToPath > CAVE_OBSTACLE_DIST_BUFFER_1) {
            this.grid[y][x] = 1;
          } else {
            this.grid[y][x] = 0;
          }
        }
      }
    }
  }

  finalizeCave() {
    this.goalPos.x = this.exitX + this.goalSize / 2;
    if (isNaN(this.exitPathY) || this.exitPathY === undefined || this.exitPathY === null || this.exitPathY === 0) {
      this.exitPathY = this.gridHeight / 2;
    }
    this.goalPos.y = this.exitPathY * this.cellSize;
  }
  
  // Method to find all spaces of a certain type (0 for empty, 1 for wall)
  findAllSpaces(type = 0) {
    const spaces = [];
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.grid[y] && this.grid[y][x] === type) {
          spaces.push({ x, y });
        }
      }
    }
    return spaces;
  }

  // Flood fill to identify a single connected region
  floodFill(x, y, type, visited) {
    const region = [];
    const stack = [{ x, y }];
    const key = `${x},${y}`;
    if (visited.has(key)) return region;
    visited.add(key);

    while (stack.length > 0) {
      const current = stack.pop();
      region.push(current);

      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];

      for (const n of neighbors) {
        const nKey = `${n.x},${n.y}`;
        if (
          n.x >= 0 && n.x < this.gridWidth &&
          n.y >= 0 && n.y < this.gridHeight &&
          this.grid[n.y] && this.grid[n.y][n.x] === type &&
          !visited.has(nKey)
        ) {
          visited.add(nKey);
          stack.push(n);
        }
      }
    }
    return region;
  }

  // Connects all significant empty spaces to ensure a navigable cave
  connectAllSignificantSpaces(minSize = 20) {
    const allSpaces = this.findAllSpaces(0);
    if (allSpaces.length === 0) return;

    const visited = new Set();
    const regions = [];

    for (const space of allSpaces) {
      const key = `${space.x},${space.y}`;
      if (!visited.has(key)) {
        const region = this.floodFill(space.x, space.y, 0, visited);
        if (region.length >= minSize) {
          regions.push(region);
        }
      }
    }

    if (regions.length <= 1) return;

    // Connect the largest region to all other significant regions
    regions.sort((a, b) => b.length - a.length);
    const mainRegion = regions[0];

    for (let i = 1; i < regions.length; i++) {
      const otherRegion = regions[i];
      let closestDist = Infinity;
      let mainPoint = null;
      let otherPoint = null;

      // A performance optimization: only check a subset of points
      const sampleRate = 0.2; // Check 20% of points
      const mainSample = mainRegion.filter(() => random() < sampleRate);
      const otherSample = otherRegion.filter(() => random() < sampleRate);
      
      // Ensure samples are not empty
      if (mainSample.length === 0 && mainRegion.length > 0) mainSample.push(mainRegion[0]);
      if (otherSample.length === 0 && otherRegion.length > 0) otherSample.push(otherRegion[0]);
      
      if(mainSample.length === 0 || otherSample.length === 0) continue;

      for (const p1 of mainSample) {
        for (const p2 of otherSample) {
          const d = dist(p1.x, p1.y, p2.x, p2.y);
          if (d < closestDist) {
            closestDist = d;
            mainPoint = p1;
            otherPoint = p2;
          }
        }
      }

      if (mainPoint && otherPoint) {
        this.createTunnel(mainPoint, otherPoint, 2); // Tunnel with radius 2 cells
      }
    }
  }

  // Creates a tunnel between two points
  createTunnel(p1, p2, radius) {
    let x1 = p1.x, y1 = p1.y;
    let x2 = p2.x, y2 = p2.y;
    let dx = x2 - x1;
    let dy = y2 - y1;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let steps = distance; // 1-cell steps

    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      let x = Math.round(x1 + t * dx);
      let y = Math.round(y1 + t * dy);

      for (let rx = -radius; rx <= radius; rx++) {
        for (let ry = -radius; ry <= radius; ry++) {
          if (rx * rx + ry * ry <= radius * radius) {
            let nx = x + rx;
            let ny = y + ry;
            if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
              if (this.grid[ny]) {
                this.grid[ny][nx] = 0; // Carve tunnel
              }
            }
          }
        }
      }
    }
  }

  // Ensures the main path is clear after obstacle generation
  ensureMainPathClearance(path) {
    if (!path) return;
    for (const seg of path) {
      let gridX = Math.floor(seg.x);
      let gridY = Math.floor(seg.y);
      let radius = Math.ceil(seg.radius);
      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          if (dist(0, 0, i, j) < radius) {
            let nx = gridX + i;
            let ny = gridY + j;
            if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
               if (this.grid[ny]) {
                this.grid[ny][nx] = 0;
              }
            }
          }
        }
      }
    }
  }

  isWall(px, py, checkRadius = 0) {
    // ...existing code...

