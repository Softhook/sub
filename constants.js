// --- Configuration Constants ---

// Game Mechanics & World
const BASE_CELL_SIZE = 20; // Base size, will increase per level
const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 2000;
const MAX_LEVELS = 10;
const INITIAL_AIR_SUPPLY_BASE = 6000; // Base air supply in frames
const AIR_SUPPLY_LEVEL_REDUCTION = 0; // Air reduction per level
const MIN_AIR_SUPPLY_PER_LEVEL = 3000; // Minimum air supply
const BASE_AIR_DEPLETION_RATE = 1; // Base air depletion per frame
const AIR_DEPLETION_LEVEL_INCREASE = 0.1; // Additional depletion per level
const LEVEL_EXIT_MAX_ENEMIES_THRESHOLD = 0; // Max enemies to exit level

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
const SONAR_BUBBLE_COLOR_H = 180; 
const SONAR_BUBBLE_COLOR_S = 70; 
const SONAR_BUBBLE_COLOR_B = 95;
const SONAR_BUBBLE_ALPHA_MAX = 180;

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
const PLAYER_FIN_X1_FACTOR = -0.9; 
const PLAYER_FIN_Y1_FACTOR = -0.5;
const PLAYER_FIN_X2_FACTOR = -0.9; 
const PLAYER_FIN_Y2_FACTOR = 0.5;
const PLAYER_FIN_X3_FACTOR = -1.4; 
const PLAYER_FIN_Y3_FACTOR = 0.3;
const PLAYER_FIN_X4_FACTOR = -1.4; 
const PLAYER_FIN_Y4_FACTOR = -0.3;
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

// Spawning
const MAX_PLAYER_SPAWN_ATTEMPTS = 50;
const PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR = 1.5; // Multiplier of CELL_SIZE
const PLAYER_START_X_BASE_CELLS = 5;
const PLAYER_START_X_ATTEMPT_INCREMENT_CELLS = 0.2;
const PLAYER_START_Y_RANDOM_RANGE_CELLS = 4; // +/- from center

const MAX_ENEMY_SPAWN_ATTEMPTS = 20;
const ENEMY_SPAWN_RADIUS_BUFFER_CELL_FACTOR = 1.5; // Multiplier of CELL_SIZE
const MIN_ENEMY_DISTANCE_FROM_PLAYER_CELLS = 10; // Minimum distance from player spawn

const MAX_JELLYFISH_SPAWN_ATTEMPTS = 20;
const JELLYFISH_SPAWN_RADIUS_BUFFER_CELL_FACTOR = 2; // Multiplier of CELL_SIZE
const MIN_JELLYFISH_DISTANCE_FROM_PLAYER_CELLS = 15; // Minimum distance from player spawn

// Enemy/Jellyfish distribution
const ENEMIES_PER_LEVEL_BASE = 4;
const ENEMIES_PER_LEVEL_INCREMENT = 2;
const JELLYFISH_PER_LEVEL_BASE = 0; // Start with no jellyfish
const JELLYFISH_PER_LEVEL_INCREMENT = 1; // Add 1 jellyfish every level after level 1
const JELLYFISH_START_LEVEL = 2; // Jellyfish start appearing from level 2

// Nuclear symbol constants
const NUCLEAR_SYMBOL_RADIUS_FACTOR = 0.6; // Relative to goal square size
const NUCLEAR_SYMBOL_BLADE_COUNT = 3;
const NUCLEAR_SYMBOL_BLADE_ANGLE_SPAN = Math.PI / 6; // 30 degrees per blade
const NUCLEAR_SYMBOL_INNER_RADIUS_FACTOR = 0.3; // Inner circle size
const NUCLEAR_SYMBOL_CENTER_RADIUS_FACTOR = 0.15; // Center circle size

