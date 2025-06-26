/**
 * Simple Gamepad Controls Implementation
 * Button 0: Fire button (during gameplay) or menu navigation (in menus)
 * Button 9: Start button for navigation between screens
 * Axes [0,1]: Left analog stick for steering the sub
 * D-pad: Alternative movement control
 */

// Track connected gamepads
let gamepads = {};
let gamepadConnected = false;

// Track button states to prevent repeated actions while buttons are held
let lastButtonStates = {};
let axesThreshold = 0.15; // Adjusted deadzone threshold

// Debug mode for gamepad
let showGamepadDebug = false;

/**
 * Initialize gamepad controls
 */
function initGamepadControls() {
  // Setup event listeners for gamepad connection/disconnection
  window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad.id);
    gamepads[e.gamepad.index] = e.gamepad;
    gamepadConnected = true;
    
    // Initialize button states for this gamepad
    lastButtonStates[e.gamepad.index] = Array(e.gamepad.buttons.length).fill(false);
    
    // Provide haptic feedback to indicate connection
    if (e.gamepad.vibrationActuator) {
      e.gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 200,
        weakMagnitude: 0.5,
        strongMagnitude: 0.5
      });
    }
  });

  window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad disconnected:", e.gamepad.id);
    delete gamepads[e.gamepad.index];
    delete lastButtonStates[e.gamepad.index];
    
    // Check if any gamepads remain connected
    gamepadConnected = Object.keys(gamepads).length > 0;
  });
}

/**
 * Update gamepad controls - called every frame
 */
function updateGamepadControls() {
  // If no gamepad connected, nothing to do
  if (!gamepadConnected) return;
  
  // Update gamepad states
  const gamepadsArray = navigator.getGamepads ? navigator.getGamepads() : [];
  
  for (const gamepad of gamepadsArray) {
    if (!gamepad) continue;
    
    // Update our gamepad object
    gamepads[gamepad.index] = gamepad;
    
    // Check game state to determine which controls to use
    if (gameState === gameStates.START || 
        gameState === gameStates.HIGH_SCORES || 
        gameState === gameStates.LEVEL_COMPLETE || 
        gameState === gameStates.GAME_COMPLETE || 
        gameState === gameStates.GAME_OVER) {
      handleMenuNavigation(gamepad);
    } else if (gameState === gameStates.PLAYING) {
      handleGameplay(gamepad);
    }
    
    // Update button states for next frame
    updateButtonStates(gamepad);
  }
}

/**
 * Handle menu navigation with gamepad
 */
