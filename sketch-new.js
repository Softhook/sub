// --- Main Sketch File - Streamlined with Modular Components ---

// p5.js setup function
function setup() {
    // Create canvas
    createCanvas(windowWidth, windowHeight);
    
    // Set color mode
    colorMode(HSB, 360, 100, 100, 255);
    
    // Initialize sound manager
    soundManager = initializeSoundManager();
    
    // Load high scores
    if (typeof JSONBinHighScores !== 'undefined') {
        highScoreManager = new JSONBinHighScores();
        highScoreManager.loadHighScores().then(scores => {
            highScores = scores;
            console.log('High scores loaded:', highScores);
        }).catch(error => {
            console.warn('Failed to load high scores:', error);
        });
    }
    
    // Initialize mobile controls if needed
    if (typeof initializeMobileControls === 'function') {
        initializeMobileControls();
    }
    
    // Initialize game state
    initializeGameState();
    
    console.log('Game initialized');
}

// p5.js draw function
function draw() {
    // Set background
    colorMode(HSB, 360, 100, 100, 255);
    background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
    
    // Handle different game states
    switch (gameState) {
        case 'start':
            drawStartScreen();
            break;
            
        case 'playing':
            updateGame();
            drawPlayingState();
            drawHUD();
            break;
            
        case 'levelComplete':
            drawLevelCompleteScreen();
            break;
            
        case 'gameComplete':
            drawGameCompleteScreen();
            break;
            
        case 'gameOver':
            if (isHighScore(score)) {
                gameState = 'highScore';
                drawHighScoreEntryScreen();
            } else {
                drawGameOverScreen();
            }
            break;
            
        case 'highScore':
            drawHighScoreEntryScreen();
            break;
            
        case 'highScores':
            drawHighScoreScreen();
            break;
            
        default:
            drawStartScreen();
            break;
    }
}

// Draw the playing state
function drawPlayingState() {
    if (!player || !cave) return;
    
    // Update camera offset for rendering
    const cameraOffsetX = player.pos.x - width / 2;
    const cameraOffsetY = player.pos.y - height / 2;
    
    push();
    translate(-cameraOffsetX, -cameraOffsetY);
    
    // Render goal if player is near it
    if (cave.isGoal && cave.isGoal(player.pos.x, player.pos.y)) {
        if (cave.renderGoal) {
            cave.renderGoal(cameraOffsetX, cameraOffsetY);
        }
    }
    
    // Render current areas
    drawCurrentAreas(cameraOffsetX, cameraOffsetY);
    
    // Render bubbles
    drawBubbles(cameraOffsetX, cameraOffsetY);
    
    // Render projectiles
    drawProjectiles(cameraOffsetX, cameraOffsetY);
    
    // Render enemies
    drawEnemies(cameraOffsetX, cameraOffsetY);
    
    // Render jellyfish
    drawJellyfish(cameraOffsetX, cameraOffsetY);
    
    // Render player
    if (player.render) {
        player.render(cameraOffsetX, cameraOffsetY);
    } else {
        drawPlayer(cameraOffsetX, cameraOffsetY);
    }
    
    // Render sonar hits
    drawSonarHits(cameraOffsetX, cameraOffsetY);
    
    pop();
    
    // Apply mobile controls if available
    if (typeof applyMobileMovement === 'function') {
        applyMobileMovement();
    }
}

// Draw current areas
function drawCurrentAreas(offsetX, offsetY) {
    for (let area of currentAreas) {
        // Render area if it has a render method
        if (area.render) {
            area.render(offsetX, offsetY);
        }
        
        // Spawn bubbles if it has the method
        if (area.spawnBubbles) {
            area.spawnBubbles(cave, offsetX, offsetY);
        }
    }
}

