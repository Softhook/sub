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

// --- Creature Explosion Sound Constants (less boomy than wall explosions) ---
const CREATURE_EXPLOSION_NOISE_ENV_ADSR = { aT: 0.001, dT: 0.3, sR: 0, rT: 0.1 };
const CREATURE_EXPLOSION_NOISE_ENV_LEVELS = { aL: 0.6, rL: 0 };
const CREATURE_EXPLOSION_BOOM_ENV_ADSR = { aT: 0.001, dT: 0.8, sR: 0, rT: 0.1 };
const CREATURE_EXPLOSION_BOOM_ENV_LEVELS = { aL: 0.5, rL: 0 };
const CREATURE_EXPLOSION_BOOM_MIN_FREQ = 100;
const CREATURE_EXPLOSION_BOOM_MAX_FREQ = 120;
const CREATURE_EXPLOSION_BASS_ENV_ADSR = { aT: 0.002, dT: 0.6, sR: 0, rT: 0.4 };
const CREATURE_EXPLOSION_BASS_ENV_LEVELS = { aL: 0.7, rL: 0 };
const CREATURE_EXPLOSION_BASS_MIN_FREQ = 25;
const CREATURE_EXPLOSION_BASS_MAX_FREQ = 45;

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
  constructor(worldWidth, worldHeight, cellSize, autoGenerate = true) { // Accept cellSize as a parameter
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
    
    if (autoGenerate) {
      this.generateCave();
      this.goalPos.x = this.exitX + this.goalSize / 2;
      
      // Ensure exitPathY is valid before setting goal position
      if (isNaN(this.exitPathY) || this.exitPathY === undefined || this.exitPathY === null) {
        this.exitPathY = this.gridHeight / 2;
        console.warn("exitPathY was invalid after cave generation, using grid center");
      }
      this.goalPos.y = this.exitPathY * this.cellSize; // Use this.cellSize
    }
  }
  generateCave() {
    // Reset progress at start
    caveGenerationProgress = 0;
    
    for (let i = 0; i < this.gridWidth; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridHeight; j++) this.grid[i][j] = false; // Initialize as open space
    }
    let pathY = this.gridHeight / 2; let currentPathRadius = 0;
    let pathMinRadius = CAVE_PATH_MIN_RADIUS_CELLS; let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    
    // Store the main path for later validation
    let mainPath = [];
    
    noiseSeed(millis() + currentLevel * 1000); // Seed for consistent cave per level, varied by run
    
    // Phase 1: Generate main path (30% of progress)
    for (let i = 0; i < this.gridWidth; i++) {
      pathY += (noise(i * CAVE_PATH_Y_NOISE_FACTOR_1, CAVE_PATH_Y_NOISE_OFFSET_1 + currentLevel) - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
      pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1); // Keep path within bounds
      currentPathRadius = map(noise(i * CAVE_PATH_RADIUS_NOISE_FACTOR, CAVE_PATH_RADIUS_NOISE_OFFSET + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
      
      // Store main path data for validation
      mainPath.push({x: i, y: pathY, radius: currentPathRadius});
      
      for (let j = 0; j < this.gridHeight; j++) {
        if (abs(j - pathY) > currentPathRadius) this.grid[i][j] = true; // Mark as wall
      }
      if (i === this.gridWidth - 1) { this.exitPathY = pathY; this.exitPathRadius = currentPathRadius; } // Store exit path details
    }
    caveGenerationProgress = 0.3; // Main path complete
    
    // Phase 2: Add obstacles and clearings (40% of progress)
    for (let i = 1; i < this.gridWidth - 1; i++) {
      for (let j = 1; j < this.gridHeight - 1; j++) {
        if (!this.grid[i][j]) { // If it's currently open path
          // Only add obstacles if they don't block the guaranteed main path
          let pathPoint = mainPath[i];
          let minClearanceFromPath = (PLAYER_RADIUS / this.cellSize) + 1; // Ensure submarine can pass
          
          if (noise(i * CAVE_OBSTACLE_NOISE_FACTOR_1, j * CAVE_OBSTACLE_NOISE_FACTOR_1, CAVE_OBSTACLE_NOISE_OFFSET_1 + currentLevel) > CAVE_OBSTACLE_THRESHOLD_1 && 
              abs(j - pathPoint.y) > pathPoint.radius + CAVE_OBSTACLE_DIST_BUFFER_1 &&
              abs(j - pathPoint.y) > minClearanceFromPath) {
            this.grid[i][j] = true; // Add an obstacle
          }
        } else { // If it's currently a wall
          if (noise(i * CAVE_CLEARING_NOISE_FACTOR, j * CAVE_CLEARING_NOISE_FACTOR, CAVE_CLEARING_NOISE_OFFSET + currentLevel) < CAVE_CLEARING_THRESHOLD) {
            this.grid[i][j] = false; // Carve a clearing
          }
        }
      }
    }
    caveGenerationProgress = 0.7; // Obstacles complete
    
    // Phase 3: Ensure main path clearance (20% of progress)
    caveGenerationProgress = 0.7;
    this.ensureMainPathClearance(mainPath);
    
    // Phase 4: Connect significant spaces (10% of progress)
    caveGenerationProgress = 0.8;
    this.connectAllSignificantSpaces();
    
    // Phase 5: Final border setup and goal area (10% of progress)
    caveGenerationProgress = 0.9;
    for (let i = 0; i < this.gridWidth; i++) { this.grid[i][0] = true; this.grid[i][this.gridHeight - 1] = true; }
    for (let j = 0; j < this.gridHeight; j++) this.grid[0][j] = true;
    for (let j = 0; j < this.gridHeight; j++) {
      // Ensure exitPathY is valid before using it
      if (isNaN(this.exitPathY) || this.exitPathY === undefined || this.exitPathY === null) {
        this.exitPathY = this.gridHeight / 2;
        this.exitPathRadius = Math.max(CAVE_PATH_MIN_RADIUS_CELLS, 3);
        console.warn("exitPathY was invalid during border generation, using defaults");
      }
      if (abs(j - this.exitPathY) > this.exitPathRadius) this.grid[this.gridWidth - 1][j] = true;
      else this.grid[this.gridWidth - 1][j] = false;
    }
    
    // Validate path connectivity and regenerate if needed (max 3 attempts)
    let attempts = 0;
    while (!this.validatePathConnectivity() && attempts < 3) {
      console.log("Path validation failed, regenerating cave...");
      attempts++;
      // Clear and regenerate with slightly different parameters
      this.ensureMainPathClearance(mainPath);
      // Reduce obstacle threshold to make more open space
      for (let i = 1; i < this.gridWidth - 1; i++) {
        for (let j = 1; j < this.gridHeight - 1; j++) {
          if (this.grid[i][j] && !this.grid[0][j] && !this.grid[this.gridWidth-1][j] && j !== 0 && j !== this.gridHeight-1) {
            // Clear some walls to improve connectivity
            if (noise(i * 0.2, j * 0.2, attempts * 100) > 0.6) {
              this.grid[i][j] = false;
            }
          }
        }
      }
      this.ensureMainPathClearance(mainPath);
    }
    // Ensure the goal area itself is not a wall in the grid, if it falls within the last column
    // This is more for logical consistency as direct drawing handles its appearance.
    let goalGridMinX = floor((this.goalPos.x - this.goalSize / 2) / this.cellSize);
    let goalGridMaxX = floor((this.goalPos.x + this.goalSize / 2) / this.cellSize);
    let goalGridMinY = floor((this.goalPos.y - this.goalSize / 2) / this.cellSize);
    let goalGridMaxY = floor((this.goalPos.y + this.goalSize / 2) / this.cellSize);

    for (let i = goalGridMinX; i <= goalGridMaxX; i++) {
      for (let j = goalGridMinY; j <= goalGridMaxY; j++) {
        if (i >= 0 && i < this.gridWidth && j >= 0 && j < this.gridHeight) {
          // Check if this part of the goal is within the last column where exit path is defined
          if (i === this.gridWidth - 1) {
             // Only clear if it's part of the intended open exit path area
             if (abs(j - this.exitPathY) <= this.exitPathRadius) {
                this.grid[i][j] = false; 
             }
          } else if (i > this.gridWidth - CAVE_EXIT_X_OFFSET_CELLS) {
            // For parts of the goal square that might extend beyond the last column but are in the exit zone
            this.grid[i][j] = false;
          }
        }
      }
    }
    
    // Cave generation complete (100% progress)
    caveGenerationProgress = 1.0;
  }

  // --- Chunked Cave Generation for Visual Progress ---
  startChunkedCaveGeneration() {
    // Initialize game objects but don't generate cave yet
    currentCellSize = BASE_CELL_SIZE + (currentLevel - 1); // Increase cell size per level
    
    let baseAir = INITIAL_AIR_SUPPLY_BASE;
    let airForLevel = baseAir;
    airForLevel = max(airForLevel, MIN_AIR_SUPPLY_PER_LEVEL);
    let airDepletion = BASE_AIR_DEPLETION_RATE + (currentLevel - 1) * AIR_DEPLETION_LEVEL_INCREASE;
    
    // Create cave object but don't generate yet
    cave = new Cave(WORLD_WIDTH, WORLD_HEIGHT, currentCellSize, false); // false = don't auto-generate
    
    // Reset progress and start chunked generation
    caveGenerationProgress = 0;
    
    // Phase 1: Generate main path (30%)
    setTimeout(() => {
      cave.generateMainPath();
      caveGenerationProgress = 0.3;
      
      // Phase 2: Add obstacles (40% more = 70% total)
      setTimeout(() => {
        cave.generateObstacles();
        caveGenerationProgress = 0.7;
        
        // Phase 3: Ensure path clearance (10% more = 80% total)
        setTimeout(() => {
          cave.ensureMainPathClearance(cave.mainPath);
          caveGenerationProgress = 0.8;
          
          // Phase 4: Connect spaces (10% more = 90% total)
          setTimeout(() => {
            cave.connectAllSignificantSpaces();
            caveGenerationProgress = 0.9;
            
            // Phase 5: Final setup (10% more = 100% total)
            setTimeout(() => {
              cave.finalizeCave();
              caveGenerationProgress = 1.0;
              
              // Complete game initialization
              completeGameInitialization(airForLevel, airDepletion);
            }, 50);
          }, 50);
        }, 50);
      }, 50);
    }, 50);
  }

  completeGameInitialization(airForLevel, airDepletion) {
    // Find safe player starting position
    let playerStartX, playerStartY;
    let attempts = 0;
    let playerSpawnRadiusBuffer = currentCellSize * PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR;

    do {
      playerStartX = currentCellSize * (PLAYER_START_X_BASE_CELLS + attempts * PLAYER_START_X_ATTEMPT_INCREMENT_CELLS);
      playerStartY = WORLD_HEIGHT / 2 + random(-currentCellSize * PLAYER_START_Y_RANDOM_RANGE_CELLS, currentCellSize * PLAYER_START_Y_RANDOM_RANGE_CELLS);
      attempts++;
      if (playerStartX > WORLD_WIDTH * PLAYER_SPAWN_MAX_X_SEARCH_FACTOR) {
        playerStartX = currentCellSize * PLAYER_START_X_BASE_CELLS; 
        playerStartY = WORLD_HEIGHT / 2; 
        break;
      }
    } while (cave.isWall(playerStartX, playerStartY, playerSpawnRadiusBuffer) && attempts < MAX_PLAYER_SPAWN_ATTEMPTS);
    
    if (attempts >= MAX_PLAYER_SPAWN_ATTEMPTS) {
      playerStartX = currentCellSize * PLAYER_START_X_BASE_CELLS; 
      playerStartY = WORLD_HEIGHT / 2;
    }

    player = new PlayerSub(playerStartX, playerStartY, airForLevel, airDepletion);
    
    // Initialize other game objects
    enemies = []; projectiles = [];
    sonarBubbles = []; particles = []; 
    let enemyCount = BASE_ENEMY_COUNT + (currentLevel - 1) * ENEMY_COUNT_PER_LEVEL_INCREASE;
    enemyCount = min(enemyCount, MAX_ENEMY_COUNT);
    
    for (let i = 0; i < enemyCount; i++) {
      let enemyX, enemyY, eAttempts = 0;
      do {
        enemyX = random(WORLD_WIDTH * ENEMY_SPAWN_MIN_X_WORLD_FACTOR, WORLD_WIDTH * ENEMY_SPAWN_MAX_X_WORLD_FACTOR);
        enemyY = random(WORLD_HEIGHT * ENEMY_SPAWN_MIN_Y_WORLD_FACTOR, WORLD_HEIGHT * ENEMY_SPAWN_MAX_Y_WORLD_FACTOR); 
        eAttempts++;
      } while (cave.isWall(enemyX, enemyY, ENEMY_SPAWN_WALL_CHECK_RADIUS) && eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS);
      if (eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS) enemies.push(new Enemy(enemyX, enemyY));
    }

    // Initialize jellyfish creatures
    jellyfish = [];
    let jellyfishCount = BASE_JELLYFISH_COUNT + (currentLevel - 1) * JELLYFISH_COUNT_PER_LEVEL_INCREASE;
    jellyfishCount = min(jellyfishCount, MAX_JELLYFISH_COUNT);
    
    for (let i = 0; i < jellyfishCount; i++) {
      let jellyfishX, jellyfishY, jAttempts = 0;
      do {
        jellyfishX = random(WORLD_WIDTH * JELLYFISH_SPAWN_MIN_X_WORLD_FACTOR, WORLD_WIDTH * JELLYFISH_SPAWN_MAX_X_WORLD_FACTOR);
        jellyfishY = random(WORLD_HEIGHT * JELLYFISH_SPAWN_MIN_Y_WORLD_FACTOR, WORLD_HEIGHT * JELLYFISH_SPAWN_MAX_Y_WORLD_FACTOR);
        jAttempts++;
      } while (cave.isWall(jellyfishX, jellyfishY, JELLYFISH_SPAWN_WALL_CHECK_RADIUS) && jAttempts < MAX_JELLYFISH_SPAWN_ATTEMPTS);
      if (jAttempts < MAX_JELLYFISH_SPAWN_ATTEMPTS) jellyfish.push(new Jellyfish(jellyfishX, jellyfishY));
    }

    // Initialize current areas
    currentAreas = [];
    let currentAreaCount = BASE_CURRENT_AREA_COUNT + (currentLevel - 1) * CURRENT_AREA_COUNT_PER_LEVEL_INCREASE;
    currentAreaCount = min(currentAreaCount, MAX_CURRENT_AREA_COUNT);
    
    for (let i = 0; i < currentAreaCount; i++) {
      let areaX, areaY, aAttempts = 0;
      do {
        areaX = random(CURRENT_AREA_SPAWN_MIN_X_WORLD_FACTOR * WORLD_WIDTH, CURRENT_AREA_SPAWN_MAX_X_WORLD_FACTOR * WORLD_WIDTH);
        areaY = random(CURRENT_AREA_SPAWN_MIN_Y_WORLD_FACTOR * WORLD_HEIGHT, CURRENT_AREA_SPAWN_MAX_Y_WORLD_FACTOR * WORLD_HEIGHT);
        aAttempts++;
      } while (cave.isWall(areaX, areaY, CURRENT_AREA_SPAWN_WALL_CHECK_RADIUS) && aAttempts < MAX_CURRENT_AREA_SPAWN_ATTEMPTS);
      if (aAttempts < MAX_CURRENT_AREA_SPAWN_ATTEMPTS) {
        currentAreas.push(new CurrentArea(areaX, areaY));
      }
    }

    // Finalize player setup
    if (gameState === 'loading') { // Only if we're still in loading state
      player.health = PLAYER_INITIAL_HEALTH; 
      player.airSupply = player.initialAirSupply;
      player.lastSonarTime = frameCount - player.sonarCooldown;
      player.lastShotTime = frameCount - player.shotCooldown;
      gameState = 'playing';
      
      // Audio setup
      if (audioInitialized && reactorHumOsc && reactorHumOsc.started) {
        reactorHumOsc.amp(0, 0);
      }
      if (audioInitialized && lowAirOsc && lowAirOsc.started) lowAirEnv.triggerRelease(lowAirOsc);
      lastLowAirBeepTime = 0;
    }
  }

  // --- Separate Generation Methods for Chunked Progress ---
  generateMainPath() {
    // Initialize grid
    for (let i = 0; i < this.gridWidth; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridHeight; j++) this.grid[i][j] = false; // Initialize as open space
    }
    
    let pathY = this.gridHeight / 2; 
    let currentPathRadius = 0;
    let pathMinRadius = CAVE_PATH_MIN_RADIUS_CELLS; 
    let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    
    // Store the main path for later validation
    this.mainPath = [];
    
    noiseSeed(millis() + currentLevel * 1000);
    
    // Generate main path
    for (let i = 0; i < this.gridWidth; i++) {
      pathY += (noise(i * CAVE_PATH_Y_NOISE_FACTOR_1, CAVE_PATH_Y_NOISE_OFFSET_1 + currentLevel) - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
      pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1);
      currentPathRadius = map(noise(i * CAVE_PATH_RADIUS_NOISE_FACTOR, CAVE_PATH_RADIUS_NOISE_OFFSET + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
      
      this.mainPath.push({x: i, y: pathY, radius: currentPathRadius});
      
      for (let j = 0; j < this.gridHeight; j++) {
        if (abs(j - pathY) > currentPathRadius) this.grid[i][j] = true; // Mark as wall
      }
      if (i === this.gridWidth - 1) { 
        this.exitPathY = pathY; 
        this.exitPathRadius = currentPathRadius; 
      }
    }
  }
  
  generateObstacles() {
    // Add obstacles and clearings
    for (let i = 1; i < this.gridWidth - 1; i++) {
      for (let j = 1; j < this.gridHeight - 1; j++) {
        if (!this.grid[i][j]) { // If it's currently open path
          let pathPoint = this.mainPath[i];
          let minClearanceFromPath = (PLAYER_RADIUS / this.cellSize) + 1;
          
          if (noise(i * CAVE_OBSTACLE_NOISE_FACTOR_1, j * CAVE_OBSTACLE_NOISE_FACTOR_1, CAVE_OBSTACLE_NOISE_OFFSET_1 + currentLevel) > CAVE_OBSTACLE_THRESHOLD_1 && 
              abs(j - pathPoint.y) > pathPoint.radius + CAVE_OBSTACLE_DIST_BUFFER_1 &&
              abs(j - pathPoint.y) > minClearanceFromPath) {
            this.grid[i][j] = true; // Add an obstacle
          }
        } else { // If it's currently a wall
          if (noise(i * CAVE_CLEARING_NOISE_FACTOR, j * CAVE_CLEARING_NOISE_FACTOR, CAVE_CLEARING_NOISE_OFFSET + currentLevel) < CAVE_CLEARING_THRESHOLD) {
            this.grid[i][j] = false; // Carve a clearing
          }
        }
      }
    }
  }
  
  finalizeCave() {
    // Set up borders
    for (let i = 0; i < this.gridWidth; i++) { 
      this.grid[i][0] = true; 
      this.grid[i][this.gridHeight - 1] = true; 
    }
    for (let j = 0; j < this.gridHeight; j++) this.grid[0][j] = true;
    for (let j = 0; j < this.gridHeight; j++) {
      if (isNaN(this.exitPathY) || this.exitPathY === undefined || this.exitPathY === null) {
        this.exitPathY = this.gridHeight / 2;
        this.exitPathRadius = Math.max(CAVE_PATH_MIN_RADIUS_CELLS, 3);
      }
      if (abs(j - this.exitPathY) > this.exitPathRadius) this.grid[this.gridWidth - 1][j] = true;
      else this.grid[this.gridWidth - 1][j] = false;
    }
    
    // Set goal position
    this.goalPos.x = this.exitX + this.goalSize / 2;
    if (isNaN(this.exitPathY) || this.exitPathY === undefined || this.exitPathY === null) {
      this.exitPathY = this.gridHeight / 2;
    }
    this.goalPos.y = this.exitPathY * this.cellSize;
    
    // Validate and clear goal area
    let goalGridMinX = floor((this.goalPos.x - this.goalSize / 2) / this.cellSize);
    let goalGridMaxX = floor((this.goalPos.x + this.goalSize / 2) / this.cellSize);
    let goalGridMinY = floor((this.goalPos.y - this.goalSize / 2) / this.cellSize);
    let goalGridMaxY = floor((this.goalPos.y + this.goalSize / 2) / this.cellSize);

    for (let i = goalGridMinX; i <= goalGridMaxX; i++) {
      for (let j = goalGridMinY; j <= goalGridMaxY; j++) {
        if (i >= 0 && i < this.gridWidth && j >= 0 && j < this.gridHeight) {
          if (i === this.gridWidth - 1) {
             if (abs(j - this.exitPathY) <= this.exitPathRadius) {
                this.grid[i][j] = false; 
             }
          } else if (i > this.gridWidth - CAVE_EXIT_X_OFFSET_CELLS) {
            this.grid[i][j] = false;
          }
        }
      }
    }
  }
}

// --- Helper function to create explosions ---
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
  } else if (type === 'creature') {
    // Creature explosion uses a different set of particles and colors
    particleCount = EXPLOSION_PARTICLE_COUNT_TORPEDO_ENEMY; // Same count as enemy for now
    colorH = 300; // Purple hue for creature explosion
    colorS = 80;
    colorB = 70;
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
  levelScore = 0; // Reset level score for new level
  
  // Set loading state and defer heavy initialization
  gameState = 'loading';
  loadingStartTime = millis(); // Record when loading started
  
  // Use setTimeout to allow loading screen to render
  setTimeout(() => {
    // Start chunked cave generation instead of synchronous generation
    startChunkedCaveGeneration();
  }, 100); // Small delay to allow loading screen to render
}

