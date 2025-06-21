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
const BASE_KILLS_REQUIRED = 3; // Kills required for the first level
const KILLS_INCREASE_PER_LEVEL = 3; // How many more kills needed each subsequent level

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

// Radiation Pulse Effect Constants
const RADIATION_PULSE_MAX_DISTANCE = 10000; // Increased max distance where radiation pulse is visible
const RADIATION_PULSE_MIN_INTENSITY = 0.3; // Increased minimum pulse intensity
const RADIATION_PULSE_MAX_INTENSITY = 0.5; // Reduced maximum pulse intensity for transparency
const RADIATION_PULSE_SPEED = 0.02; // Slower, smoother pulse
const RADIATION_PULSE_EDGE_WIDTH = 30; // Smaller pulse effect for subtlety
const RADIATION_PULSE_COLOR_H = 60; // Yellow hue (same as goal/reactor)
const RADIATION_PULSE_COLOR_S = 100; // Full saturation (same as goal)
const RADIATION_PULSE_COLOR_B = 100; // Full brightness (same as goal)

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
const START_SCREEN_INFO_Y_OFFSET_3 = -110; // Credit
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

// Radiation Pulse Effect
let radiationPulsePhase = 0; // Phase for the pulsing animation
let goalCurrentlyDetectedBySonar = false; // Track if goal is currently being detected by sonar

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
let highScoreManager = null; // Will be initialized in setup()

// --- Game State Management ---

const gameStates = {
  START: 'start',
  HIGH_SCORES: 'highScores',
  LOADING: 'loading',
  PLAYING: 'playing',
  LEVEL_COMPLETE: 'levelComplete',
  GAME_COMPLETE: 'gameComplete',
  GAME_OVER: 'gameOver'
};

function resetGame() {
  currentLevel = 1;
  enemiesKilledThisLevel = 0;
  totalScore = 0;
  levelScore = 0;

  isHighScoreChecked = false;
  isSubmittingHighScore = false;
  playerNameInput = '';
  isHighScoreResult = false;
  isMobileInputFocused = false;
  isSubmissionInProgress = false;

  sonarBubbles = [];
  particles = [];
  
  // Reset radiation pulse discovery flag
  goalCurrentlyDetectedBySonar = false;

  if (audioInitialized) {
    if (lowAirOsc && lowAirOsc.started) lowAirEnv.triggerRelease(lowAirOsc);
    if (reactorHumOsc && reactorHumOsc.started) {
      reactorHumOsc.amp(0, 0);
      reactorHumAmplitude = 0;
    }
  }
  lastLowAirBeepTime = 0;

  gameState = gameStates.START;
}

function prepareNextLevel() {
  currentLevel++;
  enemiesKilledThisLevel = 0;
  levelScore = 0;

  // Reset radiation pulse discovery flag for new level
  goalCurrentlyDetectedBySonar = false;

  gameState = gameStates.LOADING;
  showLoadingOverlay(`LEVEL ${currentLevel}`);

  setTimeout(() => {
    initGameObjects();
    player.vel = createVector(0, 0);
    player.angle = 0;
    player.health = PLAYER_INITIAL_HEALTH;
    player.lastSonarTime = frameCount - player.sonarCooldown;
    player.lastShotTime = frameCount - player.shotCooldown;
    gameState = gameStates.PLAYING;

    if (audioInitialized) {
      if (reactorHumOsc && reactorHumOsc.started) {
        reactorHumOsc.amp(0, 0);
      }
      if (lowAirOsc && lowAirOsc.started) {
        lowAirEnv.triggerRelease(lowAirOsc);
      }
    }
    lastLowAirBeepTime = 0;
  }, 100);
}

function initGameObjects() {
  showLoadingOverlay("GENERATING LEVEL");

  const levelSettings = calculateLevelSettings();
  currentCellSize = levelSettings.cellSize;

  cave = new Cave(WORLD_WIDTH, WORLD_HEIGHT, currentCellSize);
  
  const playerStartPos = findPlayerStartPosition(cave, currentCellSize);
  player = new PlayerSub(playerStartPos.x, playerStartPos.y, levelSettings.airSupply, levelSettings.airDepletion);

  projectiles = [];
  sonarBubbles = [];
  particles = [];

  enemies = spawnEnemies(cave);
  jellyfish = spawnJellyfish(cave, playerStartPos.x, playerStartPos.y);
  currentAreas = spawnCurrentAreas(cave);

  setTimeout(() => {
    hideLoadingOverlay();
  }, 200);
}

function calculateLevelSettings() {
    const cellSize = BASE_CELL_SIZE + (currentLevel - 1) * 2;
    const airSupply = max(INITIAL_AIR_SUPPLY_BASE, MIN_AIR_SUPPLY_PER_LEVEL);
    const airDepletion = BASE_AIR_DEPLETION_RATE + (currentLevel - 1) * AIR_DEPLETION_LEVEL_INCREASE;
    return { cellSize, airSupply, airDepletion };
}

function findPlayerStartPosition(caveContext, cellSize) {
    // Use the cave's randomized start position if available
    if (caveContext.playerStartX !== undefined && caveContext.playerStartY !== undefined) {
        let playerStartX = caveContext.playerStartX;
        let playerStartY = caveContext.playerStartY;
        const playerSpawnRadiusBuffer = cellSize * PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR;
        
        // Check if the randomized position is clear, if not, find a nearby clear spot
        let attempts = 0;
        let originalX = playerStartX;
        let originalY = playerStartY;
        
        while (caveContext.isWall(playerStartX, playerStartY, playerSpawnRadiusBuffer) && attempts < MAX_PLAYER_SPAWN_ATTEMPTS) {
            // Try positions in a spiral pattern around the original position
            let angle = (attempts * 0.5) % (TWO_PI);
            let radius = (attempts * 5) + 10;
            playerStartX = originalX + cos(angle) * radius;
            playerStartY = originalY + sin(angle) * radius;
            
            // Keep within world bounds
            playerStartX = constrain(playerStartX, cellSize * 3, WORLD_WIDTH - cellSize * 3);
            playerStartY = constrain(playerStartY, cellSize * 3, WORLD_HEIGHT - cellSize * 3);
            
            attempts++;
        }
        
        if (attempts >= MAX_PLAYER_SPAWN_ATTEMPTS) {
            console.warn("Could not find clear spot near randomized start position, using fallback");
            // Fallback to original logic if randomized position doesn't work
        } else {
            return { x: playerStartX, y: playerStartY };
        }
    }
    
    // Fallback to original logic if no randomized position or it failed
    let playerStartX, playerStartY;
    let attempts = 0;
    const playerSpawnRadiusBuffer = cellSize * PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR;

    do {
        playerStartX = cellSize * (PLAYER_START_X_BASE_CELLS + attempts * PLAYER_START_X_ATTEMPT_INCREMENT_CELLS);
        playerStartY = WORLD_HEIGHT / 2 + random(-cellSize * PLAYER_START_Y_RANDOM_RANGE_CELLS, cellSize * PLAYER_START_Y_RANDOM_RANGE_CELLS);
        attempts++;
        if (playerStartX > WORLD_WIDTH * PLAYER_SPAWN_MAX_X_SEARCH_FACTOR) {
            playerStartX = cellSize * PLAYER_START_X_BASE_CELLS;
            playerStartY = WORLD_HEIGHT / 2;
            break;
        }
    } while (caveContext.isWall(playerStartX, playerStartY, playerSpawnRadiusBuffer) && attempts < MAX_PLAYER_SPAWN_ATTEMPTS);
    
    if (attempts >= MAX_PLAYER_SPAWN_ATTEMPTS) {
        playerStartX = cellSize * PLAYER_START_X_BASE_CELLS;
        playerStartY = WORLD_HEIGHT / 2;
    }
    return { x: playerStartX, y: playerStartY };
}

