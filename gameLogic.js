// --- Game Logic Functions ---

// Setup a new level
function setupLevel() {
    // Generate cave
    generateCave();
    
    // Spawn player
    spawnPlayer();
    
    // Spawn enemies
    spawnEnemies();
    
    // Generate current areas
    generateCurrentAreas();
    
    // Update camera
    updateCamera();
    
    console.log(`Level ${level} setup complete. Target kills: ${getKillsRequired()}`);
}

// Generate cave structure
function generateCave() {
    // Create Cave object using the existing Cave class
    cave = new Cave(WORLD_WIDTH, WORLD_HEIGHT, cellSize);
    console.log(`Cave generated: ${cave.gridWidth}x${cave.gridHeight} cells`);
}



// Check if a position collides with cave walls
function checkWallCollision(x, y, radius) {
    if (!cave) return true;
    return cave.isWall(x, y, radius);
}

// Spawn player at a safe location
function spawnPlayer() {
    if (!cave) {
        console.error("Cannot spawn player: cave not generated");
        return;
    }
    
    // Find a safe spawn location manually
    const centerY = WORLD_HEIGHT / 2;
    let attempts = 0;
    let spawned = false;
    
    while (!spawned && attempts < MAX_PLAYER_SPAWN_ATTEMPTS) {
        const startX = (PLAYER_START_X_BASE_CELLS + attempts * PLAYER_START_X_ATTEMPT_INCREMENT_CELLS) * cellSize;
        const startY = centerY + (Math.random() - 0.5) * PLAYER_START_Y_RANDOM_RANGE_CELLS * cellSize;
        
        // Check if position is safe
        const checkRadius = PLAYER_RADIUS * PLAYER_SPAWN_RADIUS_BUFFER_CELL_FACTOR;
        if (!cave.isWall(startX, startY, checkRadius)) {
            // Create player using PlayerSub class
            const airForLevel = max(
                INITIAL_AIR_SUPPLY_BASE - (level - 1) * AIR_SUPPLY_LEVEL_REDUCTION,
                MIN_AIR_SUPPLY_PER_LEVEL
            );
            const airDepletion = getAirDepletionRate();
            
            player = new PlayerSub(startX, startY, airForLevel, airDepletion);
            
            // Sync with global state
            playerHealth = player.health;
            airSupply = player.airSupply;
            
            spawned = true;
            console.log(`Player spawned at (${startX.toFixed(0)}, ${startY.toFixed(0)}) after ${attempts + 1} attempts`);
        }
        
        attempts++;
    }
    
    if (!spawned) {
        console.error("Failed to spawn player after maximum attempts");
        // Fallback: create player at a default position
        const airForLevel = max(
            INITIAL_AIR_SUPPLY_BASE - (level - 1) * AIR_SUPPLY_LEVEL_REDUCTION,
            MIN_AIR_SUPPLY_PER_LEVEL
        );
        const airDepletion = getAirDepletionRate();
        
        player = new PlayerSub(cellSize * 3, WORLD_HEIGHT / 2, airForLevel, airDepletion);
        playerHealth = player.health;
        airSupply = player.airSupply;
    }
}