function handleMenuNavigation(gamepad) {
  const buttonStates = lastButtonStates[gamepad.index] || Array(gamepad.buttons.length).fill(false);
  
  // Button 9 (Start button) - acts like Enter key
  if (gamepad.buttons[9] && gamepad.buttons[9].pressed && !buttonStates[9]) {
    console.log("Start button pressed in menu");
    
    // Special handling for start screen
    if (gameState === gameStates.START) {
      console.log("Navigating from start screen to high scores");
      gameState = gameStates.HIGH_SCORES;
      if (typeof highScoreManager !== 'undefined' && highScoreManager.getHighScores) {
        highScores = null;
        highScoreManager.getHighScores().then(scores => {
          highScores = scores;
        }).catch(error => {
          console.error('Failed to load high scores:', error);
          highScores = [];
        });
      } else {
        // Fallback to key simulation if the direct call isn't available
        simulateKeyPress(13); // 13 is Enter key code
      }
    }
    // Special handling for high scores screen
    else if (gameState === gameStates.HIGH_SCORES) {
      console.log("Starting game from high scores screen");
      // Start loading sequence
      gameState = gameStates.LOADING;
      if (typeof showLoadingOverlay === 'function') {
        showLoadingOverlay("GENERATING LEVEL");
      }
      
      // Use setTimeout to match the original code's behavior
      setTimeout(() => {
        // Initialize game objects
        if (typeof initGameObjects === 'function') {
          initGameObjects();
        }
        
        // Set up player if available
        if (typeof player !== 'undefined') {
          player.health = PLAYER_INITIAL_HEALTH;
          player.airSupply = player.initialAirSupply;
          player.lastSonarTime = frameCount - player.sonarCooldown;
          player.lastShotTime = frameCount - player.shotCooldown;
        }
        
        // Change game state to playing
        gameState = gameStates.PLAYING;
        
        // Turn off reactor hum if needed
        if (typeof audioInitialized !== 'undefined' && audioInitialized && 
            typeof reactorHumOsc !== 'undefined' && reactorHumOsc && reactorHumOsc.started) {
          reactorHumOsc.amp(0, 0);
        }
      }, 100);
    }
    // Special handling for level complete to ensure progression
    else if (gameState === gameStates.LEVEL_COMPLETE) {
      console.log("Progressing to next level");
      if (typeof prepareNextLevel === 'function') {
        prepareNextLevel();
      } else {
        // Fallback to key simulation
        simulateKeyPress(13); // 13 is Enter key code
      }
    } 
    // Special handling for game complete
    else if (gameState === gameStates.GAME_COMPLETE) {
      console.log("Resetting game");
      if (typeof resetGame === 'function') {
        resetGame();
      } else {
        // Fallback to key simulation
        simulateKeyPress(13); // 13 is Enter key code
      }
    }
    // Special handling for game over
    else if (gameState === gameStates.GAME_OVER) {
      console.log("Game over screen action");
      
      // Check if submitting high score
      if (typeof isSubmittingHighScore !== 'undefined' && isSubmittingHighScore) {
        // If submission is not in progress
        if (typeof isSubmissionInProgress !== 'undefined' && !isSubmissionInProgress) {
          if (typeof playerNameInput !== 'undefined' && playerNameInput.trim().length > 0) {
            console.log("Submitting high score");
            if (typeof submitHighScore === 'function') {
              submitHighScore();
            } else {
              simulateKeyPress(13); // Enter key fallback
            }
          }
          // Do nothing if name is empty - following original behavior
        }
      } 
      // Not submitting a high score, just reset the game
      else if (typeof isSubmittingHighScore !== 'undefined' && !isSubmittingHighScore) {
        console.log("Resetting game after game over");
        if (typeof resetGame === 'function') {
          resetGame();
        } else {
          simulateKeyPress(13); // Enter key fallback
        }
      }
      else {
        // Fallback if variables are undefined
        simulateKeyPress(13);
      }
    }
    else {
      // For other menu states
      simulateKeyPress(13); // 13 is Enter key code
    }
  }
  
  // Button 0 (A button) - also acts like Enter key for selection
  if (gamepad.buttons[0] && gamepad.buttons[0].pressed && !buttonStates[0]) {
    console.log("Button 0 pressed in menu");
    
    // Special handling for start screen
    if (gameState === gameStates.START) {
      console.log("Navigating from start screen to high scores");
      gameState = gameStates.HIGH_SCORES;
      if (typeof highScoreManager !== 'undefined' && highScoreManager.getHighScores) {
        highScores = null;
        highScoreManager.getHighScores().then(scores => {
          highScores = scores;
        }).catch(error => {
          console.error('Failed to load high scores:', error);
          highScores = [];
        });
      } else {
        // Fallback to key simulation if the direct call isn't available
        simulateKeyPress(13);
      }
    }
    // Special handling for high scores screen (same as button 9)
    else if (gameState === gameStates.HIGH_SCORES) {
      console.log("Starting game from high scores screen");
      // Start loading sequence
      gameState = gameStates.LOADING;
      if (typeof showLoadingOverlay === 'function') {
        showLoadingOverlay("GENERATING LEVEL");
      }
      
      // Use setTimeout to match the original code's behavior
      setTimeout(() => {
        if (typeof initGameObjects === 'function') {
          initGameObjects();
        }
        
        if (typeof player !== 'undefined') {
          player.health = PLAYER_INITIAL_HEALTH;
          player.airSupply = player.initialAirSupply;
          player.lastSonarTime = frameCount - player.sonarCooldown;
          player.lastShotTime = frameCount - player.shotCooldown;
        }
        
        gameState = gameStates.PLAYING;
        
        if (typeof audioInitialized !== 'undefined' && audioInitialized && 
            typeof reactorHumOsc !== 'undefined' && reactorHumOsc && reactorHumOsc.started) {
          reactorHumOsc.amp(0, 0);
        }
      }, 100);
    }
    // Same special handling for level complete
    else if (gameState === gameStates.LEVEL_COMPLETE) {
      if (typeof prepareNextLevel === 'function') {
        prepareNextLevel();
      } else {
        simulateKeyPress(13);
      }
    }
    // Same special handling for game complete
    else if (gameState === gameStates.GAME_COMPLETE) {
      if (typeof resetGame === 'function') {
        resetGame();
      } else {
        simulateKeyPress(13);
      }
    }
    // Special handling for game over screen
    else if (gameState === gameStates.GAME_OVER) {
      // Check if submitting high score
      if (typeof isSubmittingHighScore !== 'undefined' && isSubmittingHighScore) {
        // If submission is not in progress
        if (typeof isSubmissionInProgress !== 'undefined' && !isSubmissionInProgress) {
          if (typeof playerNameInput !== 'undefined' && playerNameInput.trim().length > 0) {
            console.log("Submitting high score");
            if (typeof submitHighScore === 'function') {
              submitHighScore();
            } else {
              simulateKeyPress(13); // Enter key fallback
            }
          }
          // Do nothing if name is empty - following original behavior
        }
      } 
      // Not submitting a high score, just reset the game
      else if (typeof isSubmittingHighScore !== 'undefined' && !isSubmittingHighScore) {
        console.log("Resetting game after game over");
        if (typeof resetGame === 'function') {
          resetGame();
        } else {
          simulateKeyPress(13); // Enter key fallback
        }
      }
      else {
        // Fallback if variables are undefined
        simulateKeyPress(13);
      }
    }
    else {
      simulateKeyPress(13);
    }
  }
  
  // D-pad or analog stick for menu navigation
  const axes = gamepad.axes;
  
  // Vertical movement (up/down in menus)
  if (Math.abs(axes[1]) > axesThreshold) {
    if (axes[1] < -axesThreshold && !isAxesMoving(gamepad, 1, true)) {
      // Up direction
      simulateKeyPress(38); // 38 is Up arrow key code
    } else if (axes[1] > axesThreshold && !isAxesMoving(gamepad, 1, false)) {
      // Down direction
      simulateKeyPress(40); // 40 is Down arrow key code
    }
  }
  
  // D-pad support
  if (gamepad.buttons[12] && gamepad.buttons[12].pressed && !buttonStates[12]) {
    // D-pad up
    simulateKeyPress(38);
  }
  if (gamepad.buttons[13] && gamepad.buttons[13].pressed && !buttonStates[13]) {
    // D-pad down
    simulateKeyPress(40);
  }
}