function spawnEnemies(caveContext) {
    const enemiesArray = [];
    let enemyCount = min(BASE_ENEMY_COUNT + (currentLevel - 1) * ENEMY_COUNT_PER_LEVEL_INCREASE, MAX_ENEMY_COUNT);
    
    for (let i = 0; i < enemyCount; i++) {
        let enemyX, enemyY, eAttempts = 0;
        do {
            enemyX = random(WORLD_WIDTH * ENEMY_SPAWN_MIN_X_WORLD_FACTOR, WORLD_WIDTH * ENEMY_SPAWN_MAX_X_WORLD_FACTOR);
            enemyY = random(WORLD_HEIGHT * ENEMY_SPAWN_MIN_Y_WORLD_FACTOR, WORLD_HEIGHT * ENEMY_SPAWN_MAX_Y_WORLD_FACTOR);
            eAttempts++;
        } while (caveContext.isWall(enemyX, enemyY, ENEMY_SPAWN_WALL_CHECK_RADIUS) && eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS);
        
        if (eAttempts < MAX_ENEMY_SPAWN_ATTEMPTS) {
            enemiesArray.push(new Enemy(enemyX, enemyY));
        }
    }
    return enemiesArray;
}

function spawnJellyfish(caveContext, playerStartX, playerStartY) {
    const jellyfishArray = [];
    const jellyfishCount = currentLevel;
    
    for (let i = 0; i < jellyfishCount; i++) {
        let jellyfishX, jellyfishY, jAttempts = 0;
        do {
            jellyfishX = random(WORLD_WIDTH * 0.3, WORLD_WIDTH * 0.9);
            jellyfishY = random(WORLD_HEIGHT * 0.2, WORLD_HEIGHT * 0.8);
            jAttempts++;
        } while (caveContext.isWall(jellyfishX, jellyfishY, JELLYFISH_RADIUS + 10) && jAttempts < MAX_ENEMY_SPAWN_ATTEMPTS);
        
        if (jAttempts < MAX_ENEMY_SPAWN_ATTEMPTS) {
            if (dist(jellyfishX, jellyfishY, playerStartX, playerStartY) > 150) {
                jellyfishArray.push(new Jellyfish(jellyfishX, jellyfishY));
            }
        }
    }
    return jellyfishArray;
}

function spawnCurrentAreas(caveContext) {
  const newCurrentAreas = [];
  for (let i = 0; i < CURRENT_AREAS_PER_LEVEL; i++) {
    let attempts = 0;
    let areaX, areaY, areaWidth, areaHeight;
    let validArea = false;
    
    while (!validArea && attempts < 50) {
      areaWidth = random(CURRENT_AREA_MIN_WIDTH, CURRENT_AREA_MAX_WIDTH);
      areaHeight = random(CURRENT_AREA_MIN_HEIGHT, CURRENT_AREA_MAX_HEIGHT);
      areaX = random(CURRENT_AREA_PADDING_FROM_PLAYER_START, WORLD_WIDTH - areaWidth - CURRENT_AREA_PADDING_FROM_GOAL);
      areaY = random(areaHeight / 2, WORLD_HEIGHT - areaHeight / 2);
      
      let openCells = 0;
      let totalCells = 0;
      let checkStep = 20;
      
      for (let checkX = areaX; checkX < areaX + areaWidth; checkX += checkStep) {
        for (let checkY = areaY; checkY < areaY + areaHeight; checkY += checkStep) {
          totalCells++;
          if (!caveContext.isWall(checkX, checkY)) {
            openCells++;
          }
        }
      }
      
      if (totalCells > 0 && (openCells / totalCells) > 0.7) {
        validArea = true;
      }
      attempts++;
    }
    
    if (validArea) {
      let forceDirection = p5.Vector.random2D();
      let forceMagnitude = random(CURRENT_FORCE_MAGNITUDE_MIN, CURRENT_FORCE_MAGNITUDE_MAX);
      newCurrentAreas.push(new CurrentArea(areaX, areaY, areaWidth, areaHeight, forceDirection, forceMagnitude));
    }
  }
  console.log(`Spawned ${newCurrentAreas.length} current areas for level ${currentLevel}`);
  return newCurrentAreas;
}

// --- UI & DOM Functions ---

const highScoreInputStyles = {
  visible: {
    position: 'fixed',
    top: '65%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: '1',
    pointerEvents: 'auto',
    zIndex: '10000',
    padding: '12px 20px',
    fontSize: '20px',
    textAlign: 'center',
    border: '3px solid #ffff00',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#ffff00',
    boxShadow: '0 0 15px rgba(255, 255, 0, 0.5)',
    outline: 'none',
    minWidth: '250px',
  },
  hidden: {
    position: 'fixed',
    top: '-1000px',
    left: '-1000px',
    opacity: '0',
    pointerEvents: 'none',
  },
  submitting: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    color: '#999999',
  },
  default: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#ffff00',
  }
};

function updateHighScoreInputVisibility(visible) {
  if (!highscoreInputElement) return;
  const style = visible ? highScoreInputStyles.visible : highScoreInputStyles.hidden;
  Object.assign(highscoreInputElement.style, style);
}