// Current Area Constants
const CURRENT_AREAS_PER_LEVEL = 3; // Number of current areas to create per level
const CURRENT_AREA_SIZE_MIN = 80; // Minimum current area size in pixels
const CURRENT_AREA_SIZE_MAX = 150; // Maximum current area size in pixels
const CURRENT_FORCE_MAGNITUDE_MIN = 0.02; // Minimum force magnitude
const CURRENT_FORCE_MAGNITUDE_MAX = 0.05; // Maximum force magnitude
const CURRENT_BUBBLE_SPAWN_DENSITY = 0.00005; // Bubbles per pixel area, per frame (increased for visibility)
const CURRENT_BUBBLE_SPEED_MULTIPLIER = 2.0; // Speed multiplier for current bubbles
const CURRENT_BUBBLE_SIZE_MIN = 2; // Minimum current bubble size (increased for visibility)
const CURRENT_BUBBLE_SIZE_MAX = 5; // Maximum current bubble size (increased for visibility)
const CURRENT_BUBBLE_LIFESPAN_FACTOR = 2; // Lifespan multiplier for current bubbles
const BUBBLE_LIFESPAN_FRAMES = 60; // Base bubble lifespan in frames

// Color Constants
const BACKGROUND_COLOR_H = 220; 
const BACKGROUND_COLOR_S = 70; 
const BACKGROUND_COLOR_B = 15;

const CAVE_WALL_COLOR_H = 30; 
const CAVE_WALL_COLOR_S = 15; 
const CAVE_WALL_COLOR_B = 25;

const PROJECTILE_COLOR_H = 60; 
const PROJECTILE_COLOR_S = 100; 
const PROJECTILE_COLOR_B = 100; 
const PROJECTILE_COLOR_A = 200;

const PLAYER_SONAR_WALL_COLOR_H = 100; 
const PLAYER_SONAR_WALL_COLOR_S = 50; 
const PLAYER_SONAR_WALL_COLOR_B = 50;

const PLAYER_SONAR_ENEMY_COLOR_H = 0; 
const PLAYER_SONAR_ENEMY_COLOR_S = 70; 
const PLAYER_SONAR_ENEMY_COLOR_B = 70;

const PLAYER_SONAR_JELLYFISH_COLOR_H = 280; 
const PLAYER_SONAR_JELLYFISH_COLOR_S = 80; 
const PLAYER_SONAR_JELLYFISH_COLOR_B = 80; // Purple for jellyfish

const PLAYER_SONAR_GOAL_COLOR_H = 60; 
const PLAYER_SONAR_GOAL_COLOR_S = 100; 
const PLAYER_SONAR_GOAL_COLOR_B = 100; // Yellow for goal

const PLAYER_SONAR_ARC_WEIGHT = 3;
const PLAYER_SONAR_ARC_COLOR_H = 120; 
const PLAYER_SONAR_ARC_COLOR_S = 100; 
const PLAYER_SONAR_ARC_COLOR_B = 100; 
const PLAYER_SONAR_ARC_COLOR_A = 100;

const PLAYER_SHOT_ARC_WEIGHT = 2;
const PLAYER_SHOT_ARC_COLOR_H = 0; 
const PLAYER_SHOT_ARC_COLOR_S = 100; 
const PLAYER_SHOT_ARC_COLOR_B = 100; 
const PLAYER_SHOT_ARC_COLOR_A = 80;

const ENEMY_COLOR_H = 0; 
const ENEMY_COLOR_S = 80; 
const ENEMY_COLOR_B = 80; // Example for direct enemy rendering if added

const PLAYER_COLOR_BODY_H = 80; 
const PLAYER_COLOR_BODY_S = 70; 
const PLAYER_COLOR_BODY_B = 90;

const PLAYER_COLOR_SAIL_H = 70; 
const PLAYER_COLOR_SAIL_S = 65; 
const PLAYER_COLOR_SAIL_B = 85; // Renamed from PLAYER_COLOR_COCKPIT

const PLAYER_COLOR_FIN_H = 75; 
const PLAYER_COLOR_FIN_S = 68; 
const PLAYER_COLOR_FIN_B = 88;

const PLAYER_COLOR_PROPELLER_H = 60; 
const PLAYER_COLOR_PROPELLER_S = 50; 
const PLAYER_COLOR_PROPELLER_B = 70; // New Propeller Color