function startAudioRoutine() {
    function startAllSoundObjects() {
        const soundObjects = [
            sonarOsc, explosionNoise, explosionBoomOsc, explosionBassOsc, 
            creatureExplosionNoise, creatureExplosionBoomOsc, creatureExplosionBassOsc,
            bumpOsc, torpedoNoise, 
            currentFlowNoise, currentFlowBassOsc,
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
        } else if (ctx && ctx.state === 'running') { audioInitialized = true; startAllSoundObjects(); }
    }
}

function preload() {
  customFont = loadFont('Berpatroli.otf');
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
  }
  
  // Debug toggle for showing cave walls (works in any state)
  if (key === ']') {
    debugShowWalls = !debugShowWalls;
    console.log("Debug wall view:", debugShowWalls ? "ON" : "OFF");
  }
  
  if (gameState === 'start' && keyCode === ENTER) {
    // Set loading state and defer heavy initialization
    gameState = 'loading';
    loadingStartTime = millis(); // Record when loading started
    
    // Use setTimeout to allow loading screen to render
    setTimeout(() => {
      // Start chunked cave generation instead of synchronous generation
      startChunkedCaveGeneration();
    }, 100); // Small delay to allow loading screen to render
 }  else if ((gameState === 'gameOver' || gameState === 'gameComplete') && keyCode === ENTER) {
    resetGame();
  } else if (gameState === 'levelComplete' && keyCode === ENTER) {
    prepareNextLevel();
  }
}