// Spawn enemies throughout the level
function spawnEnemies() {
    enemies = [];
    jellyfish = [];
    
    if (!cave || !player) {
        console.error("Cannot spawn enemies: cave or player not available");
        return;
    }
    
    const enemyCount = Math.min(
        BASE_ENEMY_COUNT + (level - 1) * ENEMY_COUNT_PER_LEVEL_INCREASE,
        MAX_ENEMY_COUNT
    );
    
    let spawnedEnemies = 0;
    let attempts = 0;
    
    while (spawnedEnemies < enemyCount && attempts < MAX_ENEMY_SPAWN_ATTEMPTS * enemyCount) {
        const x = randomRange(
            WORLD_WIDTH * ENEMY_SPAWN_MIN_X_WORLD_FACTOR,
            WORLD_WIDTH * ENEMY_SPAWN_MAX_X_WORLD_FACTOR
        );
        const y = randomRange(
            WORLD_HEIGHT * ENEMY_SPAWN_MIN_Y_WORLD_FACTOR,
            WORLD_HEIGHT * ENEMY_SPAWN_MAX_Y_WORLD_FACTOR
        );
        
        // Check if position is safe and not too close to player
        const distToPlayer = distance(x, y, player.pos.x, player.pos.y);
        const minDistFromPlayer = 200;
        
        if (!cave.isWall(x, y, ENEMY_SPAWN_WALL_CHECK_RADIUS) && 
            distToPlayer > minDistFromPlayer) {
            
            // Randomly choose enemy type
            if (Math.random() < 0.2 && level >= 3) { // 20% chance for jellyfish starting at level 3
                // Spawn jellyfish
                const newJellyfish = new Jellyfish(x, y);
                jellyfish.push(newJellyfish);
            } else {
                // Spawn regular enemy
                const newEnemy = new Enemy(x, y, level);
                enemies.push(newEnemy);
            }
            
            spawnedEnemies++;
        }
        
        attempts++;
    }
    
    console.log(`Spawned ${enemies.length} enemies and ${jellyfish.length} jellyfish`);
}

// Generate current areas for this level
function generateCurrentAreas() {
    currentAreas = [];
    
    for (let i = 0; i < CURRENT_AREAS_PER_LEVEL; i++) {
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 20) {
            const x = randomRange(
                CURRENT_AREA_PADDING_FROM_PLAYER_START,
                WORLD_WIDTH - CURRENT_AREA_PADDING_FROM_GOAL - CURRENT_AREA_MAX_WIDTH
            );
            const y = randomRange(0, WORLD_HEIGHT - CURRENT_AREA_MAX_HEIGHT);
            const width = randomRange(CURRENT_AREA_MIN_WIDTH, CURRENT_AREA_MAX_WIDTH);
            const height = randomRange(CURRENT_AREA_MIN_HEIGHT, CURRENT_AREA_MAX_HEIGHT);
            
            // Check if area overlaps with walls or other current areas
            const areaIsSafe = checkAreaIsSafe(x, y, width, height);
            
            if (areaIsSafe) {
                const angle = Math.random() * 2 * Math.PI;
                const force = randomRange(CURRENT_FORCE_MAGNITUDE_MIN, CURRENT_FORCE_MAGNITUDE_MAX);
                
                currentAreas.push({
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    forceX: Math.cos(angle) * force,
                    forceY: Math.sin(angle) * force,
                    bubbles: []
                });
                
                placed = true;
            }
            
            attempts++;
        }
    }
    
    console.log(`Generated ${currentAreas.length} current areas`);
}

// Check if an area is safe for current placement
function checkAreaIsSafe(x, y, width, height) {
    if (!cave || !player) return false;
    
    // Check multiple points within the area
    const checkPoints = 5;
    for (let i = 0; i < checkPoints; i++) {
        for (let j = 0; j < checkPoints; j++) {
            const checkX = x + (width / checkPoints) * i;
            const checkY = y + (height / checkPoints) * j;
            
            if (cave.isWall(checkX, checkY, 10)) {
                return false;
            }
        }
    }
    
    // Check distance from player start
    const distFromPlayer = distance(x + width/2, y + height/2, player.pos.x, player.pos.y);
    if (distFromPlayer < 150) {
        return false;
    }
    
    return true;
}

// Update camera to follow player
function updateCamera() {
    if (!player) return;
    
    // Smooth camera following
    const targetX = player.pos.x;
    const targetY = player.pos.y;
    
    const lerpFactor = 0.1;
    camera.x = lerp(camera.x, targetX, lerpFactor);
    camera.y = lerp(camera.y, targetY, lerpFactor);
    
    // Keep camera within world bounds
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    camera.x = clamp(camera.x, halfWidth, WORLD_WIDTH - halfWidth);
    camera.y = clamp(camera.y, halfHeight, WORLD_HEIGHT - halfHeight);
}