/**
 * Handle gameplay controls with gamepad
 */
function handleGameplay(gamepad) {
  if (!player) return;
  
  const buttonStates = lastButtonStates[gamepad.index] || Array(gamepad.buttons.length).fill(false);
  
  // Button 0 (A button) - Fire button
  if (gamepad.buttons[0] && gamepad.buttons[0].pressed && !buttonStates[0]) {
    console.log("Button 0 pressed (fire)");
    player.shoot();
  }
  
  // Button 9 (Start button) - Pause/menu
  if (gamepad.buttons[9] && gamepad.buttons[9].pressed && !buttonStates[9]) {
    console.log("Start button pressed (pause)");
    // Simulate Escape key to pause if needed
    simulateKeyPress(27); // 27 is Escape key code
  }
  
  // Analog stick for movement
  const axes = gamepad.axes;
  
  // Left analog stick for steering
  if (axes && axes.length >= 2) {
    // Horizontal axis (left/right turning)
    const leftStickX = Math.abs(axes[0]) > axesThreshold ? axes[0] : 0;
    if (leftStickX !== 0) {
      player.angle += player.turnSpeed * leftStickX;
    }
    
    // Vertical axis (forward/backward movement)
    const leftStickY = Math.abs(axes[1]) > axesThreshold ? axes[1] : 0;
    if (leftStickY < 0) {
      // Forward thrust
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(player.thrustPower * Math.abs(leftStickY)));
    } else if (leftStickY > 0) {
      // Reverse thrust
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(-player.thrustPower * PLAYER_REVERSE_THRUST_FACTOR * Math.abs(leftStickY)));
    }
  }
  
  // D-pad controls if available
  if (gamepad.buttons.length > 15) {
    // D-pad up - Forward
    if (gamepad.buttons[12] && gamepad.buttons[12].pressed) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(player.thrustPower));
    }
    
    // D-pad down - Backward
    if (gamepad.buttons[13] && gamepad.buttons[13].pressed) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(-player.thrustPower * PLAYER_REVERSE_THRUST_FACTOR));
    }
    
    // D-pad left - Turn left
    if (gamepad.buttons[14] && gamepad.buttons[14].pressed) {
      player.angle -= player.turnSpeed;
    }
    
    // D-pad right - Turn right
    if (gamepad.buttons[15] && gamepad.buttons[15].pressed) {
      player.angle += player.turnSpeed;
    }
  }
}

