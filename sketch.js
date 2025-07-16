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

// Spawning constants
const MAX_PLAYER_SPAWN_ATTEMPTS = 50;
const PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR = 1.5; // Multiplier of CELL_SIZE
const PLAYER_START_X_BASE_CELLS = 5;
const PLAYER_START_X_ATTEMPT_INCREMENT_CELLS = 0.2;
const PLAYER_START_Y_RANDOM_RANGE_CELLS = 4; // +/- from center
const PLAYER_SPAWN_MAX_X_SEARCH_FACTOR = 1/5; // Max distance to search for player spawn (world width factor)

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

// Player submarine appearance constants
const PLAYER_BODY_WIDTH_FACTOR = 2.0;
const PLAYER_BODY_HEIGHT_FACTOR = 1.0;
const PLAYER_SAIL_WIDTH_FACTOR = 0.5;
const PLAYER_SAIL_HEIGHT_FACTOR = 0.8;
const PLAYER_SAIL_OFFSET_X_FACTOR = -0.25;
const PLAYER_SAIL_CORNER_RADIUS_FACTOR = 0.1;
const PLAYER_FIN_X1_FACTOR = 0.8;
const PLAYER_FIN_Y1_FACTOR = 0.4;
const PLAYER_FIN_X2_FACTOR = 0.8;
const PLAYER_FIN_Y2_FACTOR = 0.4;
const PLAYER_FIN_X3_FACTOR = 0.4;
const PLAYER_FIN_Y3_FACTOR = 0.1;
const PLAYER_FIN_X4_FACTOR = 0.4;
const PLAYER_FIN_Y4_FACTOR = 0.1;
const PLAYER_PROPELLER_X_OFFSET_FACTOR = -1.2; // Offset from player center, behind the body
const PLAYER_PROPELLER_THICKNESS_FACTOR = 0.3; // Thickness of the propeller from side view (relative to player radius)
const PLAYER_PROPELLER_MAX_SIDE_HEIGHT_FACTOR = 0.8; // Max apparent height from side view (relative to player radius)
const PLAYER_PROPELLER_SPIN_SPEED_FACTOR = 0.2; // How fast the propeller appears to spin

// Propeller bubble constants
const PROPELLER_BUBBLE_SPAWN_CHANCE_MOVING = 0.4; // Chance each frame when moving
const PROPELLER_BUBBLE_MAX_COUNT_PER_SPAWN = 1; // Max bubbles if chance passes
const PROPELLER_BUBBLE_SPAWN_X_OFFSET_FACTOR = PLAYER_PROPELLER_X_OFFSET_FACTOR; // Spawn near propeller
const PROPELLER_BUBBLE_SPAWN_AREA_RADIUS = 5; // Radius of random spawn area

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

// Bubble constants
const SONAR_BUBBLE_MIN_SPEED_Y = 0.2;
const SONAR_BUBBLE_MAX_SPEED_Y = 0.5;
const SONAR_BUBBLE_MIN_SIZE = 1;
const SONAR_BUBBLE_MAX_SIZE = 2;
const SONAR_BUBBLE_MAX_LIFESPAN_FRAMES = 75;
const SONAR_BUBBLE_COLOR_H = 180;
const SONAR_BUBBLE_COLOR_S = 70;
const SONAR_BUBBLE_COLOR_B = 95;
const SONAR_BUBBLE_ALPHA_MAX = 180;

// Additional constants
const BUBBLE_LIFESPAN_FRAMES = 180; // 3 seconds at 60fps - for current area bubbles

// Font
let customFont;

// START SCREEN CONSTANTS
// Title
const START_SCREEN_TITLE_TEXT_SIZE = 48;
const START_SCREEN_TITLE_Y_OFFSET = -80;
const START_SCREEN_TITLE_COLOR_H = 150;
const START_SCREEN_TITLE_COLOR_S = 100;
const START_SCREEN_TITLE_COLOR_B = 100;

// Info text
const START_SCREEN_INFO_TEXT_SIZE = 18;
const START_SCREEN_INFO_Y_OFFSET_1 = -30;
const START_SCREEN_INFO_Y_OFFSET_2 = 0;
const START_SCREEN_INFO_Y_OFFSET_3 = 180;

// Prompt text
const START_SCREEN_PROMPT_TEXT_SIZE = 24;
const START_SCREEN_PROMPT_Y_OFFSET = 100;
const START_SCREEN_PROMPT_COLOR_H = 150;
const START_SCREEN_PROMPT_COLOR_S = 100;
const START_SCREEN_PROMPT_COLOR_B = 100;

// Audio note
const START_SCREEN_AUDIO_NOTE_TEXT_SIZE = 16;
const START_SCREEN_AUDIO_NOTE_Y_OFFSET = 130;
const START_SCREEN_AUDIO_NOTE_COLOR_H = 0;
const START_SCREEN_AUDIO_NOTE_COLOR_S = 0;
const START_SCREEN_AUDIO_NOTE_COLOR_B = 75;

// Level complete screen
const LEVEL_COMPLETE_TITLE_TEXT_SIZE = 40;
const LEVEL_COMPLETE_TITLE_Y_OFFSET = -80;
const LEVEL_COMPLETE_TITLE_COLOR_H = 120;
const LEVEL_COMPLETE_TITLE_COLOR_S = 100;
const LEVEL_COMPLETE_TITLE_COLOR_B = 100;
const LEVEL_COMPLETE_INFO_TEXT_SIZE = 20;
const LEVEL_COMPLETE_INFO_Y_OFFSET = 0;
const LEVEL_COMPLETE_PROMPT_Y_OFFSET = 100;

// Game complete screen
const GAME_COMPLETE_TITLE_TEXT_SIZE = 40;
const GAME_COMPLETE_TITLE_Y_OFFSET = -80;
const GAME_COMPLETE_TITLE_COLOR_H = 60;
const GAME_COMPLETE_TITLE_COLOR_S = 100;
const GAME_COMPLETE_TITLE_COLOR_B = 100;
const GAME_COMPLETE_INFO_TEXT_SIZE = 20;
const GAME_COMPLETE_INFO_Y_OFFSET = 0;
const GAME_COMPLETE_PROMPT_Y_OFFSET = 100;

// Game over screen
const GAME_OVER_TITLE_TEXT_SIZE = 40;
const GAME_OVER_TITLE_Y_OFFSET = -80;
const GAME_OVER_TITLE_COLOR_H = 0;
const GAME_OVER_TITLE_COLOR_S = 100;
const GAME_OVER_TITLE_COLOR_B = 80;
const GAME_OVER_INFO_TEXT_SIZE = 20;
const GAME_OVER_INFO_Y_OFFSET = 0;
const GAME_OVER_PROMPT_Y_OFFSET = 100;
const PLAYER_SONAR_HIT_ALPHA_MIN = 0;
const PLAYER_SONAR_HIT_SIZE_MAX = 25;
const PLAYER_SONAR_HIT_SIZE_MIN = 10;
const PLAYER_SONAR_HIT_OFFSCREEN_BUFFER = 20;
const PLAYER_SONAR_ENEMY_HIT_SIZE_FACTOR = 1.3;
const PLAYER_SONAR_ARC_RADIUS_FACTOR = 3.5;
const PLAYER_SHOT_ARC_RADIUS_FACTOR = 2.5;

// Projectile Constants
const PROJECTILE_SPEED = 3;
const PROJECTILE_RADIUS = 3; // This will be the base for torpedo size
const PROJECTILE_LIFESPAN_FRAMES = 100;
const PLAYER_SHOT_COOLDOWN_FRAMES = 70;
const PROJECTILE_WALL_COLLISION_RADIUS_FACTOR = 0.5; // For more accurate feel

// Torpedo Visual Constants
const TORPEDO_BODY_LENGTH_FACTOR = 3.5; // e.g., 3.5 * PROJECTILE_RADIUS
const TORPEDO_BODY_WIDTH_FACTOR = 1;  // e.g., PROJECTILE_RADIUS
const TORPEDO_FIN_SIZE_FACTOR = 0.3;    // e.g., 1.0 * PROJECTILE_RADIUS (for small side fins)
const TORPEDO_FIN_OFFSET_FACTOR = 0.7; // How far back fins are from center
const TORPEDO_COLOR_H = 30; // Orange-ish
const TORPEDO_COLOR_S = 80;
const TORPEDO_COLOR_B = 90;
const TORPEDO_COLOR_A = 220; // Slightly more opaque

// Torpedo Trail Particle Constants
const TORPEDO_TRAIL_PARTICLE_SPAWN_CHANCE = 0.7; // High chance per frame per torpedo
const TORPEDO_TRAIL_PARTICLE_SPREAD_ANGLE = Math.PI / 4; // Cone of spread for particles
const TORPEDO_TRAIL_PARTICLE_SPEED_MIN = 0.1; // Slow drift
const TORPEDO_TRAIL_PARTICLE_SPEED_MAX = 0.3;
const TORPEDO_TRAIL_OFFSET_FACTOR = -1.8; // How far behind the torpedo center particles spawn
const TORPEDO_TRAIL_PARTICLE_MAX_LIFESPAN = 40; // Shorter lifespan
const TORPEDO_TRAIL_PARTICLE_MIN_SIZE = 0.5;
const TORPEDO_TRAIL_PARTICLE_MAX_SIZE = 1.5;
const TORPEDO_TRAIL_PARTICLE_COLOR_H = 180; // Similar to sonar bubbles
const TORPEDO_TRAIL_PARTICLE_COLOR_S = 60;
const TORPEDO_TRAIL_PARTICLE_COLOR_B = 90;
const TORPEDO_TRAIL_PARTICLE_ALPHA_MAX = 150;

// Explosion Particle Constants
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

// PowerUp Constants
const POWERUP_SPAWN_CHANCE_ON_ENEMY_DEATH = 0.5; // 50% chance to spawn powerup when enemy dies
const POWERUP_SPAWN_CHANCE_ON_JELLYFISH_DEATH = 0.75; // 75% chance to spawn powerup when jellyfish dies
const POWERUP_HEALTH_AMOUNT = 25; // Amount of health restored by health powerup
const POWERUP_AIR_AMOUNT = 1200; // Amount of air restored by air powerup (frames)
const POWERUP_SHIELD_DURATION = 600; // Duration of shield powerup (frames)
const POWERUP_RADIUS = 15; // Size of powerup
const POWERUP_LIFESPAN = 900; // How long powerups stay in the world (15 seconds)

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