function drawDebugCaveWalls(offsetX, offsetY) {
  push();
  
  // Set up drawing style for walls
  //stroke(255, 0, 0); // Red outline for walls
  //strokeWeight(1);
  noFill();
  
  // Calculate which grid cells are visible on screen
  let startGridX = Math.max(0, Math.floor(offsetX / cave.cellSize));
  let endGridX = Math.min(cave.gridWidth - 1, Math.floor((offsetX + width) / cave.cellSize) + 1);
  let startGridY = Math.max(0, Math.floor(offsetY / cave.cellSize));
  let endGridY = Math.min(cave.gridHeight - 1, Math.floor((offsetY + height) / cave.cellSize) + 1);
  
  // Draw wall cells as red rectangles
  for (let i = startGridX; i <= endGridX; i++) {
    for (let j = startGridY; j <= endGridY; j++) {
      if (cave.grid[i] && cave.grid[i][j]) {
        let worldX = i * cave.cellSize - offsetX;
        let worldY = j * cave.cellSize - offsetY;
        rect(worldX, worldY, cave.cellSize, cave.cellSize);
      }
    }
  }
  
  // Also draw open spaces as green rectangles with transparency
  fill(255,100); // Semi-transparent green for open spaces
 // stroke(0, 255, 0); // Green outline
  
  for (let i = startGridX; i <= endGridX; i++) {
    for (let j = startGridY; j <= endGridY; j++) {
      if (cave.grid[i] && !cave.grid[i][j]) {
        let worldX = i * cave.cellSize - offsetX;
        let worldY = j * cave.cellSize - offsetY;
        rect(worldX, worldY, cave.cellSize, cave.cellSize);
      }
    }
  }
  
  // Draw enemies as filled shapes
  fill(255, 0, 255); // Magenta for enemies
  noStroke();
  for (let enemy of enemies) {
    let enemyX = enemy.pos.x - offsetX;
    let enemyY = enemy.pos.y - offsetY;
    // Only draw if enemy is visible on screen
    if (enemyX >= -enemy.radius && enemyX <= width + enemy.radius &&
        enemyY >= -enemy.radius && enemyY <= height + enemy.radius) {
      ellipse(enemyX, enemyY, enemy.radius * 2, enemy.radius * 2);
      
      // Add enemy info text
      fill(255, 255, 255); // White text
      textAlign(CENTER, CENTER);
      textSize(10);
           text("E", enemyX, enemyY);
      fill(255, 0, 255); // Back to magenta
    }
  }
  
  // Draw jellyfish as filled shapes
  fill(0, 255, 255); // Cyan for jellyfish
  noStroke();
  for (let jelly of jellyfish) {
    let jellyX = jelly.pos.x - offsetX;
    let jellyY = jelly.pos.y - offsetY;
    // Only draw if jellyfish is visible on screen
    if (jellyX >= -jelly.radius && jellyX <= width + jelly.radius &&
        jellyY >= -jelly.radius && jellyY <= height + jelly.radius) {
      ellipse(jellyX, jellyY, jelly.radius * 2, jelly.radius * 2);
      
      // Add jellyfish info text with health
      fill(255, 255, 255); // White text
      textAlign(CENTER, CENTER);
      textSize(10);
      text(`J${jelly.health}`, jellyX, jellyY);
      fill(0, 255, 255); // Back to cyan
    }
  }
  
  // Add debug info text
  fill(255, 255, 0); // Yellow text
  noStroke();
  textAlign(RIGHT, TOP);
  textSize(16);
  text("DEBUG: Cave Walls & Enemies (Press ] to toggle)", width - 10, 10);
  text(`Grid: ${cave.gridWidth}x${cave.gridHeight}, Cell: ${cave.cellSize}px`, width - 10, 30);
  text(`Enemies: ${enemies.length}, Jellyfish: ${jellyfish.length}`, width - 10, 50);

  pop();
}

