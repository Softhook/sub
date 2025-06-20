// --- Game State Variables ---

// Game states
let gameState = 'start'; // 'start', 'playing', 'levelComplete', 'gameComplete', 'gameOver', 'highScore'
let level = 1;
let currentLevel = 1; // For Cave class compatibility
let killCount = 0;
let cellSize = BASE_CELL_SIZE;
let score = 0;
let highScores = [];
let playerNameForHighScore = '';

// Player state
let player;
let playerHealth = PLAYER_INITIAL_HEALTH;
let airSupply;
let lastShotTime = 0;
let lastSonarTime = 0;

// Input state
let keys = {};
let touches = new Set();

// Game world state
let cave = null;
let caveCells = [];
let enemies = [];
let jellyfish = [];
let projectiles = [];
let currentAreas = [];
let bubbles = [];
let sonarHits = [];
let targetKills = BASE_KILLS_REQUIRED;

// Camera and viewport
let camera = { x: 0, y: 0 };

// High score system
let highScoreManager = null;

// Game timing
let levelStartTime = 0;

// Audio state
let lastLowAirBeepTime = 0;

// Mobile controls
let mobileThrust = false;
let mobileReverse = false;
let mobileLeft = false;
mobileRight = false;

// Initialize game state variables
function initializeGameState() {
    level = 1;
    currentLevel = 1;
    score = 0;
    killCount = 0;
    cellSize = BASE_CELL_SIZE;
    playerHealth = PLAYER_INITIAL_HEALTH;
    airSupply = INITIAL_AIR_SUPPLY_BASE;
    targetKills = BASE_KILLS_REQUIRED;
    levelStartTime = millis();
    playerNameForHighScore = '';
    
    // Clear game objects
    cave = null;
    enemies = [];
    jellyfish = [];
    projectiles = [];
    bubbles = [];
    sonarHits = [];
    currentAreas = [];
}

// Reset game variables for a new game
function resetGame() {
    initializeGameState();
    gameState = 'playing';
    setupLevel();
}

// Advance to next level
function nextLevel() {
    level++;
    currentLevel = level;
    cellSize = BASE_CELL_SIZE + (level - 1) * 2;
    killCount = 0;
    targetKills = BASE_KILLS_REQUIRED + (level - 1) * KILLS_INCREASE_PER_LEVEL;
    
    // Reset air supply with level adjustments
    airSupply = max(
        INITIAL_AIR_SUPPLY_BASE - (level - 1) * AIR_SUPPLY_LEVEL_REDUCTION,
        MIN_AIR_SUPPLY_PER_LEVEL
    );
    
    levelStartTime = millis();
    
    // Clear transient game objects
    cave = null;
    enemies = [];
    jellyfish = [];
    projectiles = [];
    bubbles = [];
    sonarHits = [];
    currentAreas = [];
    
    setupLevel();
}

// Calculate score bonus for completing a level
function calculateLevelBonus() {
    const timeElapsed = millis() - levelStartTime;
    const timeInSeconds = timeElapsed / 1000;
    const airRemaining = airSupply;
    const healthRemaining = playerHealth;
    
    // Base bonus increases with level
    let bonus = level * 1000;
    
    // Time bonus (faster completion = more points)
    const maxTimeBonus = 2000;
    const timeBonusFactor = max(0, 1 - (timeInSeconds / 300)); // 5 minutes max time
    bonus += maxTimeBonus * timeBonusFactor;
    
    // Air bonus
    const maxAirBonus = 1500;
    const airBonusFactor = airRemaining / INITIAL_AIR_SUPPLY_BASE;
    bonus += maxAirBonus * airBonusFactor;
    
    // Health bonus
    const maxHealthBonus = 1000;
    const healthBonusFactor = healthRemaining / PLAYER_INITIAL_HEALTH;
    bonus += maxHealthBonus * healthBonusFactor;
    
    return Math.floor(bonus);
}

// Check if score qualifies for high score list
function isHighScore(currentScore) {
    if (highScores.length < 10) return true;
    return currentScore > highScores[highScores.length - 1].score;
}

// Add score to high score list
function addHighScore(name, score) {
    const newScore = { name: name, score: score };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 10) {
        highScores = highScores.slice(0, 10);
    }
}

// Get kills required for current level
function getKillsRequired() {
    return BASE_KILLS_REQUIRED + (level - 1) * KILLS_INCREASE_PER_LEVEL;
}

// Get air depletion rate for current level
function getAirDepletionRate() {
    return BASE_AIR_DEPLETION_RATE + (level - 1) * AIR_DEPLETION_LEVEL_INCREASE;
}

// Check if player has low air
function hasLowAir() {
    const totalAirSupply = INITIAL_AIR_SUPPLY_BASE - (level - 1) * AIR_SUPPLY_LEVEL_REDUCTION;
    const threshold = totalAirSupply * PLAYER_LOW_AIR_THRESHOLD_FACTOR;
    return airSupply <= threshold;
}