function setHighScoreInputState(submitting) {
  if (!highscoreInputElement) return;
  highscoreInputElement.disabled = submitting;
  const style = submitting ? highScoreInputStyles.submitting : highScoreInputStyles.default;
  Object.assign(highscoreInputElement.style, style);
}

// The submitHighScoreXHR function is no longer needed as this is handled by JSONBase.js

function showLoadingOverlay(text = "GENERATING LEVEL") {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = overlay.querySelector('.loading-text');
  if (overlay) {
    if (loadingText) {
      loadingText.textContent = text;
    }
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => {
      if (overlay.classList.contains('hidden')) {
        overlay.style.display = 'none';
      }
    }, 500);
  }
}

function updateLoadingText(text) {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = overlay.querySelector('.loading-text');
  if (loadingText) {
    loadingText.textContent = text;
  }
}

function submitHighScore() {
  if (isSubmissionInProgress) {
    return;
  }
  
  if (playerNameInput.trim().length === 0) {
    console.log('Cannot submit high score: Name is empty');
    return;
  }

  console.log('Submitting high score:', playerNameInput, totalScore);
  isSubmissionInProgress = true;
  setHighScoreInputState(true);
  showLoadingOverlay("SUBMITTING SCORE...");

  highScoreManager.submitScore(playerNameInput.trim(), totalScore)
    .then(() => {
      console.log('High score submitted successfully!');
      hideLoadingOverlay();
      isSubmittingHighScore = false;
      isMobileInputFocused = false;
      isSubmissionInProgress = false;
      
      if (highscoreInputElement) {
        highscoreInputElement.value = '';
        highscoreInputElement.blur();
      }
      playerNameInput = '';
      setHighScoreInputState(false);
      
    })
    .catch(error => {
      console.error('Error submitting high score:', error);
      hideLoadingOverlay();
      isSubmissionInProgress = false;
      setHighScoreInputState(false);
      
      setTimeout(() => {
        alert("Failed to submit high score. Please check your connection and try again.");
      }, 100);
    });
}

// --- Helper Functions ---

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
    particleCount = EXPLOSION_PARTICLE_COUNT_TORPEDO_ENEMY;
    colorH = 300;
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

function getKillsRequiredForLevel(level) {
  if (level <= 0) return 0;
  return BASE_KILLS_REQUIRED + (level - 1) * KILLS_INCREASE_PER_LEVEL;
}

// --- Sound Functions ---

function initializeSounds() {
  function setupSound(type, freqOrNoiseType, adsr, levels) {
    let soundObj;
    let env = new p5.Envelope();
    env.setADSR(adsr.aT, adsr.dT, adsr.sR, adsr.rT);
    env.setRange(levels.aL, levels.rL);

    if (type === 'osc') {
      soundObj = new p5.Oscillator(freqOrNoiseType); // freqOrNoiseType is actual frequency string like 'sine' or 'triangle'
    } else { // 'noise'
      soundObj = new p5.Noise(freqOrNoiseType); // freqOrNoiseType is noise type string like 'white' or 'pink'
    }
    soundObj.amp(env);
    return { sound: soundObj, envelope: env };
  }

  let sonarSound = setupSound('osc', 'sine', SONAR_ENV_ADSR, SONAR_ENV_LEVELS);
  sonarOsc = sonarSound.sound; sonarEnv = sonarSound.envelope;

  let explosionNoiseSound = setupSound('noise', 'brown', EXPLOSION_NOISE_ENV_ADSR, EXPLOSION_NOISE_ENV_LEVELS);
  explosionNoise = explosionNoiseSound.sound; explosionEnv = explosionNoiseSound.envelope;
  let explosionBoomSound = setupSound('osc', 'sine', EXPLOSION_BOOM_ENV_ADSR, EXPLOSION_BOOM_ENV_LEVELS);
  explosionBoomOsc = explosionBoomSound.sound; explosionBoomEnv = explosionBoomSound.envelope;
  let explosionBassSound = setupSound('osc', 'sine', EXPLOSION_BASS_ENV_ADSR, EXPLOSION_BASS_ENV_LEVELS);
  explosionBassOsc = explosionBassSound.sound; explosionBassEnv = explosionBassSound.envelope;

  // Initialize creature explosion sounds (less boomy)
  let creatureExplosionNoiseSound = setupSound('noise', 'brown', CREATURE_EXPLOSION_NOISE_ENV_ADSR, CREATURE_EXPLOSION_NOISE_ENV_LEVELS);
  creatureExplosionNoise = creatureExplosionNoiseSound.sound; creatureExplosionEnv = creatureExplosionNoiseSound.envelope;
  let creatureExplosionBoomSound = setupSound('osc', 'sine', CREATURE_EXPLOSION_BOOM_ENV_ADSR, CREATURE_EXPLOSION_BOOM_ENV_LEVELS);
  creatureExplosionBoomOsc = creatureExplosionBoomSound.sound; creatureExplosionBoomEnv = creatureExplosionBoomSound.envelope;
  let creatureExplosionBassSound = setupSound('osc', 'sine', CREATURE_EXPLOSION_BASS_ENV_ADSR, CREATURE_EXPLOSION_BASS_ENV_LEVELS);
  creatureExplosionBassOsc = creatureExplosionBassSound.sound; creatureExplosionBassEnv = creatureExplosionBassSound.envelope;

  let bumpSound = setupSound('osc', 'triangle', BUMP_ENV_ADSR, BUMP_ENV_LEVELS);
  bumpOsc = bumpSound.sound; bumpEnv = bumpSound.envelope;

  let torpedoSound = setupSound('noise', 'pink', TORPEDO_ENV_ADSR, TORPEDO_ENV_LEVELS);
  torpedoNoise = torpedoSound.sound; torpedoEnv = torpedoSound.envelope;

  // Initialize current flow sounds
  let currentFlowNoiseSound = setupSound('noise', 'brown', CURRENT_FLOW_NOISE_ENV_ADSR, CURRENT_FLOW_NOISE_ENV_LEVELS);
  currentFlowNoise = currentFlowNoiseSound.sound; currentFlowNoiseEnv = currentFlowNoiseSound.envelope;
  let currentFlowBassSound = setupSound('osc', 'sine', CURRENT_FLOW_BASS_ENV_ADSR, CURRENT_FLOW_BASS_ENV_LEVELS);
  currentFlowBassOsc = currentFlowBassSound.sound; currentFlowBassEnv = currentFlowBassSound.envelope;

  let lowAirSound = setupSound('osc', 'square', LOW_AIR_ENV_ADSR, LOW_AIR_ENV_LEVELS);
  lowAirOsc = lowAirSound.sound; lowAirEnv = lowAirSound.envelope;

  // Initialize reactor hum
  let reactorHumSound = setupSound('osc', 'sawtooth', REACTOR_HUM_ENV_ADSR, REACTOR_HUM_ENV_LEVELS);
  reactorHumOsc = reactorHumSound.sound; reactorHumEnv = reactorHumSound.envelope;
  reactorHumOsc.freq(REACTOR_HUM_FREQ);
  // Set up for continuous play with amplitude control
  reactorHumOsc.amp(0); // Start at zero volume

  // Initialize creature growl
  let creatureGrowlSound = setupSound('osc', 'sawtooth', CREATURE_GROWL_ENV_ADSR, CREATURE_GROWL_ENV_LEVELS);
  creatureGrowlOsc = creatureGrowlSound.sound; creatureGrowlEnv = creatureGrowlSound.envelope;

  let gameOverImpact = setupSound('noise', 'white', GAME_OVER_IMPACT_ENV_ADSR, GAME_OVER_IMPACT_ENV_LEVELS);
  gameOverImpactNoise = gameOverImpact.sound; gameOverImpactEnv = gameOverImpact.envelope;
  let gameOverGroan = setupSound('osc', 'sawtooth', GAME_OVER_GROAN_ENV_ADSR, GAME_OVER_GROAN_ENV_LEVELS);
  gameOverGroanOsc = gameOverGroan.sound; gameOverGroanEnv = gameOverGroan.envelope;
  let gameOverFinalBoom = setupSound('noise', 'brown', GAME_OVER_FINAL_BOOM_ENV_ADSR, GAME_OVER_FINAL_BOOM_ENV_LEVELS);
  gameOverFinalBoomNoise = gameOverFinalBoom.sound; gameOverFinalBoomEnv = gameOverFinalBoom.envelope;
  // Note: The original code had gameOverFinalBoomEnv.setRange(GAME_OVER_FINAL_BOOM_ENV_LEVELS.aL, GAME_OVER_FINAL_BOOM_ENV_LEVELS.rL);
  // but it was missing the ADSR setting for gameOverFinalBoomEnv. The helper now handles both.
}