// Draw all bubbles
function drawBubbles(offsetX, offsetY) {
    // Draw global bubbles
    for (let bubble of bubbles) {
        if (bubble.render && isOnScreen(bubble.x, bubble.y, 50)) {
            bubble.render(offsetX, offsetY);
        }
    }
    
    // Draw current area bubbles
    for (let area of currentAreas) {
        if (area.bubbles) {
            for (let bubble of area.bubbles) {
                if (bubble.render && isOnScreen(bubble.x, bubble.y, 50)) {
                    bubble.render(offsetX, offsetY);
                }
            }
        }
    }
}

// Draw projectiles
function drawProjectiles(offsetX, offsetY) {
    for (let projectile of projectiles) {
        if (projectile.render && isOnScreen(projectile.pos.x, projectile.pos.y, 50)) {
            projectile.render(offsetX, offsetY);
        }
    }
}

// Draw enemies
function drawEnemies(offsetX, offsetY) {
    const margin = 100;
    
    for (let enemy of enemies) {
        // Check if enemy is near viewport
        if (enemy.pos.x + enemy.radius >= offsetX - margin &&
            enemy.pos.x - enemy.radius <= offsetX + width + margin &&
            enemy.pos.y + enemy.radius >= offsetY - margin &&
            enemy.pos.y - enemy.radius <= offsetY + height + margin) {
            
            if (enemy.render) {
                enemy.render(offsetX, offsetY);
            }
        }
    }
}

// Draw jellyfish
function drawJellyfish(offsetX, offsetY) {
    // Jellyfish are usually only visible through sonar, but we can render them if they have a render method
    for (let jelly of jellyfish) {
        if (jelly.render && isOnScreen(jelly.pos.x, jelly.pos.y, jelly.radius + 50)) {
            jelly.render(offsetX, offsetY);
        }
    }
}

// Draw player (fallback if PlayerSub doesn't have render method)
function drawPlayer(offsetX, offsetY) {
    if (!player) return;
    
    push();
    translate(player.pos.x, player.pos.y);
    rotate(player.angle);
    
    // Simple submarine rendering
    fill(PLAYER_COLOR_BODY_H, PLAYER_COLOR_BODY_S, PLAYER_COLOR_BODY_B);
    stroke(0, 0, 100);
    strokeWeight(DEFAULT_STROKE_WEIGHT);
    
    ellipse(0, 0, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);
    
    // Simple direction indicator
    line(0, 0, PLAYER_RADIUS, 0);
    
    pop();
}

// Draw sonar hits
function drawSonarHits(offsetX, offsetY) {
    if (!player || !player.sonarHits) return;
    
    for (let hit of player.sonarHits) {
        if (isOnScreen(hit.x, hit.y, 50)) {
            const age = frameCount - hit.receivedAt;
            const maxAge = player.sonarDisplayTime * PLAYER_SONAR_HIT_MAX_AGE_FACTOR;
            
            if (age < maxAge) {
                const alpha = map(age, 0, maxAge, PLAYER_SONAR_HIT_ALPHA_MAX, PLAYER_SONAR_HIT_ALPHA_MIN);
                const size = map(hit.intensity, PLAYER_SONAR_ENEMY_INTENSITY_MIN, PLAYER_SONAR_ENEMY_INTENSITY_MAX, 
                               PLAYER_SONAR_HIT_SIZE_MIN, PLAYER_SONAR_HIT_SIZE_MAX);
                
                push();
                // Set color based on hit type
                if (hit.type === 'enemy') {
                    fill(PLAYER_SONAR_ENEMY_COLOR_H, PLAYER_SONAR_ENEMY_COLOR_S, PLAYER_SONAR_ENEMY_COLOR_B, alpha);
                } else if (hit.type === 'jellyfish') {
                    fill(PLAYER_SONAR_JELLYFISH_COLOR_H, PLAYER_SONAR_JELLYFISH_COLOR_S, PLAYER_SONAR_JELLYFISH_COLOR_B, alpha);
                } else if (hit.type === 'goal') {
                    fill(PLAYER_SONAR_GOAL_COLOR_H, PLAYER_SONAR_GOAL_COLOR_S, PLAYER_SONAR_GOAL_COLOR_B, alpha);
                } else {
                    fill(PLAYER_SONAR_WALL_COLOR_H, PLAYER_SONAR_WALL_COLOR_S, PLAYER_SONAR_WALL_COLOR_B, alpha);
                }
                
                noStroke();
                ellipse(hit.x, hit.y, size, size);
                pop();
            }
        }
    }
}