// Enemy Spawning
const BASE_ENEMY_COUNT = 7; // Initial number of enemies at level 1
const ENEMY_COUNT_PER_LEVEL_INCREASE = 5; // How many more enemies per level
const MAX_ENEMY_COUNT = 30; // Absolute maximum number of enemies
const ENEMY_SPAWN_MIN_X_WORLD_FACTOR = 0.15; // Spawn enemies in this fraction of world width
const ENEMY_SPAWN_MAX_X_WORLD_FACTOR = 0.9;
const ENEMY_SPAWN_MIN_Y_WORLD_FACTOR = 0.1;  // Spawn enemies in this fraction of world height
const ENEMY_SPAWN_MAX_Y_WORLD_FACTOR = 0.9;
const ENEMY_SPAWN_WALL_CHECK_RADIUS = 25; // Radius to check for walls when finding an enemy spawn point
const MAX_ENEMY_SPAWN_ATTEMPTS = 50;    // Max attempts to find a clear spawn spot for a single enemy

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
const REACTOR_HUM_FREQ = 35; // Lower frequency hum
const REACTOR_HUM_MAX_DISTANCE = 2500; // Max distance where hum is audible

const LOW_AIR_ENV_ADSR = { aT: 0.05, dT: 0.1, sR: 0.6, rT: 0.2 };
const LOW_AIR_ENV_LEVELS = { aL: 0.2, rL: 0 };
const LOW_AIR_FREQ = 1200;

// Powerup sound
const POWERUP_ENV_ADSR = { aT: 0.01, dT: 0.1, sR: 0.3, rT: 0.3 };
const POWERUP_ENV_LEVELS = { aL: 0.4, rL: 0 };
const POWERUP_START_FREQ = 600;
const POWERUP_END_FREQ = 1200;

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

// Creature Explosion Sound Constants (less boomy than wall explosions)
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
let powerups = []; // Array for powerups
let currentAreas = []; // Array for underwater current areas
let cameraOffsetX, cameraOffsetY;
let gameState = 'start';
let currentLevel = 1;
let enemiesKilledThisLevel = 0; // New variable to track enemies killed this level
let startScreenPropellerAngle = 0; // Animation variable for start screen submarine propeller
let totalScore = 0; // Total accumulated score across all completed levels
let levelScore = 0; // Score for the current level
let debugShowWalls = false; // Debug mode to show all cave walls

// Highscore submission variables
let isHighScoreChecked = false; // Track if we've checked for high score
let isSubmittingHighScore = false; // Track if we're in high score entry mode
let playerNameInput = ''; // Store the player's name input
let isHighScoreResult = false; // Whether the current score qualifies as a high score
let isSubmissionInProgress = false; // To prevent multiple submissions

// Mobile input handling
let highscoreInputElement = null; // Reference to the HTML input element
let isMobileInputFocused = false; // New flag to track focus state

// Highscore system variables
let highScores = null; // Will hold the array of high scores

// Audio system variables
let audioInitialized = false;

// Initialize the highscore manager
const highScoreManager = new JSONBinHighScores();

// Submit highscore using XMLHttpRequest (JSONBin API)
function submitHighScoreXHR(binId, apiKey, accessKey, scoreData, callback) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      if (callback) callback(req.responseText, req.status);
    }
  };
  req.open("PUT", `https://api.jsonbin.io/v3/b/${binId}`, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("X-Master-Key", apiKey);
  if (accessKey) req.setRequestHeader("X-Access-Key", accessKey);
  req.send(JSON.stringify(scoreData));
}

// Function to submit high score (used by both desktop and mobile)
function submitHighScore() {
  if (isSubmissionInProgress) {
    console.log("Submission already in progress. Ignoring.");
    return;
  }

  if (playerNameInput.trim().length > 0) {
    console.log('Submitting high score:', playerNameInput, totalScore);
    isSubmissionInProgress = true; // Set flag to prevent duplicate submissions
    
    // Immediately disable input field and show loading
    if (highscoreInputElement) {
      highscoreInputElement.disabled = true;
      highscoreInputElement.style.backgroundColor = 'rgba(100, 100, 100, 0.5)';
      highscoreInputElement.style.color = '#999999';
      highscoreInputElement.style.pointerEvents = 'none';
    }
    
    // Show loading overlay with submission message
    showLoadingOverlay("SUBMITTING SCORE...");
    
    highScoreManager.submitScore(playerNameInput.trim(), totalScore).then(() => {
      console.log('High score submitted successfully!');
      hideLoadingOverlay();
      isSubmittingHighScore = false;
      isMobileInputFocused = false; // Reset flag
      isSubmissionInProgress = false; // Reset flag after submission
      
      // Clear and reset the input field
      if (highscoreInputElement) {
        highscoreInputElement.value = '';
        highscoreInputElement.disabled = false;
        highscoreInputElement.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        highscoreInputElement.style.color = '#ffff00';
        highscoreInputElement.style.pointerEvents = 'auto';
        // Hide the on-screen keyboard on mobile by blurring the input
        highscoreInputElement.blur();
      }
      playerNameInput = '';
      
    }).catch(error => {
      console.error('Error submitting high score:', error);
      hideLoadingOverlay();
      isSubmissionInProgress = false; // Reset flag on error
      
      // Re-enable input field for retry
      if (highscoreInputElement) {
        highscoreInputElement.disabled = false;
        highscoreInputElement.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        highscoreInputElement.style.color = '#ffff00';
        highscoreInputElement.style.pointerEvents = 'auto';
      }
    });
  }
}

// Constants for game progression
const BASE_KILLS_REQUIRED = 3; // Kills required for the first level
const KILLS_INCREASE_PER_LEVEL = 3; // How many more kills needed each subsequent level

// Function to calculate required kills for a level
function getKillsRequiredForLevel(level) {
  if (level <= 0) return 0;
  return BASE_KILLS_REQUIRED + (level - 1) * KILLS_INCREASE_PER_LEVEL;
}

// Helper function to get remaining kills needed
function getKillsStillNeeded() {
  const killsRequired = getKillsRequiredForLevel(currentLevel);
  return Math.max(0, killsRequired - enemiesKilledThisLevel);
}