function drawLoadingScreen() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B); // Use same background as game
  
  // Center the loading text
  fill(60, 100, 90); // Yellow color (HSB)
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(48);
  text("LOADING", width / 2, height / 2);
  
  // Add progress-based spinning indicator
  push();
  translate(width / 2, height / 2 + 60);
  
  // Use the actual cave generation progress, but also add time-based animation for smooth visual feedback
  let baseProgress = caveGenerationProgress;
  let timeProgress = min(1.0, (millis() - loadingStartTime) / 1000); // Complete in 1 second max
  let displayProgress = max(baseProgress, timeProgress * 0.9); // Show at least time-based progress
  
  // Calculate spinner angle based on progress (0 to 2*PI for full circle)
  let progressAngle = displayProgress * TWO_PI;
  
  stroke(60, 100, 100); // Yellow color in HSB
  strokeWeight(4);
  noFill();
  
  // Draw background circle (faint)
  stroke(60, 30, 50); // Dimmer yellow for background
  strokeWeight(2);
  circle(0, 0, 40);
  
  // Draw progress arc
  stroke(60, 100, 100); // Bright yellow for progress
  strokeWeight(4);
  if (progressAngle > 0) {
    arc(0, 0, 40, 40, -PI/2, -PI/2 + progressAngle); // Start from top (-PI/2) and progress clockwise
  }
  
  pop();
  
  // Optional: Add level information
  if (typeof currentLevel !== 'undefined') {
    fill(0, 0, 80, 180); // Semi-transparent white (HSB)
    noStroke(); // Ensure no stroke for text
    textAlign(CENTER, CENTER);
    textSize(24);
    text(`Generating Level ${currentLevel}`, width / 2, height / 2 + 120);
    
    // Show progress percentage
    textSize(16);
    text(`${Math.round(displayProgress * 100)}%`, width / 2, height / 2 + 150);
  }
}