// Player Bubble Colors (for current areas)
const PLAYER_BUBBLE_COLOR_H = 190; // Light cyan/blue
const PLAYER_BUBBLE_COLOR_S = 60;
const PLAYER_BUBBLE_COLOR_B = 90;
const PLAYER_BUBBLE_ALPHA = 150; // Semi-transparent (out of 255 in HSB mode)

// UI Text Sizes & Positions
const HUD_TEXT_COLOR_H = 50; 
const HUD_TEXT_COLOR_S = 80; 
const HUD_TEXT_COLOR_B = 100;
const HUD_TEXT_SIZE = 18;
const HUD_MARGIN_X = 10;
const HUD_MARGIN_Y = 10;
const HUD_LINE_SPACING = 25; // Was 25, derived from 35-10, 60-35 etc.
const AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR = 60; // Assuming 60fps for display

const START_SCREEN_TITLE_COLOR_H = 50; 
const START_SCREEN_TITLE_COLOR_S = 100; 
const START_SCREEN_TITLE_COLOR_B = 100;
const START_SCREEN_TITLE_TEXT_SIZE = 60;
const START_SCREEN_TITLE_Y_OFFSET = -140;
const START_SCREEN_INFO_TEXT_SIZE = 20;
const START_SCREEN_INFO_Y_OFFSET_1 = -50;
const START_SCREEN_INFO_Y_OFFSET_2 = -10;
const START_SCREEN_INFO_Y_OFFSET_3 = -20;
const START_SCREEN_INFO_Y_OFFSET_4 = 10;

const START_SCREEN_PROMPT_COLOR_H = 120; 
const START_SCREEN_PROMPT_COLOR_S = 100; 
const START_SCREEN_PROMPT_COLOR_B = 100;

const START_SCREEN_AUDIO_NOTE_COLOR_H = 200; 
const START_SCREEN_AUDIO_NOTE_COLOR_S = 80; 
const START_SCREEN_AUDIO_NOTE_COLOR_B = 80;

const LEVEL_COMPLETE_TITLE_COLOR_H = 100; 
const LEVEL_COMPLETE_TITLE_COLOR_S = 100; 
const LEVEL_COMPLETE_TITLE_COLOR_B = 100;
const LEVEL_COMPLETE_TITLE_TEXT_SIZE = 48;
const LEVEL_COMPLETE_TITLE_Y_OFFSET = -30;

const LEVEL_COMPLETE_PROMPT_TEXT_SIZE = 24;
const LEVEL_COMPLETE_PROMPT_Y_OFFSET = 20;

const GAME_OVER_TITLE_COLOR_H = 0; 
const GAME_OVER_TITLE_COLOR_S = 100; 
const GAME_OVER_TITLE_COLOR_B = 100;
const GAME_OVER_TITLE_TEXT_SIZE = 48;
const GAME_OVER_TITLE_Y_OFFSET = -30;

const GAME_OVER_PROMPT_TEXT_SIZE = 24;
const GAME_OVER_PROMPT_Y_OFFSET = 20;

// Audio Constants
const LOW_AIR_BEEP_INTERVAL = 2000; // ms

// Audio Configuration Constants
const SONAR_FREQ = 800;
const SONAR_ENV_ADSR = { aT: 0.05, dT: 0.1, sR: 0.3, rT: 0.2 };
const SONAR_ENV_LEVELS = { aL: 0.8, rL: 0 };

const EXPLOSION_NOISE_ENV_ADSR = { aT: 0.01, dT: 0.1, sR: 0.1, rT: 0.3 };
const EXPLOSION_NOISE_ENV_LEVELS = { aL: 0.6, rL: 0 };
const EXPLOSION_BOOM_ENV_ADSR = { aT: 0.02, dT: 0.2, sR: 0.2, rT: 0.5 };
const EXPLOSION_BOOM_ENV_LEVELS = { aL: 0.4, rL: 0 };
const EXPLOSION_BOOM_MIN_FREQ = 60;
const EXPLOSION_BOOM_MAX_FREQ = 120;