// Helper function to process game object arrays (update, render, remove offscreen)
function processGameObjectArray(arr, offsetX, offsetY, caveContext = null) {
  let margin = 50; // Margin for objects slightly off-screen
  
  for (let i = arr.length - 1; i >= 0; i--) {
    let obj = arr[i];
    
    // Always update object logic
    if (obj.update) {
        if (caveContext && obj instanceof Projectile) {
            obj.update(caveContext);
        } else if (obj instanceof Enemy && typeof cave !== 'undefined') {
            // Enemies need the cave and player objects
            obj.update(cave, player);
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

// Create an explosion at the given position
function createExplosion(x, y, type) {
  // Determine explosion parameters based on type
  let count, colorH, colorS, colorB;
  if (type === 'wall') {
    count = EXPLOSION_PARTICLE_COUNT_TORPEDO_WALL;
    colorH = EXPLOSION_PARTICLE_COLOR_H_WALL;
    colorS = EXPLOSION_PARTICLE_COLOR_S_WALL;
    colorB = EXPLOSION_PARTICLE_COLOR_B_WALL;
  } else if (type === 'enemy') {
    count = EXPLOSION_PARTICLE_COUNT_TORPEDO_ENEMY;
    colorH = EXPLOSION_PARTICLE_COLOR_H_ENEMY;
    colorS = EXPLOSION_PARTICLE_COLOR_S_ENEMY;
    colorB = EXPLOSION_PARTICLE_COLOR_B_ENEMY;
  } else {
    count = EXPLOSION_PARTICLE_COUNT_TORPEDO_WALL; // Default
    colorH = EXPLOSION_PARTICLE_COLOR_H_WALL;
    colorS = EXPLOSION_PARTICLE_COLOR_S_WALL;
    colorB = EXPLOSION_PARTICLE_COLOR_B_WALL;
  }
  
  // Create particles in all directions
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let speed = random(EXPLOSION_PARTICLE_SPEED_MIN, EXPLOSION_PARTICLE_SPEED_MAX);
    let velX = cos(angle) * speed;
    let velY = sin(angle) * speed;
    
    particles.push(new Particle(
      x, y, velX, velY,
      random(EXPLOSION_PARTICLE_MAX_LIFESPAN * 0.6, EXPLOSION_PARTICLE_MAX_LIFESPAN),
      EXPLOSION_PARTICLE_MIN_SIZE,
      EXPLOSION_PARTICLE_MAX_SIZE,
      colorH, colorS, colorB,
      EXPLOSION_PARTICLE_ALPHA_MAX
    ));
  }
}

// Sound functionality
function setupSounds() {
  if (audioInitialized) return;

  // Sonar ping
  sonarOsc = new p5.Oscillator('sine');
  sonarEnv = new p5.Envelope();
  sonarEnv.setADSR(SONAR_ENV_ADSR.aT, SONAR_ENV_ADSR.dT, SONAR_ENV_ADSR.sR, SONAR_ENV_ADSR.rT);
  sonarEnv.setRange(SONAR_ENV_LEVELS.aL, SONAR_ENV_LEVELS.rL);
  sonarOsc.amp(sonarEnv);
  sonarOsc.freq(SONAR_FREQ);
  
  // Wall explosion (torpedo hits wall)
  explosionNoise = new p5.Noise('white');
  explosionEnv = new p5.Envelope();
  explosionEnv.setADSR(EXPLOSION_NOISE_ENV_ADSR.aT, EXPLOSION_NOISE_ENV_ADSR.dT, EXPLOSION_NOISE_ENV_ADSR.sR, EXPLOSION_NOISE_ENV_ADSR.rT);
  explosionEnv.setRange(EXPLOSION_NOISE_ENV_LEVELS.aL, EXPLOSION_NOISE_ENV_LEVELS.rL);
  explosionNoise.amp(explosionEnv);
  
  // Wall explosion bass hit
  explosionBoomOsc = new p5.Oscillator('sine');
  explosionBoomEnv = new p5.Envelope();
  explosionBoomEnv.setADSR(EXPLOSION_BOOM_ENV_ADSR.aT, EXPLOSION_BOOM_ENV_ADSR.dT, EXPLOSION_BOOM_ENV_ADSR.sR, EXPLOSION_BOOM_ENV_ADSR.rT);
  explosionBoomEnv.setRange(EXPLOSION_BOOM_ENV_LEVELS.aL, EXPLOSION_BOOM_ENV_LEVELS.rL);
  explosionBoomOsc.amp(explosionBoomEnv);
  explosionBoomOsc.freq(random(EXPLOSION_BOOM_MIN_FREQ, EXPLOSION_BOOM_MAX_FREQ));
  
  // Wall explosion deeper bass
  explosionBassOsc = new p5.Oscillator('sine');
  explosionBassEnv = new p5.Envelope();
  explosionBassEnv.setADSR(EXPLOSION_BASS_ENV_ADSR.aT, EXPLOSION_BASS_ENV_ADSR.dT, EXPLOSION_BASS_ENV_ADSR.sR, EXPLOSION_BASS_ENV_ADSR.rT);
  explosionBassEnv.setRange(EXPLOSION_BASS_ENV_LEVELS.aL, EXPLOSION_BASS_ENV_LEVELS.rL);
  explosionBassOsc.amp(explosionBassEnv);
  explosionBassOsc.freq(random(EXPLOSION_BASS_MIN_FREQ, EXPLOSION_BASS_MAX_FREQ));
  
  // Creature explosion (torpedo hits enemy)
  creatureExplosionNoise = new p5.Noise('white');
  creatureExplosionEnv = new p5.Envelope();
  creatureExplosionEnv.setADSR(CREATURE_EXPLOSION_NOISE_ENV_ADSR.aT, CREATURE_EXPLOSION_NOISE_ENV_ADSR.dT, CREATURE_EXPLOSION_NOISE_ENV_ADSR.sR, CREATURE_EXPLOSION_NOISE_ENV_ADSR.rT);
  creatureExplosionEnv.setRange(CREATURE_EXPLOSION_NOISE_ENV_LEVELS.aL, CREATURE_EXPLOSION_NOISE_ENV_LEVELS.rL);
  creatureExplosionNoise.amp(creatureExplosionEnv);
  
  // Creature explosion mid hit
  creatureExplosionBoomOsc = new p5.Oscillator('sine');
  creatureExplosionBoomEnv = new p5.Envelope();
  creatureExplosionBoomEnv.setADSR(CREATURE_EXPLOSION_BOOM_ENV_ADSR.aT, CREATURE_EXPLOSION_BOOM_ENV_ADSR.dT, CREATURE_EXPLOSION_BOOM_ENV_ADSR.sR, CREATURE_EXPLOSION_BOOM_ENV_ADSR.rT);
  creatureExplosionBoomEnv.setRange(CREATURE_EXPLOSION_BOOM_ENV_LEVELS.aL, CREATURE_EXPLOSION_BOOM_ENV_LEVELS.rL);
  creatureExplosionBoomOsc.amp(creatureExplosionBoomEnv);
  creatureExplosionBoomOsc.freq(random(CREATURE_EXPLOSION_BOOM_MIN_FREQ, CREATURE_EXPLOSION_BOOM_MAX_FREQ));
  
  // Creature explosion bass
  creatureExplosionBassOsc = new p5.Oscillator('sine');
  creatureExplosionBassEnv = new p5.Envelope();
  creatureExplosionBassEnv.setADSR(CREATURE_EXPLOSION_BASS_ENV_ADSR.aT, CREATURE_EXPLOSION_BASS_ENV_ADSR.dT, CREATURE_EXPLOSION_BASS_ENV_ADSR.sR, CREATURE_EXPLOSION_BASS_ENV_ADSR.rT);
  creatureExplosionBassEnv.setRange(CREATURE_EXPLOSION_BASS_ENV_LEVELS.aL, CREATURE_EXPLOSION_BASS_ENV_LEVELS.rL);
  creatureExplosionBassOsc.amp(creatureExplosionBassEnv);
  creatureExplosionBassOsc.freq(random(CREATURE_EXPLOSION_BASS_MIN_FREQ, CREATURE_EXPLOSION_BASS_MAX_FREQ));
  
  // Bump sound
  bumpOsc = new p5.Oscillator('triangle');
  bumpEnv = new p5.Envelope();
  bumpEnv.setADSR(BUMP_ENV_ADSR.aT, BUMP_ENV_ADSR.dT, BUMP_ENV_ADSR.sR, BUMP_ENV_ADSR.rT);
  bumpEnv.setRange(BUMP_ENV_LEVELS.aL, BUMP_ENV_LEVELS.rL);
  bumpOsc.amp(bumpEnv);
  bumpOsc.freq(BUMP_FREQ);

  // Torpedo firing sound
  torpedoNoise = new p5.Noise('pink');
  torpedoEnv = new p5.Envelope();
  torpedoEnv.setADSR(TORPEDO_ENV_ADSR.aT, TORPEDO_ENV_ADSR.dT, TORPEDO_ENV_ADSR.sR, TORPEDO_ENV_ADSR.rT);
  torpedoEnv.setRange(TORPEDO_ENV_LEVELS.aL, TORPEDO_ENV_LEVELS.rL);
  torpedoNoise.amp(torpedoEnv);
  
  // Low air warning
  lowAirOsc = new p5.Oscillator('sine');
  lowAirEnv = new p5.Envelope();
  lowAirEnv.setADSR(LOW_AIR_ENV_ADSR.aT, LOW_AIR_ENV_ADSR.dT, LOW_AIR_ENV_ADSR.sR, LOW_AIR_ENV_ADSR.rT);
  lowAirEnv.setRange(LOW_AIR_ENV_LEVELS.aL, LOW_AIR_ENV_LEVELS.rL);
  
  // Powerup sound
  powerupOsc = new p5.Oscillator('triangle');
  powerupEnv = new p5.Envelope();
  powerupEnv.setADSR(POWERUP_ENV_ADSR.aT, POWERUP_ENV_ADSR.dT, POWERUP_ENV_ADSR.sR, POWERUP_ENV_ADSR.rT);
  powerupEnv.setRange(POWERUP_ENV_LEVELS.aL, POWERUP_ENV_LEVELS.rL);
  powerupOsc.amp(powerupEnv); // Connect the envelope to the oscillator
  lowAirOsc.amp(lowAirEnv);
  lowAirOsc.freq(LOW_AIR_FREQ);
  
  // Current flow sound
  currentFlowNoise = new p5.Noise('brown');
  currentFlowNoiseEnv = new p5.Envelope();
  currentFlowNoiseEnv.setADSR(CURRENT_FLOW_NOISE_ENV_ADSR.aT, CURRENT_FLOW_NOISE_ENV_ADSR.dT, CURRENT_FLOW_NOISE_ENV_ADSR.sR, CURRENT_FLOW_NOISE_ENV_ADSR.rT);
  currentFlowNoiseEnv.setRange(CURRENT_FLOW_NOISE_ENV_LEVELS.aL, CURRENT_FLOW_NOISE_ENV_LEVELS.rL);
  currentFlowNoise.amp(currentFlowNoiseEnv);
  
  // Current flow bass sound
  currentFlowBassOsc = new p5.Oscillator('sine');
  currentFlowBassEnv = new p5.Envelope();
  currentFlowBassEnv.setADSR(CURRENT_FLOW_BASS_ENV_ADSR.aT, CURRENT_FLOW_BASS_ENV_ADSR.dT, CURRENT_FLOW_BASS_ENV_ADSR.sR, CURRENT_FLOW_BASS_ENV_ADSR.rT);
  currentFlowBassEnv.setRange(CURRENT_FLOW_BASS_ENV_LEVELS.aL, CURRENT_FLOW_BASS_ENV_LEVELS.rL);
  currentFlowBassOsc.amp(currentFlowBassEnv);
  currentFlowBassOsc.freq(random(CURRENT_FLOW_BASS_MIN_FREQ, CURRENT_FLOW_BASS_MAX_FREQ));
  
  // Creature growl sound
  creatureGrowlOsc = new p5.Oscillator('sawtooth');
  creatureGrowlEnv = new p5.Envelope();
  creatureGrowlEnv.setADSR(CREATURE_GROWL_ENV_ADSR.aT, CREATURE_GROWL_ENV_ADSR.dT, CREATURE_GROWL_ENV_ADSR.sR, CREATURE_GROWL_ENV_ADSR.rT);
  creatureGrowlEnv.setRange(CREATURE_GROWL_ENV_LEVELS.aL, CREATURE_GROWL_ENV_LEVELS.rL);
  creatureGrowlOsc.amp(creatureGrowlEnv);
  
  // Reactor hum sound
  reactorHumOsc = new p5.Oscillator('sine');
  reactorHumEnv = new p5.Envelope();
  reactorHumEnv.setADSR(REACTOR_HUM_ENV_ADSR.aT, REACTOR_HUM_ENV_ADSR.dT, REACTOR_HUM_ENV_ADSR.sR, REACTOR_HUM_ENV_ADSR.rT);
  reactorHumEnv.setRange(REACTOR_HUM_ENV_LEVELS.aL, REACTOR_HUM_ENV_LEVELS.rL);
  reactorHumOsc.amp(reactorHumEnv);
  reactorHumOsc.freq(REACTOR_HUM_FREQ);
  reactorHumOsc.start(); // Continuous sound, just change amplitude
  
  // Game over death sounds
  gameOverImpactNoise = new p5.Noise('white');
  gameOverImpactEnv = new p5.Envelope();
  gameOverImpactEnv.setADSR(GAME_OVER_IMPACT_ENV_ADSR.aT, GAME_OVER_IMPACT_ENV_ADSR.dT, GAME_OVER_IMPACT_ENV_ADSR.sR, GAME_OVER_IMPACT_ENV_ADSR.rT);
  gameOverImpactEnv.setRange(GAME_OVER_IMPACT_ENV_LEVELS.aL, GAME_OVER_IMPACT_ENV_LEVELS.rL);
  gameOverImpactNoise.amp(gameOverImpactEnv);
  
  gameOverGroanOsc = new p5.Oscillator('sawtooth');
  gameOverGroanEnv = new p5.Envelope();
  gameOverGroanEnv.setADSR(GAME_OVER_GROAN_ENV_ADSR.aT, GAME_OVER_GROAN_ENV_ADSR.dT, GAME_OVER_GROAN_ENV_ADSR.sR, GAME_OVER_GROAN_ENV_ADSR.rT);
  gameOverGroanEnv.setRange(GAME_OVER_GROAN_ENV_LEVELS.aL, GAME_OVER_GROAN_ENV_LEVELS.rL);
  gameOverGroanOsc.amp(gameOverGroanEnv);
  gameOverGroanOsc.freq(random(GAME_OVER_GROAN_MIN_FREQ, GAME_OVER_GROAN_MAX_FREQ));
  
  gameOverFinalBoomNoise = new p5.Noise('brown');
  gameOverFinalBoomEnv = new p5.Envelope();
  gameOverFinalBoomEnv.setADSR(GAME_OVER_FINAL_BOOM_ENV_ADSR.aT, GAME_OVER_FINAL_BOOM_ENV_ADSR.dT, GAME_OVER_FINAL_BOOM_ENV_ADSR.sR, GAME_OVER_FINAL_BOOM_ENV_ADSR.rT);
  gameOverFinalBoomEnv.setRange(GAME_OVER_FINAL_BOOM_ENV_LEVELS.aL, GAME_OVER_FINAL_BOOM_ENV_LEVELS.rL);
  gameOverFinalBoomNoise.amp(gameOverFinalBoomEnv);
  
  // Start all oscillators and noises (they won't play until triggered)
  sonarOsc.start(); bumpOsc.start(); lowAirOsc.start(); powerupOsc.start();
  explosionNoise.start(); explosionBoomOsc.start(); explosionBassOsc.start();
  creatureExplosionNoise.start(); creatureExplosionBoomOsc.start(); creatureExplosionBassOsc.start();
  torpedoNoise.start();
  currentFlowNoise.start(); currentFlowBassOsc.start();
  creatureGrowlOsc.start();
  gameOverImpactNoise.start(); gameOverGroanOsc.start(); gameOverFinalBoomNoise.start();
  
  audioInitialized = true;
}

function playSound(soundType) {
  if (!audioInitialized) return;
  
  switch(soundType) {
    case 'sonar':
      sonarOsc.freq(SONAR_FREQ);
      sonarEnv.play();
      break;
    case 'explosion': // Wall explosion
      explosionNoise.pan(random(-0.2, 0.2)); // Random stereo positioning
      explosionEnv.play();
      explosionBoomOsc.freq(random(EXPLOSION_BOOM_MIN_FREQ, EXPLOSION_BOOM_MAX_FREQ));
      explosionBoomEnv.play();
      explosionBassOsc.freq(random(EXPLOSION_BASS_MIN_FREQ, EXPLOSION_BASS_MAX_FREQ));
      explosionBassEnv.play();
      break;
    case 'creatureExplosion': // Enemy explosion
      creatureExplosionNoise.pan(random(-0.3, 0.3)); // More random stereo positioning for variety
      creatureExplosionEnv.play();
      creatureExplosionBoomOsc.freq(random(CREATURE_EXPLOSION_BOOM_MIN_FREQ, CREATURE_EXPLOSION_BOOM_MAX_FREQ));
      creatureExplosionBoomEnv.play();
      creatureExplosionBassOsc.freq(random(CREATURE_EXPLOSION_BASS_MIN_FREQ, CREATURE_EXPLOSION_BASS_MAX_FREQ));
      creatureExplosionBassEnv.play();
      break;
    case 'bump':
      bumpOsc.freq(BUMP_FREQ + random(-20, 20)); // Slight variation
      bumpEnv.play();
      break;
    case 'torpedo':
      torpedoNoise.pan(random(-0.2, 0.2)); // Random stereo positioning
      torpedoEnv.play();
      break;
    case 'lowAir':
      if (millis() - lastLowAirBeepTime > LOW_AIR_BEEP_INTERVAL) {
        lowAirOsc.freq(LOW_AIR_FREQ);
        lowAirEnv.play();
        lastLowAirBeepTime = millis();
      }
      break;
      
    case 'powerup':
      // Rising pitch sound for powerup
      powerupOsc.freq(POWERUP_START_FREQ);
      powerupEnv.play();
      // Use a setTimeout to create rising pitch effect with a safely bounded callback
      let startTime = Date.now();
      setTimeout(() => {
        if (Date.now() - startTime < 500) { // Only change pitch if within reasonable time
          powerupOsc.freq(POWERUP_END_FREQ);
        }
      }, 100);
      break;
    case 'currentFlow':
      currentFlowNoiseEnv.play();
      currentFlowBassOsc.freq(random(CURRENT_FLOW_BASS_MIN_FREQ, CURRENT_FLOW_BASS_MAX_FREQ));
      currentFlowBassEnv.play();
      break;
    case 'creatureGrowl':
      creatureGrowlOsc.freq(random(CREATURE_GROWL_MIN_FREQ, CREATURE_GROWL_MAX_FREQ));
      creatureGrowlEnv.play();
      break;
    case 'gameOverImpact':
      gameOverImpactEnv.play();
      break;
    case 'gameOverGroan':
      gameOverGroanOsc.freq(random(GAME_OVER_GROAN_MIN_FREQ, GAME_OVER_GROAN_MAX_FREQ));
      gameOverGroanEnv.play();
      setTimeout(() => {
        // Start pitching down the groan
        let startFreq = gameOverGroanOsc.getFreq();
        let targetFreq = GAME_OVER_GROAN_PITCH_DOWN_TARGET_FREQ;
        let startTime = millis();
        let pitchDownDuration = GAME_OVER_GROAN_PITCH_DOWN_TIME * 1000; // Convert to milliseconds
        
        function updatePitch() {
          let elapsed = millis() - startTime;
          let t = elapsed / pitchDownDuration;
          if (t < 1) {
            let currentFreq = startFreq + (targetFreq - startFreq) * t;
            gameOverGroanOsc.freq(currentFreq);
            setTimeout(updatePitch, 50); // Update every 50ms
          }
        }
        
        setTimeout(updatePitch, GAME_OVER_GROAN_PITCH_DOWN_DELAY * 1000);
      }, GAME_OVER_GROAN_DELAY_MS);
      break;
    case 'gameOverFinalBoom':
      gameOverFinalBoomEnv.play();
      break;
  }
}

// p5.js core functions

function preload() {
  // Load custom font
  customFont = loadFont('Berpatroli.otf');
  
  // Initialize high score element 
  highscoreInputElement = document.getElementById('highscoreInput');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255);
  
  // Set custom font if loaded, otherwise fallback to monospace
  if (customFont) {
    textFont(customFont);
  } else {
    textFont('monospace');
  }
  
  // Initialize sounds when audioContext is available
  setupSounds();
  
  // Create ModPlayer with our audio context
  modPlayer = new window.ModPlayer(getAudioContext());
  
  // Load and play the background music (start.mod)
  loadBackgroundMusic();
  
  // Initialize controls
  // Function to initialize both mobile and gamepad controls
  function setupControls() {
    // Initialize mobile controls if available
    if (typeof initMobileControls === 'function') {
      initMobileControls();
    }
    
    // Gamepad controls are initialized via event listeners in the gamepadControls.js file
    // No explicit initialization needed as it's handled by the event listeners
  }
  
  setupControls();

  // Rest of setup...
  resetGame();
  
  // Hide loading overlay once setup is complete
  document.getElementById('loadingOverlay').style.display = 'none';
}

// Function to load and play the background music
async function loadBackgroundMusic() {
  try {
    console.log("Loading background music...");
    
    // Create audio context if it doesn't exist
    if (!getAudioContext()) {
      console.log("Creating audio context for MOD player");
      try {
        userStartAudio(); // Try to start audio context with p5.js helper
      } catch (e) {
        console.warn("userStartAudio failed:", e);
        // Try to create audio context directly if p5 fails
        getAudioContext().resume().catch(err => console.error("Failed to resume audio context:", err));
      }
    }
    
    if (!modPlayer) {
      console.log("Creating ModPlayer instance");
      if (!window.ModPlayer) {
        console.error("ModPlayer not found in window object!");
        // Try to reload the ModPlayer script
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'ModPlayer.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
          console.log("Attempting to reload ModPlayer.js");
        }).catch(err => console.error("Failed to reload ModPlayer.js:", err));
        
        // Try again after reloading
        if (window.ModPlayer) {
          modPlayer = new window.ModPlayer(getAudioContext());
        } else {
          throw new Error("ModPlayer still not available after reload attempt");
        }
      } else {
        modPlayer = new window.ModPlayer(getAudioContext());
      }
    }
    
    // Load the MOD file
    console.log("Fetching start.mod file");
    const response = await fetch('start.mod');
    if (!response.ok) {
      throw new Error(`Failed to load MOD file: ${response.status} ${response.statusText}`);
    }
    
    const modData = await response.arrayBuffer();
    console.log("MOD file loaded, size:", modData.byteLength, "bytes");
    
    // Load the MOD data into the player
    console.log("Loading MOD data into player");
    await modPlayer.load(modData);
    
    // Set initial volume based on game state
    if (gameState === 'playing') {
      modPlayer.setVolume(0.3);
    } else {
      modPlayer.setVolume(0.5);
    }
    
    // Start playback
    console.log("Starting MOD playback");
    const playResult = await modPlayer.play();
    console.log("Playback result:", playResult);
    
  } catch (error) {
    console.error("Error loading background music:", error);
  }
}