function drawStartScreen() {

  // Animate submarine
  let subX = width / 2;
  let subY = height / 2 + START_SCREEN_TITLE_Y_OFFSET - 80;
  
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
  


  textAlign(CENTER, CENTER);
  fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B); textSize(START_SCREEN_TITLE_TEXT_SIZE);
  text(`Reactor Dive`, width / 2, height / 2 + START_SCREEN_TITLE_Y_OFFSET);
  
  textSize(START_SCREEN_INFO_TEXT_SIZE);
  text("Christian Nold 2025", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_3);

  let killsForLevel1 = getKillsRequiredForLevel(1);
  text(`Destroy ${killsForLevel1} mutated creatures and reach the flooded reactor`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_1);
  
  // Show different control instructions based on device
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Touch controls: Joystick (left) and Fire button (right)", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_2);
  } else {
    text("WASD/Arrows: Move. SPACE: Shoot.", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_2);
  }
  
  textSize(START_SCREEN_PROMPT_TEXT_SIZE); fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
  
  // Show different instructions based on whether mobile controls are active
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Tap anywhere to Dive", width / 2, height / 2 + START_SCREEN_PROMPT_Y_OFFSET);
  } else {
    text("Press ENTER to Dive", width / 2, height / 2 + START_SCREEN_PROMPT_Y_OFFSET);
  }
  if (!audioInitialized) {
      textSize(START_SCREEN_AUDIO_NOTE_TEXT_SIZE); fill(START_SCREEN_AUDIO_NOTE_COLOR_H, START_SCREEN_AUDIO_NOTE_COLOR_S, START_SCREEN_AUDIO_NOTE_COLOR_B);
      //text("(Sound will enable after you press Enter or Click)", width/2, height/2 + START_SCREEN_AUDIO_NOTE_Y_OFFSET);
 }
}