function playSound(soundName) {
  if (!audioInitialized || (getAudioContext() && getAudioContext().state !== 'running')) return;

  function ensureStarted(soundObject) {
    if (soundObject && !soundObject.started && typeof soundObject.start === 'function') {
      soundObject.start();
    }
  }

  try {
    if (soundName === 'sonar') {
      ensureStarted(sonarOsc); sonarOsc.freq(SONAR_FREQ); sonarEnv.play(sonarOsc);
    } else if (soundName === 'explosion') {
      ensureStarted(explosionNoise); explosionEnv.play(explosionNoise);
      ensureStarted(explosionBoomOsc); explosionBoomOsc.freq(random(EXPLOSION_BOOM_MIN_FREQ, EXPLOSION_BOOM_MAX_FREQ)); explosionBoomEnv.play(explosionBoomOsc);
      ensureStarted(explosionBassOsc); explosionBassOsc.freq(random(EXPLOSION_BASS_MIN_FREQ, EXPLOSION_BASS_MAX_FREQ)); explosionBassEnv.play(explosionBassOsc);
    } else if (soundName === 'creatureExplosion') {
      ensureStarted(creatureExplosionNoise); creatureExplosionEnv.play(creatureExplosionNoise);
      ensureStarted(creatureExplosionBoomOsc); creatureExplosionBoomOsc.freq(random(CREATURE_EXPLOSION_BOOM_MIN_FREQ, CREATURE_EXPLOSION_BOOM_MAX_FREQ)); creatureExplosionBoomEnv.play(creatureExplosionBoomOsc);
      ensureStarted(creatureExplosionBassOsc); creatureExplosionBassOsc.freq(random(CREATURE_EXPLOSION_BASS_MIN_FREQ, CREATURE_EXPLOSION_BASS_MAX_FREQ)); creatureExplosionBassEnv.play(creatureExplosionBassOsc);
    } else if (soundName === 'bump') {
      ensureStarted(bumpOsc); bumpOsc.freq(BUMP_FREQ); bumpEnv.play(bumpOsc);
    } else if (soundName === 'torpedo') {
      ensureStarted(torpedoNoise); torpedoEnv.play(torpedoNoise);
    } else if (soundName === 'current_flow') {
      // Current flow rushing water sound
      ensureStarted(currentFlowNoise); currentFlowNoiseEnv.play(currentFlowNoise);
      ensureStarted(currentFlowBassOsc); 
      currentFlowBassOsc.freq(random(CURRENT_FLOW_BASS_MIN_FREQ, CURRENT_FLOW_BASS_MAX_FREQ)); 
      currentFlowBassEnv.play(currentFlowBassOsc);
    } else if (soundName === 'lowAir') {
      ensureStarted(lowAirOsc); lowAirOsc.freq(LOW_AIR_FREQ); lowAirEnv.play(lowAirOsc);
    } else if (soundName === 'creatureGrowl') {
      ensureStarted(creatureGrowlOsc); 
      creatureGrowlOsc.freq(random(CREATURE_GROWL_MIN_FREQ, CREATURE_GROWL_MAX_FREQ)); 
      creatureGrowlEnv.play(creatureGrowlOsc);
    } else if (soundName === 'gameOver') {
      ensureStarted(gameOverImpactNoise);
      gameOverImpactEnv.play(gameOverImpactNoise);

      setTimeout(() => {
        ensureStarted(gameOverGroanOsc);
        gameOverGroanOsc.freq(random(GAME_OVER_GROAN_MIN_FREQ, GAME_OVER_GROAN_MAX_FREQ));
        gameOverGroanEnv.play(gameOverGroanOsc);
        gameOverGroanOsc.freq(GAME_OVER_GROAN_PITCH_DOWN_TARGET_FREQ, GAME_OVER_GROAN_PITCH_DOWN_TIME, GAME_OVER_GROAN_PITCH_DOWN_DELAY); // Pitch down
      }, GAME_OVER_GROAN_DELAY_MS);

      setTimeout(() => {
        ensureStarted(gameOverFinalBoomNoise);
        gameOverFinalBoomEnv.play(gameOverFinalBoomNoise);
      }, GAME_OVER_FINAL_BOOM_DELAY_MS);
    }
  } catch (e) { /* console.error("Sound error:", soundName, e); */ }
}