function resetGame() {
  currentLevel = 1;
  totalScore = 0;
  resetLevel();
  // For events that shouldn't reset between levels, but should for new games
  enemies = [];
  projectiles = [];
  sonarBubbles = [];
  particles = [];
  
  // Reset highscore-related variables
  isHighScoreChecked = false;
  isSubmittingHighScore = false;
  playerNameInput = '';
  isHighScoreResult = false;
  isSubmissionInProgress = false;
  
  // Reset game state to start
  gameState = 'start';
}

function resetLevel() {
  // Reset game objects
  enemies = [];
  projectiles = [];
  sonarBubbles = [];
  particles = [];
  powerups = [];
  currentAreas = [];
  enemiesKilledThisLevel = 0; // Reset enemy kill counter for this level
  levelScore = 0; // Reset level score
  
  // Set the cell size based on level
  currentCellSize = BASE_CELL_SIZE;
  
  // Generate cave with the current cell size
  cave = new Cave(WORLD_WIDTH, WORLD_HEIGHT, currentCellSize);
  
  // Create the player sub
  let initialAirSupply = Math.max(
    INITIAL_AIR_SUPPLY_BASE - (currentLevel * AIR_SUPPLY_LEVEL_REDUCTION),
    MIN_AIR_SUPPLY_PER_LEVEL
  );
  
  let airDepletionRate = BASE_AIR_DEPLETION_RATE + (currentLevel - 1) * AIR_DEPLETION_LEVEL_INCREASE;
  
  // Find a valid spawn position for the player
  let spawnX = BASE_CELL_SIZE * PLAYER_START_X_BASE_CELLS;
  let spawnY = cave.worldHeight / 2;
  let attempt = 0;
  
  while (attempt < MAX_PLAYER_SPAWN_ATTEMPTS) {
    let searchY = cave.worldHeight / 2 + random(-PLAYER_START_Y_RANDOM_RANGE_CELLS, PLAYER_START_Y_RANDOM_RANGE_CELLS) * cave.cellSize;
    
    if (!cave.isWall(spawnX, searchY, PLAYER_RADIUS * PLAYER_COLLISION_RADIUS_FACTOR)) {
      spawnY = searchY;
      break;
    }
    
    // Try moving further right
    spawnX += cave.cellSize * PLAYER_START_X_ATTEMPT_INCREMENT_CELLS;
    
    // If we've gone too far, stop
    if (spawnX > cave.worldWidth * PLAYER_SPAWN_MAX_X_SEARCH_FACTOR) {
      console.warn('Could not find valid player spawn position');
      spawnX = BASE_CELL_SIZE * PLAYER_START_X_BASE_CELLS;
      spawnY = cave.worldHeight / 2; // Fallback to center
      break;
    }
    
    attempt++;
  }
  
  // Create player with the found position
  player = new PlayerSub(spawnX, spawnY, initialAirSupply, airDepletionRate);
  
  // Initialize camera position centered on player
  cameraOffsetX = player.pos.x - width / 2;
  cameraOffsetY = player.pos.y - height / 2;
  
  // Spawn enemies based on level
  function spawnEnemies() {
    enemies = [];
    // Calculate enemy count based on level
    let enemyCount = BASE_ENEMY_COUNT + (currentLevel - 1) * ENEMY_COUNT_PER_LEVEL_INCREASE;
    enemyCount = min(enemyCount, MAX_ENEMY_COUNT); // Cap enemy count
    
    for (let i = 0; i < enemyCount; i++) {
      let enemyX, enemyY, eAttempts = 0;
      do { // Try to spawn enemy in a clear area
        enemyX = random(WORLD_WIDTH * ENEMY_SPAWN_MIN_X_WORLD_FACTOR, WORLD_WIDTH * ENEMY_SPAWN_MAX_X_WORLD_FACTOR);
        enemyY = random(WORLD_HEIGHT * ENEMY_SPAWN_MIN_Y_WORLD_FACTOR, WORLD_HEIGHT * ENEMY_SPAWN_MAX_Y_WORLD_FACTOR); 
        eAttempts++;
      } while (cave.isWall(enemyX, enemyY, ENEMY_SPAWN_WALL_CHECK_RADIUS) && eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS);
      
      if (eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS) {
        enemies.push(new Enemy(enemyX, enemyY));
      }
    }
    
    // Spawn jellyfish - 1 on level 1, +1 each level
    jellyfish = [];
    let jellyfishCount = currentLevel; // 1 on level 1, 2 on level 2, etc.
    
    for (let i = 0; i < jellyfishCount; i++) {
      let jellyfishX, jellyfishY, jAttempts = 0;
      do { // Try to spawn jellyfish in a clear area, away from player
        jellyfishX = random(WORLD_WIDTH * 0.3, WORLD_WIDTH * 0.9); // Spawn in middle to right area
        jellyfishY = random(WORLD_HEIGHT * 0.2, WORLD_HEIGHT * 0.8);
        jAttempts++;
      } while (cave.isWall(jellyfishX, jellyfishY, JELLYFISH_RADIUS + 10) && jAttempts < MAX_ENEMY_SPAWN_ATTEMPTS);
      
      if (jAttempts < MAX_ENEMY_SPAWN_ATTEMPTS) {
        // Make sure jellyfish isn't too close to player start
        let distFromPlayer = dist(jellyfishX, jellyfishY, player.pos.x, player.pos.y);
        if (distFromPlayer > 150) { // Minimum distance from player
          jellyfish.push(new Jellyfish(jellyfishX, jellyfishY));
        }
      }
    }
  }
  
  spawnEnemies();
  
  // Create current areas
  function generateCurrentAreas() {
    currentAreas = []; // Clear existing areas
    
    for (let i = 0; i < CURRENT_AREAS_PER_LEVEL; i++) {
      let attempts = 0;
      let areaX, areaY, areaWidth, areaHeight;
      let validArea = false;
      
      while (!validArea && attempts < 50) {
        // Random dimensions
        areaWidth = random(CURRENT_AREA_MIN_WIDTH, CURRENT_AREA_MAX_WIDTH);
        areaHeight = random(CURRENT_AREA_MIN_HEIGHT, CURRENT_AREA_MAX_HEIGHT);
        
        // Random position, avoiding player start and goal areas
        areaX = random(CURRENT_AREA_PADDING_FROM_PLAYER_START, 
                      WORLD_WIDTH - areaWidth - CURRENT_AREA_PADDING_FROM_GOAL);
        areaY = random(areaHeight / 2, WORLD_HEIGHT - areaHeight / 2);
        
        // Check if the area is mostly in open water
        let openCells = 0;
        let totalCells = 0;
        let checkStep = 20; // Check every 20 pixels for performance
        
        for (let checkX = areaX; checkX < areaX + areaWidth; checkX += checkStep) {
          for (let checkY = areaY; checkY < areaY + areaHeight; checkY += checkStep) {
            totalCells++;
            if (!cave.isWall(checkX, checkY)) {
              openCells++;
            }
          }
        }
        
        // Area is valid if at least 70% is open water
        if (totalCells > 0 && (openCells / totalCells) > 0.7) {
          validArea = true;
        }
        
        attempts++;
      }
      
      if (validArea) {
        // Create a current area with random force direction
        let angle = random(TWO_PI);
        let force = random(CURRENT_FORCE_MAGNITUDE_MIN, CURRENT_FORCE_MAGNITUDE_MAX);
        let forceVector = p5.Vector.fromAngle(angle);
        
        // Create a proper CurrentArea instance
        currentAreas.push(new CurrentArea(
          areaX,
          areaY,
          areaWidth,
          areaHeight,
          forceVector,
          force
        ));
      }
    }
  }
  
  generateCurrentAreas();
  
  // Reset variables
  keys = {
    up: false, down: false, left: false, right: false, space: false, shift: false
  };
}