function drawLevelCompleteScreen() {
  textAlign(CENTER, CENTER); 
  fill(LEVEL_COMPLETE_TITLE_COLOR_H, LEVEL_COMPLETE_TITLE_COLOR_S, LEVEL_COMPLETE_TITLE_COLOR_B); textSize(LEVEL_COMPLETE_TITLE_TEXT_SIZE);
  text(`LEVEL ${currentLevel} CLEARED!`, width / 2, height / 2 + LEVEL_COMPLETE_TITLE_Y_OFFSET); 
  
  // Show score information
  textSize(LEVEL_COMPLETE_INFO_TEXT_SIZE);
  let timeLeftInSeconds = Math.max(0, Math.floor(player.airSupply / 60));
  text(`Time bonus: ${timeLeftInSeconds} seconds x 10 = ${levelScore} points`, width / 2, height / 2 + LEVEL_COMPLETE_INFO_Y_OFFSET);
  let killsForNextLevel = getKillsRequiredForLevel(currentLevel+1);
  text(`Next Level: Destroy ${killsForNextLevel} enemies and reach the reactor`, width/2, height / 2 + LEVEL_COMPLETE_INFO_Y_OFFSET + 40);
  
  // Show appropriate continue instruction
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Tap to Continue", width / 2, height / 2 + LEVEL_COMPLETE_PROMPT_Y_OFFSET);
  } else {
    text("ENTER to Continue", width / 2, height / 2 + LEVEL_COMPLETE_PROMPT_Y_OFFSET);
  }
}