// Mouse pressed event
function mousePressed() {
    handleGameInput();
    
    // Handle player shooting in game
    if (gameState === 'playing' && player && player.shoot) {
        if (frameCount - lastShotTime >= PLAYER_SHOT_COOLDOWN_FRAMES) {
            player.shoot();
            lastShotTime = frameCount;
            
            if (soundManager) {
                soundManager.playTorpedoFire();
            }
        }
    }
    
    // Initialize audio on first interaction
    if (soundManager && !soundManager.audioInitialized) {
        soundManager.initializeAudio();
    }
}

// Key pressed event
function keyPressed() {
    // Handle game input
    handleGameInput();
    
    // Handle player controls
    if (gameState === 'playing') {
        if (keyCode === KEY_CODE_SPACE && player && player.fireSonar) {
            if (frameCount - lastSonarTime >= PLAYER_SONAR_COOLDOWN_FRAMES) {
                player.fireSonar(cave, enemies, jellyfish);
                lastSonarTime = frameCount;
                
                if (soundManager) {
                    soundManager.playSonarPing();
                }
            }
        }
    }
    
    // Handle high score name entry
    if (gameState === 'highScore') {
        handleHighScoreInput();
    }
    
    // Store key state
    keys[key] = true;
}

// Key released event
function keyReleased() {
    // Remove key from state
    keys[key] = false;
}

// Touch started event
function touchStarted() {
    // Handle mobile touch events
    if (typeof handleMobileTouch === 'function') {
        handleMobileTouch();
    }
    
    // Handle game input
    handleGameInput();
    
    // Handle sonar on mobile
    if (gameState === 'playing' && player && player.fireSonar) {
        if (frameCount - lastSonarTime >= PLAYER_SONAR_COOLDOWN_FRAMES) {
            player.fireSonar(cave, enemies, jellyfish);
            lastSonarTime = frameCount;
            
            if (soundManager) {
                soundManager.playSonarPing();
            }
        }
    }
    
    // Initialize audio on first interaction
    if (soundManager && !soundManager.audioInitialized) {
        soundManager.initializeAudio();
    }
    
    // Prevent default touch behavior
    return false;
}

// Handle general game input (transitions between states)
function handleGameInput() {
    if (gameState === 'start') {
        resetGame();
    } else if (gameState === 'levelComplete') {
        if (level >= MAX_LEVELS) {
            gameState = 'gameComplete';
        } else {
            nextLevel();
            gameState = 'playing';
        }
    } else if (gameState === 'gameComplete') {
        gameState = 'start';
    } else if (gameState === 'gameOver') {
        if (isHighScore(score)) {
            gameState = 'highScore';
        } else {
            gameState = 'start';
        }
    } else if (gameState === 'highScores') {
        gameState = 'start';
    }
}

// Handle high score name input
function handleHighScoreInput() {
    if (keyCode === ENTER) {
        if (playerNameForHighScore.trim() !== '') {
            // Save high score
            addHighScore(playerNameForHighScore.trim(), score);
            
            if (highScoreManager) {
                highScoreManager.saveHighScores(highScores);
            }
            
            gameState = 'highScores';
        }
        // Don't allow empty names
        return;
    }
    
    if (keyCode === BACKSPACE) {
        playerNameForHighScore = playerNameForHighScore.slice(0, -1);
    } else if (key.length === 1 && playerNameForHighScore.length < 10) {
        // Add character if it's printable and within limit
        if (key >= ' ' && key <= '~') {
            playerNameForHighScore += key;
        }
    }
}

// Window resize handler
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Helper function to get kills required for current level
function getKillsRequiredForLevel(currentLevel) {
    return BASE_KILLS_REQUIRED + (currentLevel - 1) * KILLS_INCREASE_PER_LEVEL;
}