const BUMP_FREQ = 200;
const BUMP_ENV_ADSR = { aT: 0.01, dT: 0.05, sR: 0.8, rT: 0.1 };
const BUMP_ENV_LEVELS = { aL: 0.5, rL: 0 };

const TORPEDO_ENV_ADSR = { aT: 0.05, dT: 0.1, sR: 0.4, rT: 0.3 };
const TORPEDO_ENV_LEVELS = { aL: 0.3, rL: 0 };

const LOW_AIR_FREQ = 400;
const LOW_AIR_ENV_ADSR = { aT: 0.1, dT: 0.2, sR: 0.6, rT: 0.3 };
const LOW_AIR_ENV_LEVELS = { aL: 0.4, rL: 0 };

const REACTOR_HUM_FREQ = 120;
const REACTOR_HUM_ENV_ADSR = { aT: 0.5, dT: 0.3, sR: 0.8, rT: 1.0 };
const REACTOR_HUM_ENV_LEVELS = { aL: 0.3, rL: 0.1 };
const REACTOR_HUM_MAX_DISTANCE = 300;

const CREATURE_GROWL_MIN_FREQ = 80;
const CREATURE_GROWL_MAX_FREQ = 150;
const CREATURE_GROWL_ENV_ADSR = { aT: 0.1, dT: 0.3, sR: 0.4, rT: 0.5 };
const CREATURE_GROWL_ENV_LEVELS = { aL: 0.6, rL: 0 };

const GAME_OVER_IMPACT_ENV_ADSR = { aT: 0.01, dT: 0.1, sR: 0.1, rT: 0.5 };
const GAME_OVER_IMPACT_ENV_LEVELS = { aL: 0.8, rL: 0 };
const GAME_OVER_GROAN_MIN_FREQ = 60;
const GAME_OVER_GROAN_MAX_FREQ = 100;
const GAME_OVER_GROAN_ENV_ADSR = { aT: 0.2, dT: 0.5, sR: 0.6, rT: 1.5 };
const GAME_OVER_GROAN_ENV_LEVELS = { aL: 0.5, rL: 0 };
const GAME_OVER_GROAN_PITCH_DOWN_TARGET_FREQ = 30;
const GAME_OVER_GROAN_PITCH_DOWN_TIME = 2.0;
const GAME_OVER_GROAN_PITCH_DOWN_DELAY = 0.5;
const GAME_OVER_GROAN_DELAY_MS = 300;
const GAME_OVER_FINAL_BOOM_ENV_ADSR = { aT: 0.05, dT: 0.3, sR: 0.1, rT: 1.0 };
const GAME_OVER_FINAL_BOOM_ENV_LEVELS = { aL: 1.0, rL: 0 };
const GAME_OVER_FINAL_BOOM_DELAY_MS = 1500;

// Additional Game Logic Constants
const PLAYER_SPAWN_MAX_X_SEARCH_FACTOR = 0.3;
const BASE_ENEMY_COUNT = 4;
const ENEMY_COUNT_PER_LEVEL_INCREASE = 2;
const MAX_ENEMY_COUNT = 15;
const ENEMY_SPAWN_MIN_X_WORLD_FACTOR = 0.3;
const ENEMY_SPAWN_MAX_X_WORLD_FACTOR = 0.9;
const ENEMY_SPAWN_MIN_Y_WORLD_FACTOR = 0.2;
const ENEMY_SPAWN_MAX_Y_WORLD_FACTOR = 0.8;
const ENEMY_SPAWN_WALL_CHECK_RADIUS = 15;
const KEY_CODE_SPACE = 32;

// Input Key Codes
const KEY_CODE_W = 87;
const KEY_CODE_A = 65;
const KEY_CODE_S = 83;
const KEY_CODE_D = 68;

// Debug Mode
const DEBUG_MODE = true; // Set to true to see debug visuals (temporarily enabled to see current areas)