function drawGameCompleteScreen() {
  textAlign(CENTER, CENTER);
  fill(GAME_COMPLETE_TITLE_COLOR_H, GAME_COMPLETE_TITLE_COLOR_S, GAME_COMPLETE_TITLE_COLOR_B); textSize(GAME_COMPLETE_TITLE_TEXT_SIZE);
  text("MISSION ACCOMPLISHED!", width / 2, height / 2 + GAME_COMPLETE_TITLE_Y_OFFSET);
  textSize(GAME_COMPLETE_INFO_TEXT_SIZE);
  text(`You cleared all ${MAX_LEVELS} levels!`, width/2, height/2 + GAME_COMPLETE_INFO_Y_OFFSET);
  text(`Final Score: ${totalScore}`, width/2, height/2 + GAME_COMPLETE_INFO_Y_OFFSET + 30);
  
  // Show appropriate restart instruction
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Tap to Play Again", width / 2, height / 2 + GAME_COMPLETE_PROMPT_Y_OFFSET);
  } else {
    text("Press ENTER to Play Again", width / 2, height / 2 + GAME_COMPLETE_PROMPT_Y_OFFSET);
  }
}

function drawGameOverScreen() {
  textAlign(CENTER, CENTER);
  fill(GAME_OVER_TITLE_COLOR_H, GAME_OVER_TITLE_COLOR_S, GAME_OVER_TITLE_COLOR_B); textSize(GAME_OVER_TITLE_TEXT_SIZE);
  text("MISSION FAILED", width/2, height/2 + GAME_OVER_TITLE_Y_OFFSET);
  textSize(GAME_OVER_INFO_TEXT_SIZE);
  text(player.health <= 0 ? "Submarine Destroyed!" : "Air Supply Depleted!", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET);
  text(`Total Score: ${totalScore}`, width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 30);
  
  // Show appropriate restart instruction
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Tap to Restart", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
  } else {
    text("Press ENTER to Restart", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
  }
}