function updateReactorHum(distanceToGoal) {
  if (!audioInitialized || !reactorHumOsc) return;
  
  // Calculate volume based on distance (closer = louder)
  let volume = 0;
  if (distanceToGoal < REACTOR_HUM_MAX_DISTANCE) {
    // Exponential falloff for more realistic audio spatialization
    let normalizedDistance = distanceToGoal / REACTOR_HUM_MAX_DISTANCE;
    volume = REACTOR_HUM_ENV_LEVELS.aL * (1 - Math.pow(normalizedDistance, 0.7));
  }

  // Reduce overall hum volume by multiplying with a factor (e.g., 0.5 for half volume)
  const HUM_VOLUME_FACTOR = 0.3; // Lower this value for quieter hum
  volume *= HUM_VOLUME_FACTOR;
  
  // Apply volume directly to oscillator for continuous play
  if (reactorHumOsc.started) {
    reactorHumOsc.amp(volume, 0.1); // Smooth transition over 0.1 seconds
  }
  
  reactorHumAmplitude = volume;
}

function renderRadiationPulse(cameraOffsetX, cameraOffsetY) {
  if (!cave || !cave.goalPos) return;
  
  // Check if player has any active goal sonar hits (goal is currently visible)
  let goalCurrentlyVisible = false;
  if (player && player.sonarHits) {
    for (let hit of player.sonarHits) {
      if (hit.type === 'goal') {
        goalCurrentlyVisible = true;
        break;
      }
    }
  }
  
  // Don't show indicator if goal is currently visible through sonar
  if (goalCurrentlyVisible) {
    return; // Goal is currently visible, don't show radiation pulse
  }
  
  // Calculate distance to reactor (goal)
  let distanceToReactor = dist(player.pos.x, player.pos.y, cave.goalPos.x, cave.goalPos.y);
  
  // Calculate direction vector from player to reactor
  let directionToReactor = createVector(
    cave.goalPos.x - player.pos.x,
    cave.goalPos.y - player.pos.y
  );
  directionToReactor.normalize();
  
  // Calculate angle to reactor
  let angleToReactor = atan2(directionToReactor.y, directionToReactor.x);
  
  // Update pulse phase with smoother animation
  radiationPulsePhase += RADIATION_PULSE_SPEED;
  
  // Calculate pulse intensity based on distance (closer = stronger pulse)
  let normalizedDistance = min(distanceToReactor / RADIATION_PULSE_MAX_DISTANCE, 1.0);
  let distanceIntensity = 1 - normalizedDistance * 0.6; // Closer = higher intensity
  
  // Create smoother pulsing effect using sine wave
  let pulseWave = (sin(radiationPulsePhase) + 1) / 2; // Normalize to 0-1
  // Apply easing for smoother animation
  pulseWave = pulseWave * pulseWave * (3.0 - 2.0 * pulseWave); // Smoothstep
  
  let currentIntensity = RADIATION_PULSE_MIN_INTENSITY + 
    (RADIATION_PULSE_MAX_INTENSITY - RADIATION_PULSE_MIN_INTENSITY) * pulseWave * distanceIntensity;
  
  // Calculate position at screen edge - center of indicator ON the edge
  let screenCenterX = width / 2;
  let screenCenterY = height / 2;
  
  // Find intersection with screen edge
  let edgeX, edgeY;
  
  // Calculate which edge the direction intersects with
  let dx = cos(angleToReactor);
  let dy = sin(angleToReactor);
  
  // Calculate distances to each edge
  let distToRight = dx > 0 ? (width - screenCenterX) / dx : Infinity;
  let distToLeft = dx < 0 ? -screenCenterX / dx : Infinity;
  let distToBottom = dy > 0 ? (height - screenCenterY) / dy : Infinity;
  let distToTop = dy < 0 ? -screenCenterY / dy : Infinity;
  
  // Find the closest edge intersection
  let minDist = min(distToRight, distToLeft, distToBottom, distToTop);
  
  if (minDist === distToRight) {
    // Right edge
    edgeX = width;
    edgeY = screenCenterY + dy * distToRight;
  } else if (minDist === distToLeft) {
    // Left edge
    edgeX = 0;
    edgeY = screenCenterY + dy * distToLeft;
  } else if (minDist === distToBottom) {
    // Bottom edge
    edgeX = screenCenterX + dx * distToBottom;
    edgeY = height;
  } else {
    // Top edge
    edgeX = screenCenterX + dx * distToTop;
    edgeY = 0;
  }
  
  // Ensure the position is within screen bounds
  edgeX = constrain(edgeX, 0, width);
  edgeY = constrain(edgeY, 0, height);
  
  // Render the radiation pulse effect with transparency and smoothing
  push();
  
  // Use ADD blend mode for glow effect, but more subtle
  blendMode(ADD);
  
  // Create gradient effect using multiple ellipses with transparency
  let alpha = currentIntensity * 180; // Reduced alpha for transparency
  let pulseSize = RADIATION_PULSE_EDGE_WIDTH * (0.8 + pulseWave * 0.2);
  
  // Outer glow - very transparent and soft
  fill(RADIATION_PULSE_COLOR_H, RADIATION_PULSE_COLOR_S, RADIATION_PULSE_COLOR_B, alpha * 0.2);
  ellipse(edgeX, edgeY, pulseSize * 2.5);
  
  // Middle glow - slightly more visible
  fill(RADIATION_PULSE_COLOR_H, RADIATION_PULSE_COLOR_S, RADIATION_PULSE_COLOR_B, alpha * 0.4);
  ellipse(edgeX, edgeY, pulseSize * 1.5);
  
  // Inner glow - core effect
  fill(RADIATION_PULSE_COLOR_H, RADIATION_PULSE_COLOR_S, RADIATION_PULSE_COLOR_B, alpha * 0.7);
  ellipse(edgeX, edgeY, pulseSize);
  
  blendMode(BLEND); // Reset blend mode
  pop();
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

// --- Main p5.js Functions ---

function preload() {
  customFont = loadFont('Berpatroli.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255);
  textAlign(CENTER, CENTER);
  textFont('monospace');
  
  initializeSounds(); 
  highScoreManager = new JSONBaseHighScores(); // Use the new high score service
  initMobileControls();
  
  highscoreInputElement = document.getElementById('highscoreInput');
  if (highscoreInputElement) {
    highscoreInputElement.addEventListener('input', function(e) {
      if (isSubmittingHighScore) {
        playerNameInput = e.target.value;
      }
    });
    highscoreInputElement.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && isSubmittingHighScore && !isSubmissionInProgress) {
        if (playerNameInput.trim().length > 0) {
          submitHighScore();
        }
        // No feedback for empty name in event handler - handled by visual cues
      }
    });
  }

  function handleInitialInteraction() {
    if (initialInteractionDone) return;
    initialInteractionDone = true;
    if (typeof startAudioRoutine === 'function' && !audioInitialized) {
      startAudioRoutine();
    }
    if (!fullscreen()) {
      fullscreen(true);
    }
    console.log('Initial interaction: Audio started and fullscreen requested');
  }

  const canvasElt = document.querySelector('canvas');
  if (canvasElt) {
    canvasElt.addEventListener('click', handleInitialInteraction, { once: true });
    canvasElt.addEventListener('touchstart', handleInitialInteraction, { once: true });
  }
  
  if (customFont) {
    textFont(customFont);
  }
  
  resetGame();
  
  setTimeout(() => {
    hideLoadingOverlay();
  }, 100);
}

