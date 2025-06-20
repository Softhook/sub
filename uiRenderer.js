// --- UI Rendering Functions ---

// Draw the start screen
function drawStartScreen() {
    colorMode(HSB, 360, 100, 100, 255);
    background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
    
    push();
    translate(width / 2, height / 2);
    
    // Detect mobile layouts
    const isNarrow = isNarrowScreen();
    const isShort = isShortScreen();
    const isMobileLandscape = isShort && isLandscape();
    
    // Title
    fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B);
    textAlign(CENTER, CENTER);
    
    let titleSize = isMobileLandscape ? 40 : (isNarrow ? 45 : START_SCREEN_TITLE_TEXT_SIZE);
    textSize(titleSize);
    let titleY = isMobileLandscape ? -height/3 : START_SCREEN_TITLE_Y_OFFSET;
    text("Submarine Navigator", 0, titleY);
    
    // Game info
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    let infoSize = isMobileLandscape ? 14 : (isNarrow ? 16 : START_SCREEN_INFO_TEXT_SIZE);
    textSize(infoSize);
    
    if (isMobileLandscape) {
        // Compact layout for landscape mobile
        let startY = titleY + 50;
        let lineHeight = 18;
        text("Navigate underwater caves using sonar", 0, startY);
        text("Avoid enemies and manage your air supply", 0, startY + lineHeight);
        text("WASD/Touch: Move | SPACE/Tap: Sonar | Click/Touch+Hold: Torpedo", 0, startY + lineHeight * 2);
    } else if (isNarrow) {
        // Portrait mobile - split long lines
        let startY = START_SCREEN_INFO_Y_OFFSET_3;
        let lineHeight = 25;
        text("Navigate underwater caves", 0, startY);
        text("using sonar", 0, startY + lineHeight);
        text("Avoid enemies and manage", 0, startY + lineHeight * 2);
        text("your air supply", 0, startY + lineHeight * 3);
        
        textSize(infoSize - 2);
        text("WASD/Touch: Move", 0, startY + lineHeight * 5);
        text("SPACE/Tap: Sonar", 0, startY + lineHeight * 6);
        text("Click/Touch+Hold: Torpedo", 0, startY + lineHeight * 7);
    } else {
        // Desktop layout
        text("Navigate underwater caves using sonar", 0, START_SCREEN_INFO_Y_OFFSET_3);
        text("Avoid enemies and manage your air supply", 0, START_SCREEN_INFO_Y_OFFSET_1);
        text("WASD: Move | SPACE: Sonar | Click: Torpedo", 0, START_SCREEN_INFO_Y_OFFSET_2);
    }
    
    // Fullscreen prompt
    textSize(isMobileLandscape ? 12 : (isNarrow ? 14 : 16));
    let fullscreenY = isMobileLandscape ? height/2 - 60 : START_SCREEN_FULLSCREEN_Y_OFFSET;
    text("Press F11 for fullscreen (recommended)", 0, fullscreenY);
    
    // Start prompt
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    let promptSize = isMobileLandscape ? 20 : (isNarrow ? 22 : START_SCREEN_PROMPT_TEXT_SIZE);
    textSize(promptSize);
    let promptY = isMobileLandscape ? height/2 - 30 : START_SCREEN_PROMPT_Y_OFFSET;
    text("Click or press ENTER to start", 0, promptY);
    
    // Audio note
    fill(START_SCREEN_AUDIO_NOTE_COLOR_H, START_SCREEN_AUDIO_NOTE_COLOR_S, START_SCREEN_AUDIO_NOTE_COLOR_B);
    textSize(isMobileLandscape ? 11 : (isNarrow ? 13 : START_SCREEN_AUDIO_NOTE_TEXT_SIZE));
    let audioNoteY = isMobileLandscape ? height/2 - 10 : START_SCREEN_AUDIO_NOTE_Y_OFFSET;
    text("Audio will start after first interaction", 0, audioNoteY);
    
    pop();
}