function drawPlayingState() {
  cameraOffsetX = player.pos.x - width / 2; cameraOffsetY = player.pos.y - height / 2;

  // Render the goal square if player is inside it
  if (cave.isGoal(player.pos.x, player.pos.y)) {
    cave.renderGoal(cameraOffsetX, cameraOffsetY);
  }

  // Process current areas - spawn bubbles and render debug visuals
  for (let area of currentAreas) {
    area.spawnBubbles(cave, cameraOffsetX, cameraOffsetY);
    area.render(cameraOffsetX, cameraOffsetY);
  }

  // Process sonar bubbles, particles, and projectiles
  processGameObjectArray(sonarBubbles, cameraOffsetX, cameraOffsetY);
  processGameObjectArray(particles, cameraOffsetX, cameraOffsetY);
  processGameObjectArray(projectiles, cameraOffsetX, cameraOffsetY, cave); // Projectiles need cave context

  player.update(cave, enemies);
  
  // Apply mobile controls movement if enabled
  applyMobileMovement();
  
  // Update and render enemies - only process those near the screen
  let margin = 100; // Extra margin for off-screen enemies
  for (let enemy of enemies) {
    // Always update enemy logic (AI, movement) but only render if visible
    enemy.update(cave, player);
    
    // Check if enemy is near the viewport for rendering
    if (enemy.pos.x + enemy.radius >= cameraOffsetX - margin &&
        enemy.pos.x - enemy.radius <= cameraOffsetX + width + margin &&
        enemy.pos.y + enemy.radius >= cameraOffsetY - margin &&
        enemy.pos.y - enemy.radius <= cameraOffsetY + height + margin) {
      enemy.render(cameraOffsetX, cameraOffsetY);
    }
  }
  
  // Update jellyfish (they don't render directly, only through sonar)
  for (let jelly of jellyfish) jelly.update(cave, player);
  
  // Note: Jellyfish are not rendered directly - only visible through sonar hits
  player.handleEnemyCollisions(enemies);
  player.handleJellyfishCollisions(jellyfish);

  // Projectile-Enemy Collisions (This loop needs to stay separate due to nested iteration and specific logic)
  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (projectiles[i] && enemies[j]) {
        let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, enemies[j].pos.x, enemies[j].pos.y);
        if (d < projectiles[i].radius + enemies[j].radius) {
          createExplosion(projectiles[i].pos.x, projecticles[i].pos.y, 'enemy'); // Create enemy explosion before splicing
          enemies.splice(j, 1); 
          projectiles.splice(i, 1); 
          enemiesKilledThisLevel++;
          playSound('creatureExplosion'); // Use creature explosion sound
          break; 
        }
      }
    }
  }

  // Projectile-Jellyfish Collisions
  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = jellyfish.length - 1; j >= 0; j--) {
      if (projectiles[i] && jellyfish[j]) {
        let d = dist(projectiles[i].pos.x, projecticles[i].pos.y, jellyfish[j].pos.x, jellyfish[j].pos.y);
        if (d < projectiles[i].radius + jellyfish[j].radius) {
          // Jellyfish takes damage instead of being destroyed immediately
          let destroyed = jellyfish[j].takeDamage();
          createExplosion(projectiles[i].pos.x, projecticles[i].pos.y, 'enemy');
          projectiles.splice(i, 1);
          
          if (destroyed) {
            jellyfish.splice(j, 1);
            enemiesKilledThisLevel++;
            playSound('creatureExplosion'); // Use creature explosion sound when destroyed
          } else {
            playSound('bump'); // Different sound for non-fatal hit
          }
          break;
        }
      }
    }
  }

  player.render(cameraOffsetX, cameraOffsetY);

  // Debug: Show cave walls
  if (debugShowWalls) {
    drawDebugCaveWalls(cameraOffsetX, cameraOffsetY);
  }

  // HUD
  fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B); textSize(HUD_TEXT_SIZE); textAlign(LEFT, TOP);
  text(`Hull: ${player.health}%`, HUD_MARGIN_X, HUD_MARGIN_Y+ HUD_LINE_SPACING);
  text(`Air: ${floor(player.airSupply / AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR)} seconds `, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING*2);
  const killsRequired = getKillsRequiredForLevel(currentLevel);
  let killsStillNeeded = Math.max(0, killsRequired - enemiesKilledThisLevel);
  text(`Kills Needed: ${killsStillNeeded}`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 3);
  let distanceToGoal = dist(player.pos.x, player.pos.y, cave.goalPos.x, cave.goalPos.y);
  text(`Distance to Reactor: ${floor(distanceToGoal)} meters`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 4);

  // Render mobile controls after HUD
  renderMobileControls();

  // Update reactor hum volume based on distance to goal (reactor)
  updateReactorHum(distanceToGoal);

  // Check Game Over / Level Complete Conditions
  if (player.health <= 0 || player.airSupply <= 0) {
      if(gameState === 'playing') {
        // Player died - don't add level score to total, just calculate for display
        let timeLeftInSeconds = Math.max(0, Math.floor(player.airSupply / 60)); // Convert frames to seconds (assuming 60 FPS)
        levelScore = timeLeftInSeconds * 10;
        playSound('gameOver');
      }
      gameState = 'gameOver';
  } else if (cave.isGoal(player.pos.x, player.pos.y) && killsStillNeeded === 0) {
    // Level completed successfully - calculate score and add to total
    let timeLeftInSeconds = Math.max(0, Math.floor(player.airSupply / 60)); // Convert frames to seconds (assuming 60 FPS)
    levelScore = timeLeftInSeconds * 10;
    totalScore += levelScore;
    gameState = (currentLevel >= MAX_LEVELS) ? 'gameComplete' : 'levelComplete';
  }
}

function draw() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);

  if (gameState === 'start') {
    drawStartScreen();
    return;
  }
  if (gameState === 'loading') {
    drawLoadingScreen();
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
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

// --- Dynamic Kills Requirement Constants ---
const BASE_KILLS_REQUIRED = 3; // Kills required for the first level
const KILLS_INCREASE_PER_LEVEL = 3; // How many more kills needed each subsequent level
function getKillsRequiredForLevel(level) {
  if (level <= 0) return 0;
  return BASE_KILLS_REQUIRED + (level - 1) * KILLS_INCREASE_PER_LEVEL;
}

// --- Touch Event Forwarding for Mobile Controls ---
function touchStarted() {
  if (typeof handleMobileTouchStart === 'function') {
    handleMobileTouchStart(touches);
  }
  // Prevent default to avoid issues on mobile
  return false;
}

function touchMoved() {
  if (typeof handleMobileTouchMove === 'function') {
    handleMobileTouchMove(touches);
  }
  // Prevent default to avoid issues on mobile
  return false;
}

function touchEnded() {
  if (typeof handleMobileTouchEnd === 'function') {
    handleMobileTouchEnd(touches);
  }
  // Prevent default to avoid issues on mobile
  return false;
}