const drawFunctions = {
  [gameStates.START]: drawStartScreen,
  [gameStates.HIGH_SCORES]: drawHighScoreScreen,
  [gameStates.LOADING]: drawLoadingScreen,
  [gameStates.LEVEL_COMPLETE]: drawLevelCompleteScreen,
  [gameStates.GAME_COMPLETE]: drawGameCompleteScreen,
  [gameStates.GAME_OVER]: drawGameOverScreen,
  [gameStates.PLAYING]: drawPlayingState,
};

function draw() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);

  const drawFunction = drawFunctions[gameState];
  if (drawFunction) {
    drawFunction();
  }
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}

// --- Input Handlers ---

function handleKeyPressedStart() {
  if (keyCode === ENTER) {
    gameState = gameStates.HIGH_SCORES;
    highScores = null;
    highScoreManager.getHighScores().then(scores => {
      highScores = scores;
    }).catch(error => {
      console.error('Failed to load high scores:', error);
      highScores = [];
    });
  }
}

function handleKeyPressedHighScores() {
  if (keyCode === ENTER) {
    gameState = gameStates.LOADING;
    showLoadingOverlay("GENERATING LEVEL");
    setTimeout(() => {
      initGameObjects();
      player.health = PLAYER_INITIAL_HEALTH;
      player.airSupply = player.initialAirSupply;
      player.lastSonarTime = frameCount - player.sonarCooldown;
      player.lastShotTime = frameCount - player.shotCooldown;
      gameState = gameStates.PLAYING;
      if (audioInitialized && reactorHumOsc && reactorHumOsc.started) {
        reactorHumOsc.amp(0, 0);
      }
    }, 100);
  }
}

function handleKeyPressedPlaying() {
  if (keyCode === KEY_CODE_SPACE) {
    player.shoot();
  }
}

function handleKeyPressedGameOver() {
  if (keyCode === ENTER) {
    if (isSubmittingHighScore && !isSubmissionInProgress) {
      if (playerNameInput.trim().length > 0) {
        submitHighScore();
      }
      // We don't do anything if the name is empty - we'll use visual cues instead
    } else if (!isSubmittingHighScore) {
      resetGame();
    }
  }
}

function handleKeyPressedLevelComplete() {
  if (keyCode === ENTER) {
    prepareNextLevel();
  }
}

function handleKeyPressedGameComplete() {
  if (keyCode === ENTER) {
    resetGame();
  }
}

const keyPressedHandlers = {
  [gameStates.START]: handleKeyPressedStart,
  [gameStates.HIGH_SCORES]: handleKeyPressedHighScores,
  [gameStates.PLAYING]: handleKeyPressedPlaying,
  [gameStates.GAME_OVER]: handleKeyPressedGameOver,
  [gameStates.LEVEL_COMPLETE]: handleKeyPressedLevelComplete,
  [gameStates.GAME_COMPLETE]: handleKeyPressedGameComplete,
};

function keyPressed() {
  if (!audioInitialized && (keyCode === ENTER && (gameState === gameStates.START || gameState === gameStates.HIGH_SCORES || gameState === gameStates.LEVEL_COMPLETE || gameState === gameStates.GAME_OVER || gameState === gameStates.GAME_COMPLETE))) {
    startAudioRoutine();
  }

  if (key === ']') {
    debugShowWalls = !debugShowWalls;
    console.log("Debug wall view:", debugShowWalls ? "ON" : "OFF");
  }

  const handler = keyPressedHandlers[gameState];
  if (handler) {
    handler();
  }
}

function keyTyped() {
  if (gameState === gameStates.GAME_OVER && isSubmittingHighScore && !isMobileControlsEnabled()) {
    if (key.length === 1 && key.match(/[a-zA-Z0-9 ]/)) {
      if (playerNameInput.length < 20) {
        playerNameInput += key;
      }
    } else if (keyCode === BACKSPACE && playerNameInput.length > 0) {
      playerNameInput = playerNameInput.slice(0, -1);
    }
  }
}

function handleTouchStart() {
  if (!audioInitialized) {
    startAudioRoutine();
  }

  if (gameState === gameStates.GAME_OVER && isSubmittingHighScore && isMobileControlsEnabled() && !isMobileInputFocused && !isSubmissionInProgress) {
    if (highscoreInputElement) {
      console.log("User tapped, focusing high score input element.");
      highscoreInputElement.focus();
      isMobileInputFocused = true;
    } else {
      const name = prompt("NEW HIGH SCORE! Enter your name (20 chars max):", "");
      if (name && name.trim().length > 0 && !isSubmissionInProgress) {
        playerNameInput = name.trim();
        submitHighScore();
      }
      // No feedback needed for mobile prompt - user will see empty dialog
    }
    return true;
  }

  const touchHandlers = {
    [gameStates.START]: () => {
      gameState = gameStates.HIGH_SCORES;
      highScores = null;
      highScoreManager.getHighScores().then(scores => { highScores = scores; }).catch(error => { console.error('Failed to load high scores:', error); highScores = []; });
      return true;
    },
    [gameStates.HIGH_SCORES]: () => {
      gameState = gameStates.LOADING;
      showLoadingOverlay("GENERATING LEVEL");
      setTimeout(() => {
        initGameObjects();
        player.health = PLAYER_INITIAL_HEALTH;
        player.airSupply = player.initialAirSupply;
        player.lastSonarTime = frameCount - player.sonarCooldown;
        player.lastShotTime = frameCount - player.shotCooldown;
        gameState = gameStates.PLAYING;
        if (audioInitialized && reactorHumOsc && reactorHumOsc.started) {
          reactorHumOsc.amp(0, 0);
        }
      }, 100);
      return true;
    },
    [gameStates.GAME_OVER]: () => {
      if (!isSubmittingHighScore) {
        resetGame();
      }
      return true;
    },
    [gameStates.GAME_COMPLETE]: () => {
      resetGame();
      return true;
    },
    [gameStates.LEVEL_COMPLETE]: () => {
      prepareNextLevel();
      return true;
    }
  };

  if (isMobileControlsEnabled()) {
    const handler = touchHandlers[gameState];
    if (handler) {
      return handler();
    }
  }
  return false;
}