function draw() {
  // Update input from gamepad if available
  if (typeof updateGamepadInput === 'function') {
    updateGamepadInput();
  }
  
  // Game state machine
  switch (gameState) {
    case 'start':
      drawStartScreen();
      break;
    case 'highScores':
      drawHighScoreScreen();
      break;
    case 'playing':
      updateGame();
      drawGame();
      break;
    case 'levelComplete':
      drawLevelCompleteScreen();
      break;
    case 'gameOver':
      drawGameOverScreen();
      break;
    case 'gameComplete':
      drawGameCompleteScreen();
      break;
    case 'loading':
      break; // Loading overlay is handled separately
  }
}

// Keyboard event handlers
function keyPressed() {
  // Start audio on Enter press from any game state if not already started
  if (keyCode === ENTER) {
    // Start audio if needed
    if (!audioInitialized) {
      console.log("Starting audio routine on ENTER key");
      startAudioRoutine();
    }
    
    // Make sure music is playing when starting from these screens
    if ((gameState === 'start' || gameState === 'highScores' || gameState === 'gameOver' || gameState === 'gameComplete')) {
      if (!modPlayer || !modPlayer.playing) {
        console.log("Starting music on ENTER key from", gameState);
        loadBackgroundMusic();
      }
    }
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
    // Transition from start screen to high scores
    gameState = 'highScores';
    highScores = null; // Reset to show loading
    
    // Slightly increase volume for highscores screen
    if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0.4, 1000);
    }
    
    // Load high scores asynchronously
    highScoreManager.getHighScores().then(scores => {
      highScores = scores;
    }).catch(error => {
      console.error('Failed to load high scores:', error);
      highScores = []; // Set to empty array on error
    });
  } else if (gameState === 'highScores' && keyCode === ENTER) {
    // Transition from high scores to game
    gameState = 'loading';
    showLoadingOverlay("GENERATING LEVEL");
    
    // Fade down music for gameplay
    if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0.3, 1000);
    }
    
    // Use setTimeout to allow loading screen to render
    setTimeout(() => {
      initGameObjects();
      player.health = PLAYER_INITIAL_HEALTH; 
      player.airSupply = player.initialAirSupply; // Reset to full for new game
      player.lastSonarTime = frameCount - player.sonarCooldown; // Allow immediate sonar
      player.lastShotTime = frameCount - player.shotCooldown;   // Allow immediate shot
      gameState = 'playing';
    }, 100); // Small delay to allow loading screen to render
  } else if (gameState === 'gameOver' && keyCode === ENTER) {
    if (isSubmittingHighScore && playerNameInput.trim().length > 0 && !isSubmissionInProgress) {
      // Submit the high score
      submitHighScore();
    } else if (!isSubmittingHighScore) {
      // Reset game state variables
      isHighScoreChecked = false;
      isSubmittingHighScore = false;
      playerNameInput = '';
      isHighScoreResult = false;
      isSubmissionInProgress = false;
      
      resetGame();
      // Game state is already set to 'start' in resetGame()
      
      // Restart music if it's stopped
      if (modPlayer && !modPlayer.playing) {
        loadBackgroundMusic();
      } else if (modPlayer && modPlayer.playing) {
        modPlayer.fadeVolume(0.5, 1000); // Restore volume
      }
    }
  } else if (gameState === 'gameComplete' && keyCode === ENTER) {
    resetGame();
    gameState = 'start'; // Return to start screen
    
    // Restart music if it's stopped
    if (modPlayer && !modPlayer.playing) {
      loadBackgroundMusic();
    } else if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0.5, 1000); // Restore volume
    }
  } else if (gameState === 'levelComplete' && keyCode === ENTER) {
    prepareNextLevel();
    
    // Adjust music volume for next level
    if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0.3, 1000);
    }
  }
}