/**
 * Update the stored button states for detecting button press events
 */
function updateButtonStates(gamepad) {
  if (!lastButtonStates[gamepad.index]) {
    lastButtonStates[gamepad.index] = Array(gamepad.buttons.length).fill(false);
  }
  
  for (let i = 0; i < gamepad.buttons.length; i++) {
    lastButtonStates[gamepad.index][i] = gamepad.buttons[i] && gamepad.buttons[i].pressed;
  }
}

/**
 * Track if an axis has already moved beyond threshold
 * to prevent repeated actions while holding stick
 */
let lastAxesStates = {};
function isAxesMoving(gamepad, axisIndex, isNegative) {
  if (!lastAxesStates[gamepad.index]) {
    lastAxesStates[gamepad.index] = Array(gamepad.axes.length).fill({negative: false, positive: false});
  }
  
  const axisState = lastAxesStates[gamepad.index][axisIndex];
  const axisValue = gamepad.axes[axisIndex];
  
  if (isNegative) {
    // Check negative direction
    if (axisValue < -axesThreshold && !axisState.negative) {
      // Mark as moving negative
      lastAxesStates[gamepad.index][axisIndex].negative = true;
      return false;
    } else if (axisValue >= -axesThreshold) {
      // Reset when returning to neutral
      lastAxesStates[gamepad.index][axisIndex].negative = false;
    }
    return axisState.negative;
  } else {
    // Check positive direction
    if (axisValue > axesThreshold && !axisState.positive) {
      // Mark as moving positive
      lastAxesStates[gamepad.index][axisIndex].positive = true;
      return false;
    } else if (axisValue <= axesThreshold) {
      // Reset when returning to neutral
      lastAxesStates[gamepad.index][axisIndex].positive = false;
    }
    return axisState.positive;
  }
}

/**
 * Simulate a keyboard key press
 */