// Draw the high score screen
function drawHighScoreScreen() {
    colorMode(HSB, 360, 100, 100, 255);
    background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
    
    push();
    translate(width / 2, height / 2);
    
    // Detect mobile landscape layout
    const isMobileLandscape = isShortScreen() && isLandscape();
    
    // Title
    fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B);
    textAlign(CENTER, CENTER);
    let titleSize = isMobileLandscape ? 35 : 48;
    textSize(titleSize);
    let titleY = isMobileLandscape ? -height/3 : -height/3;
    text("High Scores", 0, titleY);
    
    // High scores list
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    let scoreTextSize = isMobileLandscape ? 14 : 20;
    textSize(scoreTextSize);
    
    let startY = titleY + (isMobileLandscape ? 50 : 80);
    let lineHeight = isMobileLandscape ? 20 : 30;
    
    if (highScores && highScores.length > 0) {
        for (let i = 0; i < Math.min(10, highScores.length); i++) {
            const score = highScores[i];
            const scoreText = `${i + 1}. ${score.name} - ${formatNumber(score.score)}`;
            text(scoreText, 0, startY + i * lineHeight);
        }
    } else {
        text("No high scores yet!", 0, startY);
    }
    
    // Back prompt
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    let promptSize = isMobileLandscape ? 18 : 24;
    textSize(promptSize);
    let promptY = isMobileLandscape ? height/2 - 30 : height/3;
    text("Click or press ENTER to return", 0, promptY);
    
    pop();
}

// Draw the HUD
function drawHUD() {
    colorMode(HSB, 360, 100, 100, 255);
    
    // HUD background
    fill(0, 0, 0, 120);
    noStroke();
    rect(0, 0, width, 90);
    
    // HUD text
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    textAlign(LEFT, TOP);
    textSize(HUD_TEXT_SIZE);
    
    const margin = HUD_MARGIN_X;
    const topMargin = HUD_MARGIN_Y;
    const lineSpacing = HUD_LINE_SPACING;
    
    // Level and score
    text(`Level: ${level}`, margin, topMargin);
    text(`Score: ${formatNumber(score)}`, margin, topMargin + lineSpacing);
    
    // Air supply with color coding
    const airSeconds = Math.ceil(airSupply / AIR_SUPPLY_FRAMES_TO_SECONDS_DIVISOR);
    if (hasLowAir()) {
        fill(0, 100, 100); // Red for low air
    } else {
        fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    }
    text(`Air: ${airSeconds}s`, margin, topMargin + lineSpacing * 2);
    
    // Reset color for remaining text
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    
    // Health bar
    const healthBarX = margin + 200;
    const healthBarY = topMargin;
    const healthBarWidth = 150;
    const healthBarHeight = 12;
    
    // Health bar background
    fill(0, 0, 20);
    rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // Health bar fill
    const healthPercent = playerHealth / PLAYER_INITIAL_HEALTH;
    if (healthPercent > 0.5) {
        fill(120, 80, 80); // Green
    } else if (healthPercent > 0.25) {
        fill(60, 80, 80); // Yellow
    } else {
        fill(0, 80, 80); // Red
    }
    
    const fillWidth = healthBarWidth * healthPercent;
    rect(healthBarX, healthBarY, fillWidth, healthBarHeight);
    
    // Health text
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    text(`Health: ${Math.ceil(playerHealth)}`, healthBarX, healthBarY + healthBarHeight + 5);
    
    // Enemies and target
    text(`Enemies: ${killCount}/${getKillsRequired()}`, healthBarX, healthBarY + healthBarHeight + 30);
}

// Draw game over screen
function drawGameOverScreen() {
    colorMode(HSB, 360, 100, 100, 255);
    background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
    
    push();
    translate(width / 2, height / 2);
    
    // Title
    fill(GAME_OVER_TITLE_COLOR_H, GAME_OVER_TITLE_COLOR_S, GAME_OVER_TITLE_COLOR_B);
    textAlign(CENTER, CENTER);
    textSize(GAME_OVER_TITLE_TEXT_SIZE);
    text("Game Over", 0, GAME_OVER_TITLE_Y_OFFSET);
    
    // Final score
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    textSize(GAME_OVER_INFO_TEXT_SIZE);
    text(`Final Score: ${formatNumber(score)}`, 0, GAME_OVER_INFO_Y_OFFSET);
    text(`Level Reached: ${level}`, 0, GAME_OVER_INFO_Y_OFFSET + 30);
    
    // Restart prompt
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    textSize(24);
    text("Click or press ENTER to restart", 0, GAME_OVER_PROMPT_Y_OFFSET);
    
    pop();
}