function keyTyped() {
  // Handle name input for high score submission
  if (gameState === 'gameOver' && isSubmittingHighScore) {
    if (key.length === 1 && key.match(/[a-zA-Z0-9 ]/)) {
      // Allow letters, numbers, and spaces
      if (playerNameInput.length < 20) { // Limit name length
        playerNameInput += key;
      }
    }
  }
}

function keyReleased() {
  // Handle backspace for name input
  if (gameState === 'gameOver' && isSubmittingHighScore) {
    if (keyCode === BACKSPACE && playerNameInput.length > 0) {
      playerNameInput = playerNameInput.slice(0, -1);
      return false; // Prevent default behavior
    }
  }
}

// Key code constants
const KEY_CODE_SPACE = 32;
const KEY_CODE_W = 87;
const KEY_CODE_S = 83;
const KEY_CODE_A = 65;
const KEY_CODE_D = 68;

// Audio initialization function
function startAudioRoutine() {
  if (audioInitialized) return;
  
  // Try to start audio
  if (getAudioContext()) {
    let ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => { 
        audioInitialized = true; 
        setupSounds();
        
        // Play background music if it's not already playing
        if (modPlayer && !modPlayer.playing) {
          console.log("Starting music after audio context resumed");
          loadBackgroundMusic();
        }
        
        console.log("Audio context resumed successfully");
      });
    } else if (ctx && ctx.state === 'running') { 
      audioInitialized = true; 
      setupSounds();
      
      // Play background music if it's not already playing
      if (modPlayer && !modPlayer.playing) {
        console.log("Starting music with already running audio context");
        loadBackgroundMusic();
      }
      
      console.log("Audio context already running");
    }
  }
}

// Prepare next level
function prepareNextLevel() {
  currentLevel++;
  if (currentLevel > MAX_LEVELS) {
    gameState = 'gameComplete';
    
    // Adjust music for game completion
    if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0.7, 2000); // Celebratory volume
      
      // Optionally could load a different mod file for victory
      // But we'll stick with volume change for now
    }
    
    return;
  }
  
  gameState = 'loading';
  showLoadingOverlay("GENERATING LEVEL " + currentLevel);
  
  // Adjust music for loading screen
  if (modPlayer && modPlayer.playing) {
    modPlayer.fadeVolume(0.4, 500); // Slightly louder during loading
  }
  
  // Use setTimeout to allow loading screen to render
  setTimeout(() => {
    resetLevel();
    gameState = 'playing';
    
    // Adjust music for gameplay
    if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0.3, 500); // Lower during gameplay for concentration
    }
  }, 100);
}

// Show loading overlay
function showLoadingOverlay(message) {
  let overlay = document.getElementById('loadingOverlay');
  let text = document.getElementById('loadingText');
  
  if (overlay && text) {
    text.innerText = message;
    overlay.style.display = 'flex';
  }
}

// Hide loading overlay
function hideLoadingOverlay() {
  let overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Screen drawing functions
function drawStartScreen() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);

  // Animate submarine
  let subX = width / 2;
  let subY = height / 2 + START_SCREEN_TITLE_Y_OFFSET - 80;
  
  push();
  translate(subX, subY);
  
  // Create a temporary submarine object for rendering
  let tempSub = {
    radius: PLAYER_RADIUS,
    propellerAngle: startScreenPropellerAngle,
    
    _renderBody() {
      fill(PLAYER_COLOR_BODY_H, PLAYER_COLOR_BODY_S, PLAYER_COLOR_BODY_B);
      noStroke();
      ellipse(0, 0, this.radius * PLAYER_BODY_WIDTH_FACTOR, this.radius * PLAYER_BODY_HEIGHT_FACTOR);
    },
    
    _renderSail() {
      fill(PLAYER_COLOR_SAIL_H, PLAYER_COLOR_SAIL_S, PLAYER_COLOR_SAIL_B);
      rectMode(CENTER);
      rect(this.radius * PLAYER_SAIL_OFFSET_X_FACTOR, 0, this.radius * PLAYER_SAIL_WIDTH_FACTOR, this.radius * PLAYER_SAIL_HEIGHT_FACTOR, this.radius * PLAYER_SAIL_CORNER_RADIUS_FACTOR);
      rectMode(CORNER); // Reset rectMode
    },
    
    _renderFin() {
      fill(PLAYER_COLOR_FIN_H, PLAYER_COLOR_FIN_S, PLAYER_COLOR_FIN_B);
      beginShape();
      vertex(-this.radius * PLAYER_FIN_X1_FACTOR, -this.radius * PLAYER_FIN_Y1_FACTOR);
      vertex(-this.radius * PLAYER_FIN_X2_FACTOR, this.radius * PLAYER_FIN_Y2_FACTOR);
      vertex(-this.radius * PLAYER_FIN_X3_FACTOR, this.radius * PLAYER_FIN_Y3_FACTOR);
      vertex(-this.radius * PLAYER_FIN_X4_FACTOR, -this.radius * PLAYER_FIN_Y4_FACTOR);
      endShape(CLOSE);
    },
    
    _renderPropeller() {
      push();
      translate(this.radius * PLAYER_PROPELLER_X_OFFSET_FACTOR, 0); // Position propeller at the back
      
      fill(PLAYER_COLOR_PROPELLER_H, PLAYER_COLOR_PROPELLER_S, PLAYER_COLOR_PROPELLER_B);
      noStroke();
      
      let apparentHeight = this.radius * PLAYER_PROPELLER_MAX_SIDE_HEIGHT_FACTOR * abs(sin(this.propellerAngle));
      let thickness = this.radius * PLAYER_PROPELLER_THICKNESS_FACTOR;
      
      rectMode(CENTER);
      rect(0, 0, thickness, apparentHeight);
      rectMode(CORNER); // Reset rectMode
      
      pop();
    }
  };
  
  // Use the same rendering methods as the in-game submarine
  tempSub._renderBody();
  tempSub._renderSail();
  tempSub._renderFin();
  tempSub._renderPropeller();
  
  pop();
  
  // Update propeller animation - use the same speed factor as in-game
  startScreenPropellerAngle += 0.2;
  
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
  fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B); 
  textSize(START_SCREEN_TITLE_TEXT_SIZE);
  text(`Reactor Dive`, width / 2, height / 2 + START_SCREEN_TITLE_Y_OFFSET);
  
  textSize(START_SCREEN_INFO_TEXT_SIZE);
  text("Christian Nold 2025", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_3);

  text(`Destroy enemies and reach the flooded reactor`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_1);
  
  // Show different control instructions based on device
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Touch controls: Joystick (left) and Fire button (right)", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_2);
  } else {
    text("WASD/Arrows: Move. SPACE: Shoot.", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_2);
  }
  
  textSize(START_SCREEN_PROMPT_TEXT_SIZE); 
  fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
  
  // Show different instructions based on whether mobile controls are active
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Tap anywhere to Dive", width / 2, height / 2 + START_SCREEN_PROMPT_Y_OFFSET);
  } else {
    text("Press ENTER to Dive", width / 2, height / 2 + START_SCREEN_PROMPT_Y_OFFSET);
  }
  
  if (!audioInitialized) {
      textSize(START_SCREEN_AUDIO_NOTE_TEXT_SIZE); 
      fill(START_SCREEN_AUDIO_NOTE_COLOR_H, START_SCREEN_AUDIO_NOTE_COLOR_S, START_SCREEN_AUDIO_NOTE_COLOR_B);
      text("(Sound will enable after you press Enter)", width/2, height/2 + START_SCREEN_AUDIO_NOTE_Y_OFFSET);
 }
}

function drawHighScoreScreen() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
  textAlign(CENTER, CENTER);
  
  // Title
  fill(0, 0, 100); // White text
  textSize(48);
  text("HIGH SCORES", width / 2, height / 2 - 200);
  
  // High scores list
  textSize(24);
  if (!highScores) {
    // Loading state
    fill(60, 100, 80); // Yellow loading text
    text("Loading scores...", width / 2, height / 2);
  } else if (highScores.length === 0) {
    // No scores yet
    fill(0, 0, 60); // Gray text
    text("No scores yet. Be the first!", width / 2, height / 2);
  } else {
    // Display scores
    fill(0, 0, 90); // Light gray for scores
    for (let i = 0; i < Math.min(highScores.length, 10); i++) {
      let score = highScores[i];
      let yPos = height / 2 - 150 + i * 30;
      text(`${i + 1}. ${score.name}: ${score.score}`, width / 2, yPos);
    }
  }
  
  // Instructions
  textSize(20);
  fill(60, 100, 100); // Yellow prompt text
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Tap to Play", width / 2, height / 2 + 200);
  } else {
    text("Press ENTER to Play", width / 2, height / 2 + 200);
  }
}

function drawLevelCompleteScreen() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
  
  textAlign(CENTER, CENTER);
  fill(LEVEL_COMPLETE_TITLE_COLOR_H, LEVEL_COMPLETE_TITLE_COLOR_S, LEVEL_COMPLETE_TITLE_COLOR_B); 
  textSize(LEVEL_COMPLETE_TITLE_TEXT_SIZE);
  text(`Level ${currentLevel} Complete!`, width / 2, height / 2 + LEVEL_COMPLETE_TITLE_Y_OFFSET);
  
  fill(255);
  textSize(LEVEL_COMPLETE_INFO_TEXT_SIZE);
  text(`Enemies Destroyed: ${enemiesKilledThisLevel}`, width / 2, height / 2 + LEVEL_COMPLETE_INFO_Y_OFFSET);
  text(`Score: ${levelScore}`, width / 2, height / 2 + LEVEL_COMPLETE_INFO_Y_OFFSET + 30);
  
  textSize(START_SCREEN_PROMPT_TEXT_SIZE); 
  fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
  text("Press ENTER to Continue", width / 2, height / 2 + LEVEL_COMPLETE_PROMPT_Y_OFFSET);
}