function simulateKeyPress(keyCode) {
  if (typeof keyPressed === 'function') {
    keyPressed({key: String.fromCharCode(keyCode), keyCode: keyCode});
  } else {
    // Fallback to dispatching events
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: String.fromCharCode(keyCode),
      keyCode: keyCode,
      which: keyCode,
      bubbles: true
    }));
    
    // Create and dispatch keyup event (immediately after)
    window.dispatchEvent(new KeyboardEvent('keyup', {
      key: String.fromCharCode(keyCode),
      keyCode: keyCode,
      which: keyCode,
      bubbles: true
    }));
  }
}

/**
 * Provide vibration feedback when player takes damage
 */
function notifyDamage() {
  for (const index in gamepads) {
    const gamepad = gamepads[index];
    if (gamepad && gamepad.vibrationActuator) {
      try {
        gamepad.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 300,
          weakMagnitude: 0.5,
          strongMagnitude: 0.7
        });
      } catch (e) {
        console.error("Vibration error:", e);
      }
    }
  }
}

/**
 * Provide vibration feedback for various game events
 */
function notifyGameEvent(eventType) {
  // Different vibration patterns based on event type
  let options = { duration: 100, weakMagnitude: 0, strongMagnitude: 0 };
  
  switch(eventType) {
    case 'powerup':
      options = { duration: 250, weakMagnitude: 0.2, strongMagnitude: 0.4 };
      break;
    case 'levelComplete':
      options = { duration: 500, weakMagnitude: 0.5, strongMagnitude: 0.3 };
      break;
    case 'gameOver':
      options = { duration: 750, weakMagnitude: 0.7, strongMagnitude: 0.7 };
      break;
  }
  
  for (const index in gamepads) {
    const gamepad = gamepads[index];
    if (gamepad && gamepad.vibrationActuator) {
      try {
        gamepad.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: options.duration,
          weakMagnitude: options.weakMagnitude,
          strongMagnitude: options.strongMagnitude
        });
      } catch (e) {
        console.error("Vibration error:", e);
      }
    }
  }
}

/**
 * Notify when player enters a new area
 */
function notifyCurrentAreaEntered() {
  for (const index in gamepads) {
    const gamepad = gamepads[index];
    if (gamepad && gamepad.vibrationActuator) {
      try {
        gamepad.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 200,
          weakMagnitude: 0.1,
          strongMagnitude: 0.2
        });
      } catch (e) {
        console.error("Vibration error:", e);
      }
    }
  }
}

/**
 * Draw gamepad debug information
 */
function renderGamepadControls() {
  if (!showGamepadDebug || !gamepadConnected) return;
  
  push();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);
  
  let yPos = 50;
  text("Gamepad Debug:", 10, yPos);
  yPos += 25;
  
  for (const index in gamepads) {
    const gamepad = gamepads[index];
    if (!gamepad) continue;
    
    text(`Gamepad ${index}: ${gamepad.id}`, 10, yPos);
    yPos += 20;
    
    // Display button states
    let buttonText = "Buttons: ";
    for (let i = 0; i < gamepad.buttons.length; i++) {
      if (gamepad.buttons[i] && gamepad.buttons[i].pressed) {
        buttonText += i + " ";
      }
    }
    text(buttonText, 10, yPos);
    yPos += 20;
    
    // Display axes values
    let axesText = "Axes: ";
    for (let i = 0; i < gamepad.axes.length; i++) {
      const value = gamepad.axes[i];
      if (Math.abs(value) > 0.1) {
        axesText += i + ":" + value.toFixed(2) + " ";
      }
    }
    text(axesText, 10, yPos);
    yPos += 30;
  }
  
  pop();
}

/**
 * Toggle gamepad debug display
 */
function toggleGamepadDebug() {
  showGamepadDebug = !showGamepadDebug;
}

/**
 * Global object for callbacks from other parts of the game
 */
const gamepadControls = {
  notifyDamage: notifyDamage,
  notifyEvent: notifyGameEvent,
  notifyCurrentAreaEntered: notifyCurrentAreaEntered,
  toggleDebug: toggleGamepadDebug
};