// Draw level complete screen
function drawLevelCompleteScreen() {
    colorMode(HSB, 360, 100, 100, 255);
    background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
    
    push();
    translate(width / 2, height / 2);
    
    // Title
    fill(LEVEL_COMPLETE_TITLE_COLOR_H, LEVEL_COMPLETE_TITLE_COLOR_S, LEVEL_COMPLETE_TITLE_COLOR_B);
    textAlign(CENTER, CENTER);
    textSize(LEVEL_COMPLETE_TITLE_TEXT_SIZE);
    text("Level Complete!", 0, LEVEL_COMPLETE_TITLE_Y_OFFSET);
    
    // Level info
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    textSize(LEVEL_COMPLETE_INFO_TEXT_SIZE);
    text(`Level ${level} completed!`, 0, LEVEL_COMPLETE_INFO_Y_OFFSET);
    
    const bonus = calculateLevelBonus();
    text(`Bonus: ${formatNumber(bonus)}`, 0, LEVEL_COMPLETE_INFO_Y_OFFSET + 30);
    text(`Total Score: ${formatNumber(score)}`, 0, LEVEL_COMPLETE_INFO_Y_OFFSET + 60);
    
    // Continue prompt
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    textSize(24);
    text("Click or press ENTER to continue", 0, LEVEL_COMPLETE_PROMPT_Y_OFFSET);
    
    pop();
}

// Draw game complete screen
function drawGameCompleteScreen() {
    colorMode(HSB, 360, 100, 100, 255);
    background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
    
    push();
    translate(width / 2, height / 2);
    
    // Title
    fill(GAME_COMPLETE_TITLE_COLOR_H, GAME_COMPLETE_TITLE_COLOR_S, GAME_COMPLETE_TITLE_COLOR_B);
    textAlign(CENTER, CENTER);
    textSize(GAME_COMPLETE_TITLE_TEXT_SIZE);
    text("Congratulations!", 0, GAME_COMPLETE_TITLE_Y_OFFSET);
    
    // Completion info
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    textSize(GAME_COMPLETE_INFO_TEXT_SIZE);
    text("You completed all levels!", 0, GAME_COMPLETE_INFO_Y_OFFSET);
    text(`Final Score: ${formatNumber(score)}`, 0, GAME_COMPLETE_INFO_Y_OFFSET + 30);
    
    // Restart prompt
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    textSize(24);
    text("Click or press ENTER to play again", 0, GAME_COMPLETE_PROMPT_Y_OFFSET);
    
    pop();
}

// Draw high score entry screen
function drawHighScoreEntryScreen() {
    colorMode(HSB, 360, 100, 100, 255);
    background(BACKGROUND_COLOR_H, BACKGROUND_COLOR_S, BACKGROUND_COLOR_B);
    
    push();
    translate(width / 2, height / 2);
    
    // Title
    fill(START_SCREEN_TITLE_COLOR_H, START_SCREEN_TITLE_COLOR_S, START_SCREEN_TITLE_COLOR_B);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("New High Score!", 0, -120);
    
    // Score
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    textSize(24);
    text(`Score: ${formatNumber(score)}`, 0, -70);
    
    // Name prompt
    text("Enter your name:", 0, -20);
    
    // Name input display
    fill(START_SCREEN_PROMPT_COLOR_H, START_SCREEN_PROMPT_COLOR_S, START_SCREEN_PROMPT_COLOR_B);
    textSize(32);
    const displayName = playerNameForHighScore + "_";
    text(displayName, 0, 20);
    
    // Instructions
    fill(HUD_TEXT_COLOR_H, HUD_TEXT_COLOR_S, HUD_TEXT_COLOR_B);
    textSize(18);
    text("Type your name and press ENTER", 0, 70);
    
    // Character limit
    textSize(14);
    text(`${playerNameForHighScore.length}/10 characters`, 0, 100);
    
    pop();
}