function drawGameCompleteScreen() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
  
  textAlign(CENTER, CENTER);
  fill(GAME_COMPLETE_TITLE_COLOR_H, GAME_COMPLETE_TITLE_COLOR_S, GAME_COMPLETE_TITLE_COLOR_B); 
  textSize(GAME_COMPLETE_TITLE_TEXT_SIZE);
  text(`Game Complete!`, width / 2, height / 2 + GAME_COMPLETE_TITLE_Y_OFFSET);
  
  fill(255);
  textSize(GAME_COMPLETE_INFO_TEXT_SIZE);
  text(`You have saved humanity`, width / 2, height / 2 + GAME_COMPLETE_INFO_Y_OFFSET);
  text(`Final Score: ${totalScore}`, width / 2, height / 2 + GAME_COMPLETE_INFO_Y_OFFSET + 30);
  
  textSize(START_SCREEN_PROMPT_TEXT_SIZE); 
  fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
  text("Press ENTER to Play Again", width / 2, height / 2 + GAME_COMPLETE_PROMPT_Y_OFFSET);
}

function drawGameOverScreen() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
  
  // Check if this is a high score (only do this once)
  if (!isHighScoreChecked) {
    isHighScoreChecked = true;
    console.log('Checking if score', totalScore, 'is a high score...');
    
    // Make sure music is stopped on game over screen
    if (modPlayer && modPlayer.playing) {
      console.log("Found music still playing on game over screen - stopping it");
      modPlayer.silence();
    }
    
    highScoreManager.isHighScore(totalScore).then(result => {
      isHighScoreResult = result;
      if (result) {
        console.log('Score qualifies as a high score!');
        isSubmittingHighScore = true;
        playerNameInput = '';
      } else {
        console.log('Score does not qualify as a high score.');
      }
    }).catch(error => {
      console.error('Error checking high score:', error);
      isHighScoreResult = false;
    });
  }
  
  textAlign(CENTER, CENTER);
  fill(GAME_OVER_TITLE_COLOR_H, GAME_OVER_TITLE_COLOR_S, GAME_OVER_TITLE_COLOR_B); 
  textSize(GAME_OVER_TITLE_TEXT_SIZE);
  text("MISSION FAILED", width/2, height/2 + GAME_OVER_TITLE_Y_OFFSET);
  
  textSize(GAME_OVER_INFO_TEXT_SIZE);
  text(player.health <= 0 ? "Submarine Destroyed!" : "Air Supply Depleted!", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET);
  text(`Total Score: ${totalScore}`, width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 30);
  
  // Handle high score submission
  if (isSubmittingHighScore) {
    // Highlight "NEW HIGH SCORE!" with a background
    push();
    fill(60, 100, 100); // Bright yellow
    textSize(GAME_OVER_INFO_TEXT_SIZE + 6); // Slightly larger
    text("NEW HIGH SCORE!", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 70);
    pop();
    
    // "Enter your name:" instruction
    fill(60, 80, 90); // Slightly dimmer yellow
    textSize(GAME_OVER_INFO_TEXT_SIZE - 2);
    text("Enter your name:", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 110);
    
    // Show mobile input field or desktop text input
    if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
      // Position the HTML input field with better spacing for mobile
      if (highscoreInputElement) {
        highscoreInputElement.style.position = 'fixed';
        highscoreInputElement.style.top = '65%'; // Moved down to avoid overlap
        highscoreInputElement.style.left = '50%';
        highscoreInputElement.style.transform = 'translate(-50%, -50%)';
        highscoreInputElement.style.opacity = '1';
        highscoreInputElement.style.pointerEvents = 'auto';
        highscoreInputElement.style.zIndex = '10000';
        highscoreInputElement.style.padding = '12px 20px';
        highscoreInputElement.style.fontSize = '20px';
        highscoreInputElement.style.textAlign = 'center';
        highscoreInputElement.style.border = '3px solid #ffff00';
        highscoreInputElement.style.borderRadius = '8px';
        highscoreInputElement.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        highscoreInputElement.style.color = '#ffff00';
        highscoreInputElement.style.boxShadow = '0 0 15px rgba(255, 255, 0, 0.5)';
        highscoreInputElement.style.outline = 'none';
        highscoreInputElement.style.minWidth = '250px';
      }
      // Instructions positioned lower to avoid overlap
      fill(60, 60, 80); // Dimmer for instructions
      textSize(GAME_OVER_INFO_TEXT_SIZE - 4);
      if (isSubmissionInProgress) {
        fill(60, 100, 100); // Bright yellow when submitting
        text("SUBMITTING SCORE...", width/2, height/2 + GAME_OVER_PROMPT_Y_OFFSET + 60);
      } else {
        text("Tap to enter name, then type", width/2, height/2 + GAME_OVER_PROMPT_Y_OFFSET + 60);
      }
    } else {
      // Desktop - show the typed name with highlighting
      push();
      // Background rectangle for the text input area
      if (isSubmissionInProgress) {
        fill(0, 0, 20, 200); // Dark background with some transparency
        stroke(60, 60, 60); // Dimmer border when submitting
      } else {
        fill(0, 0, 20, 200); // Dark background with some transparency
        stroke(60, 100, 100); // Bright yellow border
      }
      strokeWeight(2);
      rectMode(CENTER);
      let textWidth = max(200, playerNameInput.length * 12 + 40);
      rect(width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 150, textWidth, 40, 5);
      
      // The actual text input
      noStroke();
      textSize(GAME_OVER_INFO_TEXT_SIZE);
      if (isSubmissionInProgress) {
        fill(60, 60, 80); // Dimmer text when submitting
        text("SUBMITTING...", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 150);
      } else {
        fill(60, 100, 100); // Bright yellow text
        text(playerNameInput + "_", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 150);
      }
      pop();
    }
    
    // Submit instructions
    textSize(START_SCREEN_PROMPT_TEXT_SIZE); 
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    text("Press ENTER to Submit", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
  } else {
    // Hide the input field when not needed
    if (highscoreInputElement) {
      highscoreInputElement.style.position = 'fixed';
      highscoreInputElement.style.top = '-1000px';
      highscoreInputElement.style.left = '-1000px';
      highscoreInputElement.style.opacity = '0';
      highscoreInputElement.style.pointerEvents = 'none';
    }
    
    textSize(START_SCREEN_PROMPT_TEXT_SIZE); 
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    text("Press ENTER to Restart", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
  }
}

// Function to spawn a random powerup at the specified position
function spawnRandomPowerup(x, y) {
  // Determine powerup type
  let types = ['health', 'air', 'shield'];
  let typeWeights = [0.4, 0.4, 0.2]; // 40% health, 40% air, 20% shield
  
  let randomValue = random();
  let cumulativeWeight = 0;
  let selectedType = types[0]; // Default to first type
  
  for (let i = 0; i < types.length; i++) {
    cumulativeWeight += typeWeights[i];
    if (randomValue <= cumulativeWeight) {
      selectedType = types[i];
      break;
    }
  }
  
  // Create the powerup
  powerups.push(new Powerup(x, y, selectedType));
  console.log(`Spawned ${selectedType} powerup at ${x}, ${y}`);
}

// Helper function
function initGameObjects() {
  resetLevel();
}