function touchStarted() {
  if (handleTouchStart()) {
    return false; // Consume the touch if a state transition happened
  }

  if (typeof handleMobileTouchStart === 'function') {
    handleMobileTouchStart(touches);
  }
  return false;
}

function touchMoved() {
  if (typeof handleMobileTouchMove === 'function') {
    handleMobileTouchMove(touches);
  }
  return false;
}

function touchEnded() {
  if (typeof handleMobileTouchEnd === 'function') {
    handleMobileTouchEnd(touches);
  }
  return false;
}

// --- Drawing Functions ---

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
  
  // Add spinning indicator
  push();
  translate(width / 2, height / 2 + 60);
  rotate(millis() * 0.01); // Rotate based on time
  stroke(60, 100, 100); // Yellow color in HSB
  strokeWeight(4);
  noFill();
  // Draw partial circle (spinner)
  arc(0, 0, 40, 40, 0, PI * 1.5);
  pop();
  
  // Optional: Add level information
  if (typeof currentLevel !== 'undefined') {
    fill(0, 0, 80, 180); // Semi-transparent white (HSB)
    noStroke(); // Ensure no stroke for text
    textAlign(CENTER, CENTER);
    textSize(24);
    text(`Generating Level ${currentLevel}`, width / 2, height / 2 + 120);
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
  
  // Detect landscape mobile (short height) for compact layout
  const isLandscapeMobile = height < 500;
  const isNarrow = width < 650;
  
  // Adjust layout for landscape mobile
  const titleSize = isLandscapeMobile ? 45 : START_SCREEN_TITLE_TEXT_SIZE;
  const titleY = isLandscapeMobile ? height / 2 - 120 : height / 2 + START_SCREEN_TITLE_Y_OFFSET;
  const infoSize = isLandscapeMobile ? 16 : (isNarrow ? START_SCREEN_INFO_TEXT_SIZE - 2 : START_SCREEN_INFO_TEXT_SIZE);
  const lineSep = infoSize + 4;
  const promptSize = isLandscapeMobile ? 24 : START_SCREEN_PROMPT_TEXT_SIZE;
  
  // Title
  fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B);
  textSize(titleSize);
  text(`Reactor Dive`, width / 2, titleY);
  
  // Text layout
  textSize(infoSize);
  
  if (isLandscapeMobile) {
    // Compact landscape layout - everything closer together
    text("Christian Nold 2025", width / 2, height / 2 - 80);
    
    // Objective - always split in landscape
    let killsForLevel1 = getKillsRequiredForLevel(1);
    text(`Destroy ${killsForLevel1} mutated creatures`, width / 2, height / 2 - 40);
    text(`and reach the flooded reactor`, width / 2, height / 2 - 20);
    
    // Controls - always split in landscape
    if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
      text("Touch controls: Joystick (left)", width / 2, height / 2 + 10);
      text("and Fire button (right)", width / 2, height / 2 + 30);
    } else {
      text("WASD/Arrows: Move. SPACE: Shoot.", width / 2, height / 2 + 20);
    }
    
    // Prompt - closer to bottom
    textSize(promptSize);
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
      text("Tap anywhere to Dive", width / 2, height / 2 + 65);
    } else {
      text("Press ENTER to Dive", width / 2, height / 2 + 65);
    }
  } else {
    // Standard layout for portrait and desktop

    let killsForLevel1 = getKillsRequiredForLevel(1);
    if (isNarrow) {
      text("Christian Nold 2025", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_3);
      text(`Destroy ${killsForLevel1} mutated creatures`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_1 - lineSep/2);
      text(`and reach the flooded reactor`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_1 + lineSep/2);
    } else {
          
      text("Christian Nold 2025", width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_3);
      text(`Destroy ${killsForLevel1} mutated creatures and reach the flooded reactor`, width / 2, height / 2 + START_SCREEN_INFO_Y_OFFSET_1);
    }
    
    // Controls
    let ctrlY = height / 2 + START_SCREEN_INFO_Y_OFFSET_2 + (isNarrow ? lineSep/1.2 : 0);
    if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
      if (isNarrow) {
        text("Touch controls: Joystick (left)", width / 2, ctrlY - lineSep/2);
        text("and Fire button (right)", width / 2, ctrlY + lineSep/2);
      } else {
        text("Touch controls: Joystick (left) and Fire button (right)", width / 2, ctrlY);
      }
    } else {
      text("WASD/Arrows: Move. SPACE: Shoot.", width / 2, ctrlY);
    }
    
    // Prompt
    textSize(promptSize);
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
      text("Tap anywhere to Dive", width / 2, height / 2 + START_SCREEN_PROMPT_Y_OFFSET);
    } else {
      text("Press ENTER to Dive", width / 2, height / 2 + START_SCREEN_PROMPT_Y_OFFSET);
    }
  }
  if (!audioInitialized) {
      textSize(START_SCREEN_AUDIO_NOTE_TEXT_SIZE); fill(START_SCREEN_AUDIO_NOTE_COLOR_H, START_SCREEN_AUDIO_NOTE_COLOR_S, START_SCREEN_AUDIO_NOTE_COLOR_B);
      //text("(Sound will enable after you press Enter or Click)", width/2, height/2 + START_SCREEN_AUDIO_NOTE_Y_OFFSET);
 }
}