// Check if player reached the goal
function checkGoalReached() {
    if (!player || !cave) return false;
    return cave.isGoal(player.pos.x, player.pos.y);
}

// Update game logic
function updateGame() {
    if (!player) return;
    
    // Update air supply
    airSupply -= getAirDepletionRate();
    if (airSupply <= 0) {
        airSupply = 0;
        playerHealth = 0; // Player dies from lack of air
    }
    
    // Update player
    updatePlayer();
    
    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        
        // Remove dead enemies
        if (enemies[i].health <= 0) {
            enemies.splice(i, 1);
            killCount++;
            score += 100 * level;
            
            if (soundManager) {
                soundManager.playEnemyHit();
            }
        }
    }
    
    // Update jellyfish
    for (let i = jellyfish.length - 1; i >= 0; i--) {
        jellyfish[i].update();
        
        // Remove dead jellyfish
        if (jellyfish[i].health <= 0) {
            jellyfish.splice(i, 1);
            killCount++;
            score += 200 * level; // Jellyfish worth more points
            
            if (soundManager) {
                soundManager.playEnemyHit();
            }
        }
    }
    
    // Update projectiles
    updateProjectiles();
    
    // Update bubbles
    updateBubbles();
    
    // Update current areas and their effects
    updateCurrentAreas();
    
    // Update camera
    updateCamera();
    
    // Check win condition
    if (checkGoalReached() && killCount >= getKillsRequired()) {
        // Level complete
        const bonus = calculateLevelBonus();
        score += bonus;
        
        if (level >= MAX_LEVELS) {
            gameState = 'gameComplete';
        } else {
            gameState = 'levelComplete';
        }
        
        if (soundManager) {
            soundManager.playLevelComplete();
        }
    }
    
    // Check lose condition
    if (playerHealth <= 0) {
        gameState = 'gameOver';
        
        if (soundManager) {
            soundManager.playGameOver();
        }
    }
    
    // Play ambient sounds
    if (soundManager) {
        soundManager.playAmbientSonar();
    }
}

// Update player
function updatePlayer() {
    if (!player) return;
    
    // Use PlayerSub's update method
    player.update(cave, enemies);
    
    // Update player health from global variable
    player.health = playerHealth;
    player.airSupply = airSupply;
    
    // Update global variables from player
    playerHealth = player.health;
    airSupply = player.airSupply;
}

// Update projectiles
function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update();
        
        // Check if projectile should be removed
        if (projectiles[i].shouldRemove()) {
            projectiles.splice(i, 1);
        }
    }
}

// Update bubbles
function updateBubbles() {
    // Update all bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].update();
        
        // Remove expired bubbles
        if (bubbles[i].shouldRemove()) {
            bubbles.splice(i, 1);
        }
    }
    
    // Update current area bubbles
    for (let area of currentAreas) {
        for (let i = area.bubbles.length - 1; i >= 0; i--) {
            area.bubbles[i].update();
            
            if (area.bubbles[i].shouldRemove()) {
                area.bubbles.splice(i, 1);
            }
        }
    }
}

// Update current areas and their effects
function updateCurrentAreas() {
    for (let area of currentAreas) {
        // Apply current force to player if in area
        if (player && pointInRect(player.pos.x, player.pos.y, area.x, area.y, area.width, area.height)) {
            player.vel.add(area.forceX, area.forceY);
        }
        
        // Spawn bubbles in current areas
        if (Math.random() < CURRENT_BUBBLE_SPAWN_DENSITY * area.width * area.height) {
            const bubbleX = randomRange(area.x, area.x + area.width);
            const bubbleY = randomRange(area.y, area.y + area.height);
            
            // Create current area bubble (if Bubble class exists)
            if (typeof Bubble !== 'undefined') {
                const currentBubble = new Bubble(bubbleX, bubbleY);
                currentBubble.vel.y *= CURRENT_BUBBLE_SPEED_MULTIPLIER;
                currentBubble.lifespan *= CURRENT_BUBBLE_LIFESPAN_FACTOR;
                area.bubbles.push(currentBubble);
            }
        }
    }
}