// Game update functions
function updateGame() {
  // Apply movement from mobile controls if available
  if (typeof applyMobileMovement === 'function') {
    applyMobileMovement();
  }

  // Update player and handle game mechanics
  player.update(cave, enemies);
  
  // Process current areas - spawn bubbles
  for (let area of currentAreas) {
    if (typeof area.spawnBubbles === 'function') {
      area.spawnBubbles(cave, cameraOffsetX, cameraOffsetY);
    }
  }

  // Handle player collisions with enemies
  if (typeof player.handleEnemyCollisions === 'function') {
    player.handleEnemyCollisions(enemies);
  }
  
  // Handle player collisions with powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    let powerup = powerups[i];
    let distance = dist(player.pos.x, player.pos.y, powerup.pos.x, powerup.pos.y);
    
    if (distance < player.radius + powerup.radius) {
      powerup.applyEffect(player);
      playSound('powerup'); // Play powerup sound
      console.log(`Collected ${powerup.type} powerup at ${powerup.pos.x}, ${powerup.pos.y}`);
      powerups.splice(i, 1); // Remove collected powerup
    }
    
    // Remove powerups that have been around too long
    if (powerup.age > POWERUP_LIFESPAN) {
      console.log(`Powerup expired after ${powerup.age} frames`);
      powerups.splice(i, 1);
    }
  }
  
  if (typeof player.handleJellyfishCollisions === 'function' && jellyfish) {
    player.handleJellyfishCollisions(jellyfish);
  }
  
  // Projectile-Enemy Collisions
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let projectileRemoved = false;
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (projectiles[i] && enemies[j] && !projectileRemoved) {
        let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, enemies[j].pos.x, enemies[j].pos.y);
        if (d < projectiles[i].radius + enemies[j].radius) {
          // Store enemy position for explosion
          let enemyX = enemies[j].pos.x;
          let enemyY = enemies[j].pos.y;
          
          // Remove enemy and projectile
          enemies.splice(j, 1); 
          projectiles.splice(i, 1);
          projectileRemoved = true; // Mark as removed to avoid array index issues
          
          // Create visual and audio feedback
          createExplosion(enemyX, enemyY, 'enemy');
          enemiesKilledThisLevel++;
          playSound('creatureExplosion');
          
          // Chance to spawn a powerup
          if (random() < POWERUP_SPAWN_CHANCE_ON_ENEMY_DEATH) {
            spawnRandomPowerup(enemyX, enemyY);
          }
          
          break; 
        }
      }
    }
  }

  // Projectile-Jellyfish Collisions (if jellyfish exist)
  if (typeof jellyfish !== 'undefined' && jellyfish.length > 0) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (projectiles[i] === undefined) continue; // Skip if already removed
      let projectileRemoved = false;
      
      for (let j = jellyfish.length - 1; j >= 0; j--) {
        if (projectiles[i] && jellyfish[j] && !projectileRemoved) {
          let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, jellyfish[j].pos.x, jellyfish[j].pos.y);
          if (d < projectiles[i].radius + jellyfish[j].radius) {
            // Store positions for effects
            let jellyX = jellyfish[j].pos.x;
            let jellyY = jellyfish[j].pos.y;
            
            // Jellyfish takes damage instead of being destroyed immediately
            let destroyed = jellyfish[j].takeDamage();
            
            // Create explosion at the jellyfish position
            createExplosion(jellyX, jellyY, 'creature');
            
            // Remove projectile
            projectiles.splice(i, 1);
            projectileRemoved = true;
            
            if (destroyed) {
              jellyfish.splice(j, 1);
              enemiesKilledThisLevel++;
              playSound('creatureExplosion');
              
              // Higher chance to spawn a powerup from jellyfish
              if (random() < POWERUP_SPAWN_CHANCE_ON_JELLYFISH_DEATH) {
                spawnRandomPowerup(jellyX, jellyY);
              }
            } else {
              playSound('bump'); // Different sound for non-fatal hit
            }
            break;
          }
        }
      }
    }
  }

  // Update game objects (but don't render yet - rendering happens in drawGame)
  processGameObjectArray(projectiles, cameraOffsetX, cameraOffsetY, cave);
  processGameObjectArray(enemies, cameraOffsetX, cameraOffsetY, cave); // Pass cave for enemy updates
  processGameObjectArray(particles, cameraOffsetX, cameraOffsetY);
  processGameObjectArray(sonarBubbles, cameraOffsetX, cameraOffsetY);
  
  // Update powerups
  for (let i = 0; i < powerups.length; i++) {
    if (powerups[i] && powerups[i].update) {
      powerups[i].update();
    }
  }

  // Update camera position
  cameraOffsetX = player.pos.x - width / 2;
  cameraOffsetY = player.pos.y - height / 2;
  
  // Check for game over conditions
  if (player.health <= 0 || player.airSupply <= 0) {
    gameState = 'gameOver';
    
    // Stop or fade out music when game is over
    if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0, 2000); // Fade out over 2 seconds
    }
    
    // Play game over sound
    playSound('explosion');
  }
  
  // Check for level completion - if player is in the goal area and enough enemies are killed
  if (cave.isGoal(player.pos.x, player.pos.y) && getKillsStillNeeded() === 0) {
    gameState = 'levelComplete';
    
    // Change music volume for level complete
    if (modPlayer && modPlayer.playing) {
      modPlayer.fadeVolume(0.7, 1000); // Fade up to celebrate
    }
    
    // Play success sound
    playSound('powerup');
  }
}

function drawGame() {
  // Set up camera offset based on player position
  cameraOffsetX = player.pos.x - width / 2;
  cameraOffsetY = player.pos.y - height / 2;

  // Draw background
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);

  // Render the goal square if player is inside it
  if (cave.isGoal(player.pos.x, player.pos.y)) {
    cave.renderGoal(cameraOffsetX, cameraOffsetY);
  }

  // Draw cave walls for debugging if enabled
  if (debugShowWalls) {
    drawDebugCaveWalls(cameraOffsetX, cameraOffsetY);
  }
  
  // Process current areas - render debug visuals
  for (let area of currentAreas) {
    if (typeof area.render === 'function') {
      area.render(cameraOffsetX, cameraOffsetY);
    }
  }
  
  // Render all game objects
  processGameObjectArray(sonarBubbles, cameraOffsetX, cameraOffsetY);
  processGameObjectArray(particles, cameraOffsetX, cameraOffsetY);
  processGameObjectArray(projectiles, cameraOffsetX, cameraOffsetY, cave);
  processGameObjectArray(enemies, cameraOffsetX, cameraOffsetY);
  processGameObjectArray(powerups, cameraOffsetX, cameraOffsetY); // Render powerups
  
  // Render the player
  player.render(cameraOffsetX, cameraOffsetY);
  
  // Note: sonar hits are now rendered inside the player.render() method
  // No separate call to renderSonarHits needed
  
  // Draw UI elements (HUD)
  // Constants for HUD
  const HUD_MARGIN_X = 20;
  const HUD_MARGIN_Y = 20;
  const HUD_LINE_SPACING = 25;
  const HUD_TEXT_SIZE = 16;
  const HUD_TEXT_COLOR_H = 120;
  const HUD_TEXT_COLOR_S = 80;
  const HUD_TEXT_COLOR_B = 90;
  const AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR = 60;
  
  // Draw HUD
  fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B); 
  textSize(HUD_TEXT_SIZE); 
  textAlign(LEFT, TOP);
  
  text(`Hull: ${player.health}%`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING);
  text(`Air: ${floor(player.airSupply / AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR)} seconds`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 2);
  
  text(`Kills Needed: ${getKillsStillNeeded()}`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 3);
  
  let distanceToGoal = dist(player.pos.x, player.pos.y, cave.goalPos.x, cave.goalPos.y);
  text(`Distance to Reactor: ${floor(distanceToGoal)} meters`, HUD_MARGIN_X, HUD_MARGIN_Y + HUD_LINE_SPACING * 4);

  // Draw reactor direction indicator (compass)
  let dirToReactor = createVector(cave.goalPos.x - player.pos.x, cave.goalPos.y - player.pos.y).normalize();
  let indicatorSize = 20;
  let indicatorX = width - 70;
  let indicatorY = HUD_MARGIN_Y + HUD_LINE_SPACING * 2;
  
  // Draw indicator background
  noStroke();
  fill(0, 0, 0, 150); // Semi-transparent black
  ellipse(indicatorX, indicatorY, indicatorSize * 2.2, indicatorSize * 2.2);
  
  // Draw compass direction arrow
  push();
  translate(indicatorX, indicatorY);
  rotate(atan2(dirToReactor.y, dirToReactor.x));
  
  // Draw arrow
  stroke(GOAL_SQUARE_VISUAL_COLOR_H, GOAL_SQUARE_VISUAL_COLOR_S, GOAL_SQUARE_VISUAL_COLOR_B);
  strokeWeight(3);
  line(0, 0, indicatorSize, 0);
  
  // Draw arrow head
  noStroke();
  fill(GOAL_SQUARE_VISUAL_COLOR_H, GOAL_SQUARE_VISUAL_COLOR_S, GOAL_SQUARE_VISUAL_COLOR_B);
  triangle(indicatorSize, 0, indicatorSize - 8, -5, indicatorSize - 8, 5);
  
  // Draw center dot
  fill(255);
  ellipse(0, 0, 4, 4);
  pop();
  
  // Add compass text
  textAlign(CENTER, TOP);
  fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
  textSize(12);
  text("REACTOR", indicatorX, indicatorY + indicatorSize + 5);
  textAlign(LEFT, TOP); // Reset text alignment
  
  // Render mobile controls if applicable
  if (typeof renderMobileControls === 'function') {
    renderMobileControls();
  }
  
  // Update reactor hum volume based on distance to goal if function exists
  if (typeof updateReactorHum === 'function') {
    updateReactorHum(distanceToGoal);
  }
}

// Debug function to draw all cave walls for debugging
function drawDebugCaveWalls(offsetX, offsetY) {
  push();
  
  // Draw grid
  stroke(80, 40, 40, 70);  // Light grid lines
  strokeWeight(0.5);
  
  // Calculate visible area with buffer
  let startGridX = Math.floor(offsetX / cave.cellSize);
  let endGridX = Math.ceil((offsetX + width) / cave.cellSize);
  let startGridY = Math.floor(offsetY / cave.cellSize);
  let endGridY = Math.ceil((offsetY + height) / cave.cellSize);
  
  // Constrain to world bounds
  startGridX = max(0, startGridX);
  endGridX = min(cave.gridWidth, endGridX);
  startGridY = max(0, startGridY);
  endGridY = min(cave.gridHeight, endGridY);
  
  // Draw walls
  noStroke();
  fill(120, 50, 50, 120); // Semi-transparent light green for walls
  
  for (let x = startGridX; x < endGridX; x++) {
    for (let y = startGridY; y < endGridY; y++) {
      if (cave.grid[x][y] === 1) {  // If this cell is a wall
        rect(
          x * cave.cellSize - offsetX, 
          y * cave.cellSize - offsetY, 
          cave.cellSize, 
          cave.cellSize
        );
      }
    }
  }
  
  // Draw jellyfish
  fill(0, 255, 255); // Cyan for jellyfish
  for (let jelly of jellyfish) {
    let jellyX = jelly.pos.x - offsetX;
    let jellyY = jelly.pos.y - offsetY;
    
    // Only draw if on screen (with some margin)
    if (jellyX >= -jelly.radius && jellyX <= width + jelly.radius &&
        jellyY >= -jelly.radius && jellyY <= height + jelly.radius) {
      ellipse(jellyX, jellyY, jelly.radius * 2, jelly.radius * 2);
      
      // Add jellyfish info text
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

  // Draw the goal area
  fill(0, 255, 0, 150); // Semi-transparent green for goal
  noStroke();
  let goalScreenX = cave.goalPos.x - offsetX - cave.goalSize / 2;
  let goalScreenY = cave.goalPos.y - offsetY - cave.goalSize / 2;
  rect(goalScreenX, goalScreenY, cave.goalSize, cave.goalSize);
  
  // Add goal text
  fill(255, 255, 255); // White text
  textAlign(CENTER, CENTER);
  textSize(16);
  text("GOAL", cave.goalPos.x - offsetX, cave.goalPos.y - offsetY);
  
  // Draw player position
  fill(255, 255, 0); // Yellow for player
  noStroke();
  let playerScreenX = player.pos.x - offsetX;
  let playerScreenY = player.pos.y - offsetY;
  ellipse(playerScreenX, playerScreenY, player.radius * 2, player.radius * 2);
  
  // Add player text
  fill(0, 0, 0); // Black text
  textAlign(CENTER, CENTER);
  textSize(12);
  text("P", playerScreenX, playerScreenY);
  
  pop();
}