function drawHighScoreScreen() {
  background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
  textAlign(CENTER, CENTER);
  
  // Detect landscape mobile (short height) for compact layout
  const isLandscapeMobile = height < 500;
  
  // Adjust sizes for landscape mobile
  const titleSize = isLandscapeMobile ? 32 : 48;
  const titleY = isLandscapeMobile ? height / 2 - 120 : height / 2 - 200;
  const scoreSize = isLandscapeMobile ? 18 : 24;
  const scoreStartY = isLandscapeMobile ? height / 2 - 80 : height / 2 - 150;
  const scoreSpacing = isLandscapeMobile ? 22 : 30;
  const instructionSize = isLandscapeMobile ? 16 : 20;
  const instructionY = isLandscapeMobile ? height / 2 + 160 : height / 2 + 240;
  
  // Title
  fill(0, 0, 100); // White text
  textSize(titleSize);
  text("HIGH SCORES", width / 2, titleY);
  
  // High scores list
  textSize(scoreSize);
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
      let yPos = scoreStartY + i * scoreSpacing;
      text(`${i + 1}. ${score.name}: ${score.score}`, width / 2, yPos);
    }
  }
  
  // Instructions
  textSize(instructionSize);
  fill(60, 100, 100); // Yellow prompt text
  if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
    text("Tap to Play", width / 2, instructionY);
  } else {
    text("Press ENTER to Play", width / 2, instructionY);
  }
}

function drawLevelCompleteScreen() {
  textAlign(CENTER, CENTER); 
  fill(LEVEL_COMPLETE_TITLE_COLOR_H, LEVEL_COMPLETE_TITLE_COLOR_S, LEVEL_COMPLETE_TITLE_COLOR_B); textSize(LEVEL_COMPLETE_TITLE_TEXT_SIZE);
  text(`LEVEL ${currentLevel} CLEARED!`, width / 2, height / 2 + LEVEL_COMPLETE_TITLE_Y_OFFSET); 
  
  // Show score information
  textSize(LEVEL_COMPLETE_INFO_TEXT_SIZE);
  let timeLeftInSeconds = Math.max(0, Math.floor(player.airSupply / 60));
  let timeBonus = timeLeftInSeconds * 10;
  let levelBonus = 500;
  text(`Time bonus: ${timeLeftInSeconds} seconds`, width / 2, height / 2 + LEVEL_COMPLETE_INFO_Y_OFFSET);
  let killsForNextLevel = getKillsRequiredForLevel(currentLevel+1);
  text(`Next Level: Destroy ${killsForNextLevel} enemies and reach the reactor`, width/2, height / 2 + LEVEL_COMPLETE_INFO_Y_OFFSET + 60);
  
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
  if (!isHighScoreChecked) {
    isHighScoreChecked = true;
    console.log('Checking if score', totalScore, 'is a high score...');
    
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
  text("Game Over", width/2, height/2 + GAME_OVER_TITLE_Y_OFFSET);
  textSize(GAME_OVER_INFO_TEXT_SIZE);
  text(player.health <= 0 ? "Submarine Destroyed!" : "Air Supply Depleted!", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET);
  text(`Total Score: ${totalScore}`, width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 30);
  
  if (isSubmittingHighScore) {
    push();
    fill(60, 100, 100);
    textSize(GAME_OVER_INFO_TEXT_SIZE + 6);
    text("NEW HIGH SCORE!", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 100);
    pop();
    
    fill(60, 80, 90);
    textSize(GAME_OVER_INFO_TEXT_SIZE - 2);
    const namePromptY = height/2 + GAME_OVER_INFO_Y_OFFSET + 110;
    
    if (isMobileControlsEnabled()) {
      updateHighScoreInputVisibility(true);
      
      fill(60, 60, 80);
      textSize(GAME_OVER_INFO_TEXT_SIZE - 4);
      if (isSubmissionInProgress) {
        fill(60, 100, 100);
        text("SUBMITTING SCORE...", width/2, height/2 + GAME_OVER_PROMPT_Y_OFFSET + 60);
      } else {
        text("Tap to enter name, then press Enter", width/2, height/2 + GAME_OVER_PROMPT_Y_OFFSET + 60);
      }
    } else {
      updateHighScoreInputVisibility(false); // Hide on desktop
      push();
      if (isSubmissionInProgress) {
        fill(0, 0, 20, 200);
        stroke(60, 60, 60);
      } else {
        fill(0, 0, 20, 200);
        stroke(60, 100, 100);
      }
      strokeWeight(2);
      rectMode(CENTER);
      let textWidth = max(200, playerNameInput.length * 12 + 40);
      rect(width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 150, textWidth, 40, 5);
      
      noStroke();
      textSize(GAME_OVER_INFO_TEXT_SIZE);
      if (isSubmissionInProgress) {
        fill(60, 60, 80);
        text("SUBMITTING...", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 150);
      } else {
        fill(60, 100, 100);
        text(playerNameInput + "_", width/2, height/2 + GAME_OVER_INFO_Y_OFFSET + 150);
      }
      pop();
      
      fill(60, 60, 80);
      textSize(GAME_OVER_INFO_TEXT_SIZE - 4);
    }
  } else {
    updateHighScoreInputVisibility(false);
    
    if (typeof isMobileControlsEnabled === 'function' && isMobileControlsEnabled()) {
      text("Tap to Restart", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
    } else {
      text("Press ENTER to Restart", width / 2, height / 2 + GAME_OVER_PROMPT_Y_OFFSET);
    }
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
  
  // Render radiation pulse effect (subtle directional indicator to reactor)
  // This needs to be after player.update() so sonar detection flag is current
  renderRadiationPulse(cameraOffsetX, cameraOffsetY);
  
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
          createExplosion(projectiles[i].pos.x, projectiles[i].pos.y, 'enemy'); // Create enemy explosion before splicing
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
        let d = dist(projectiles[i].pos.x, projectiles[i].pos.y, jellyfish[j].pos.x, jellyfish[j].pos.y);
        if (d < projectiles[i].radius + jellyfish[j].radius) {
          // Jellyfish takes damage instead of being destroyed immediately
          let destroyed = jellyfish[j].takeDamage();
          createExplosion(projectiles[i].pos.x, projectiles[i].pos.y, 'creature');
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
      if(gameState === gameStates.PLAYING) {
        let timeLeftInSeconds = Math.max(0, Math.floor(player.airSupply / 60));
        levelScore = timeLeftInSeconds * 10;
        playSound('gameOver');
        
        isHighScoreChecked = false;
        isSubmittingHighScore = false;
        playerNameInput = '';
        isHighScoreResult = false;
      }
      gameState = gameStates.GAME_OVER;
  } else if (cave.isGoal(player.pos.x, player.pos.y) && killsStillNeeded === 0) {
    let timeLeftInSeconds = Math.max(0, Math.floor(player.airSupply / 60));
    levelScore = (timeLeftInSeconds * 10) + 500;
    totalScore += levelScore;
    gameState = (currentLevel >= MAX_LEVELS) ? gameStates.GAME_COMPLETE : gameStates.LEVEL_COMPLETE;
  }
}

