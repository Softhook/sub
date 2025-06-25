// Gamepad Controls for Submarine Game
// Adds support for standard gamepads on desktop and mobile devices
// Works alongside existing keyboard and touch controls

const GAMEPAD_CONTROLS_CONFIG = {
  // Controller settings
  controller: {
    deadzone: 0.15,         // Minimum input threshold to register movement
    stickSensitivity: 1.0,  // Sensitivity of the analog sticks
  },

  // Button mappings (standard HTML5 Gamepad API indices)
  buttons: {
    fire: 0,                // A button or Cross on PlayStation
    sonar: 1,               // B button or Circle on PlayStation
    start: 9,               // Start button (usually 9)
    thrust: {
      forward: 7,           // Right trigger (RT)
      reverse: 6,           // Left trigger (LT)
    },
    dpad: {
      // Standard mapping for most controllers
      up: 12,
      down: 13,
      left: 14,
      right: 15,
      // Alternate mappings for controllers without standard mapping
      altUp: 0,    // Some controllers use the first few buttons for D-pad
      altDown: 1,
      altLeft: 2,
      altRight: 3,
      // You can add more alternate mappings if needed
    }
  },

  // Visual feedback settings
  visualFeedback: {
    enabled: true,
    strokeWeight: 2,
    alpha: 150,
    buttonPressedAlpha: 220,
    color: { h: 180, s: 50, b: 70 },
    position: {
      x: null,              // Will be set to width - 150
      y: null,              // Will be set to height - 30
    }
  },

  // Vibration support (if available)
  vibration: {
    enabled: true,
    intensities: {
      shoot: { weak: 0.3, strong: 0.1, duration: 100 },
      sonar: { weak: 0.2, strong: 0.0, duration: 200 },
      damage: { weak: 0.5, strong: 0.7, duration: 300 },
      currentArea: { weak: 0.1, strong: 0.2, duration: 200 }
    }
  }
};

class GamepadControls {
  constructor() {
    this.enabled = this.detectGamepadSupport();
    this.gamepads = {};
    this.activeGamepad = null;
    this.lastButtonStates = {};
    this.visualFeedbackPosition = {
      x: width - 150,
      y: height - 30
    };
    this.lastSonarTime = 0;
    this.lastShotTime = 0;
    this.debugMode = typeof DEBUG_MODE !== 'undefined' ? DEBUG_MODE : false;
    this.lastInputTime = 0;     // To track when input was last detected
    this.inputActiveTimeout = 3000; // Show visual feedback for 3 seconds after input
    
    if (this.enabled) {
      console.log("Gamepad controls initialized");
      this.setupEventListeners();
    }
  }

  detectGamepadSupport() {
    const hasAPI = 'getGamepads' in navigator;
    console.log(`Gamepad API support detected: ${hasAPI ? 'Yes' : 'No'}`);
    return hasAPI;
  }

  setupEventListeners() {
    // Listen for gamepad connections
    window.addEventListener('gamepadconnected', (e) => {
      console.log(`Gamepad connected: ${e.gamepad.id}`);
      this.gamepads[e.gamepad.index] = e.gamepad;
      this.activeGamepad = e.gamepad;
      
      // Provide haptic feedback if available
      this.vibrate({ weak: 0.3, strong: 0.3, duration: 300 });
    });

    // Listen for gamepad disconnections
    window.addEventListener('gamepaddisconnected', (e) => {
      console.log(`Gamepad disconnected: ${e.gamepad.id}`);
      delete this.gamepads[e.gamepad.index];
      
      // Find another active gamepad if available
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const gamepad of gamepads) {
        if (gamepad && gamepad.connected) {
          this.activeGamepad = gamepad;
          return;
        }
      }
      this.activeGamepad = null;
    });
  }

  update() {
    if (!this.enabled) return;

    // Get fresh gamepad data
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    
    // Update our gamepads object with the latest data
    for (const gamepad of gamepads) {
      if (gamepad) {
        this.gamepads[gamepad.index] = gamepad;
        
        // Make the most recently used gamepad the active one
        if (this.isGamepadActive(gamepad)) {
          this.activeGamepad = gamepad;
        }
      }
    }

    // If playing state, handle gamepad input for player control
    if (gameState === gameStates.PLAYING && player && this.activeGamepad) {
      this.handleGameInput(this.activeGamepad);
    }
  }

  isGamepadActive(gamepad) {
    if (!gamepad) return false;
    
    // Check for any button presses or significant axis movement
    const deadzone = GAMEPAD_CONTROLS_CONFIG.controller.deadzone;
    let isActive = false;
    
    // Check axes (usually first 4 are the main analog sticks)
    for (let i = 0; i < 4 && i < gamepad.axes.length; i++) {
      if (Math.abs(gamepad.axes[i]) > deadzone) {
        if (this.debugMode) {
          console.log(`Gamepad axis ${i} active: ${gamepad.axes[i]}`);
        }
        isActive = true;
        break;
      }
    }
    
    // Check buttons if axes weren't active
    if (!isActive) {
      for (let i = 0; i < gamepad.buttons.length; i++) {
        if (gamepad.buttons[i].pressed) {
          if (this.debugMode) {
            console.log(`Gamepad button ${i} pressed`);
          }
          isActive = true;
          break;
        }
      }
    }
    
    return isActive;
  }

  handleGameInput(gamepad) {
    if (!gamepad || !gamepad.connected) return;

    // Initialize button states storage if needed
    if (!this.lastButtonStates[gamepad.index]) {
      this.lastButtonStates[gamepad.index] = Array(gamepad.buttons.length).fill(false);
      
      // Log gamepad info in debug mode
      if (this.debugMode) {
        console.log(`Gamepad connected: ${gamepad.id}`);
        console.log(`- Axes: ${gamepad.axes.length}`);
        console.log(`- Buttons: ${gamepad.buttons.length}`);
        console.log(`- Mapping: ${gamepad.mapping}`);
      }
    }

    // Get config options
    const deadzone = GAMEPAD_CONTROLS_CONFIG.controller.deadzone;
    const sensitivity = GAMEPAD_CONTROLS_CONFIG.controller.stickSensitivity;
    const buttonConfig = GAMEPAD_CONTROLS_CONFIG.buttons;
    
    // Initialize movement variables to 0 for this frame
    // These will only be updated if there's actual input detected
    let turnInput = 0;
    let forwardInput = 0;
    let reverseInput = 0;
    
    // Handle movement - Left analog stick or D-pad
    let leftStickX = 0;
    let leftStickY = 0;
    
    // Left analog stick (horizontal: axis 0, vertical: axis 1)
    if (gamepad.axes && gamepad.axes.length >= 2) {
      leftStickX = Math.abs(gamepad.axes[0]) > deadzone ? gamepad.axes[0] * sensitivity : 0;
      leftStickY = Math.abs(gamepad.axes[1]) > deadzone ? gamepad.axes[1] * sensitivity : 0;
    }
    
    // D-pad input - check both standard and alternate mappings
    const dpadConfig = GAMEPAD_CONTROLS_CONFIG.buttons.dpad;
    
    // Check if buttons exist before checking their pressed state
    // Standard mapping
    const dpadUp = (gamepad.buttons.length > dpadConfig.up) && 
                   gamepad.buttons[dpadConfig.up] && 
                   gamepad.buttons[dpadConfig.up].pressed;
                   
    const dpadDown = (gamepad.buttons.length > dpadConfig.down) && 
                     gamepad.buttons[dpadConfig.down] && 
                     gamepad.buttons[dpadConfig.down].pressed;
                     
    const dpadLeft = (gamepad.buttons.length > dpadConfig.left) && 
                     gamepad.buttons[dpadConfig.left] && 
                     gamepad.buttons[dpadConfig.left].pressed;
                     
    const dpadRight = (gamepad.buttons.length > dpadConfig.right) && 
                      gamepad.buttons[dpadConfig.right] && 
                      gamepad.buttons[dpadConfig.right].pressed;
    
    // Check alternate mapping (for controllers without standard mapping)
    const altDpadUp = !dpadUp && (gamepad.buttons.length > dpadConfig.altUp) && 
                      gamepad.buttons[dpadConfig.altUp] && 
                      gamepad.buttons[dpadConfig.altUp].pressed;
                      
    const altDpadDown = !dpadDown && (gamepad.buttons.length > dpadConfig.altDown) && 
                        gamepad.buttons[dpadConfig.altDown] && 
                        gamepad.buttons[dpadConfig.altDown].pressed;
                        
    const altDpadLeft = !dpadLeft && (gamepad.buttons.length > dpadConfig.altLeft) && 
                        gamepad.buttons[dpadConfig.altLeft] && 
                        gamepad.buttons[dpadConfig.altLeft].pressed;
                        
    const altDpadRight = !dpadRight && (gamepad.buttons.length > dpadConfig.altRight) && 
                         gamepad.buttons[dpadConfig.altRight] && 
                         gamepad.buttons[dpadConfig.altRight].pressed;
    
    // Handle turn input (horizontal axis - left/right)
    // First check for analog stick input
    if (Math.abs(leftStickX) > deadzone) {
      turnInput = leftStickX;
    } 
    // Then check for D-pad input if analog stick isn't being used
    else if (dpadLeft || altDpadLeft) {
      turnInput = -1.0;
    }
    else if (dpadRight || altDpadRight) {
      turnInput = 1.0;
    }
    // No input = no turning (turnInput remains 0)
    
    // Apply turn input if any was detected
    if (turnInput !== 0) {
      player.angle += player.turnSpeed * turnInput;
    }
    
    // Handle forward/reverse thrust input (vertical axis - up/down)
    
    // Forward/reverse thrust with triggers
    const forwardThrust = gamepad.buttons[buttonConfig.thrust.forward] ? 
      gamepad.buttons[buttonConfig.thrust.forward].value : 0;
    const reverseThrust = gamepad.buttons[buttonConfig.thrust.reverse] ? 
      gamepad.buttons[buttonConfig.thrust.reverse].value : 0;
    
    // First check triggers for thrust
    if (forwardThrust > deadzone) {
      forwardInput = forwardThrust;
    }
    else if (reverseThrust > deadzone) {
      reverseInput = reverseThrust;
    } 
    // Then check for analog stick vertical input if triggers aren't used
    else if (Math.abs(leftStickY) > deadzone) {
      if (leftStickY < 0) {
        forwardInput = -leftStickY; // Pushing up = forward
      } else {
        reverseInput = leftStickY;  // Pushing down = reverse
      }
    }
    // Then check D-pad if neither triggers nor stick are being used
    else if (dpadUp || altDpadUp) {
      forwardInput = 1.0;
    }
    else if (dpadDown || altDpadDown) {
      reverseInput = 1.0;
    }
    // No input = no thrust (both inputs remain 0)
    
    // Calculate effective thrust power (with speed boost if active)
    let effectiveThrust = player.thrustPower;
    if (player.speedBoost && frameCount < player.speedBoost.expiresAt) {
      effectiveThrust *= player.speedBoost.multiplier;
    }
    
    // Apply forward thrust
    if (forwardInput > 0) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(effectiveThrust * forwardInput));
    }
    
    // Apply reverse thrust
    if (reverseInput > 0) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(-effectiveThrust * PLAYER_REVERSE_THRUST_FACTOR * reverseInput));
    }
    
    // Handle fire button (A/Cross button)
    if (gamepad.buttons[buttonConfig.fire] && gamepad.buttons[buttonConfig.fire].pressed) {
      // Track button press state to avoid repeated firing while holding
      if (!this.lastButtonStates[gamepad.index][buttonConfig.fire]) {
        player.shoot();
        this.lastButtonStates[gamepad.index][buttonConfig.fire] = true;
        
        // Haptic feedback for shooting
        if (GAMEPAD_CONTROLS_CONFIG.vibration.enabled) {
          this.vibrate(GAMEPAD_CONTROLS_CONFIG.vibration.intensities.shoot);
        }
      }
    } else {
      this.lastButtonStates[gamepad.index][buttonConfig.fire] = false;
    }
    
    // Handle sonar button (B/Circle button)
    if (gamepad.buttons[buttonConfig.sonar] && gamepad.buttons[buttonConfig.sonar].pressed) {
      // Track button press state to avoid repeated sonar while holding
      if (!this.lastButtonStates[gamepad.index][buttonConfig.sonar]) {
        // Only fire sonar if cooldown has elapsed
        if (frameCount - player.lastSonarTime >= player.getEffectiveSonarCooldown()) {
          player.fireSonar(cave, enemies, jellyfish);
          
          // Haptic feedback for sonar
          if (GAMEPAD_CONTROLS_CONFIG.vibration.enabled) {
            this.vibrate(GAMEPAD_CONTROLS_CONFIG.vibration.intensities.sonar);
          }
        }
        this.lastButtonStates[gamepad.index][buttonConfig.sonar] = true;
      }
    } else {
      this.lastButtonStates[gamepad.index][buttonConfig.sonar] = false;
    }
    
    // Handle Start button for game state changes
    const startButton = buttonConfig.start;
    if (gamepad.buttons.length > startButton && 
        gamepad.buttons[startButton] && 
        gamepad.buttons[startButton].pressed) {
      
      // Track button press state to prevent repeat presses
      if (!this.lastButtonStates[gamepad.index][startButton]) {
        // Different behavior based on game state
        if (gameState === gameStates.START) {
          // Start the game
          handleKeyPressedStart();
          this.vibrate({ weak: 0.2, strong: 0.3, duration: 150 });
        } else if (gameState === gameStates.HIGH_SCORES) {
          // Continue to game
          handleKeyPressedHighScores();
          this.vibrate({ weak: 0.2, strong: 0.3, duration: 150 });
        } else if (gameState === gameStates.LEVEL_COMPLETE) {
          // Go to next level
          handleKeyPressedLevelComplete();
          this.vibrate({ weak: 0.3, strong: 0.4, duration: 200 });
        } else if (gameState === gameStates.GAME_OVER || gameState === gameStates.GAME_COMPLETE) {
          // Return to start
          handleKeyPressedGameOver();
          this.vibrate({ weak: 0.2, strong: 0.3, duration: 150 });
        }
        this.lastButtonStates[gamepad.index][startButton] = true;
      }
    } else {
      this.lastButtonStates[gamepad.index][startButton] = false;
    }
  }

  vibrate(options = { weak: 0, strong: 0, duration: 0 }) {
    if (!this.activeGamepad) return;
    
    // Skip if vibration not supported on this gamepad
    if (!this.activeGamepad.vibrationActuator) {
      return;
    }
    
    try {
      this.activeGamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: options.duration,
        weakMagnitude: options.weak,
        strongMagnitude: options.strong
      });
    } catch (e) {
      // Silently fail if vibration isn't supported or fails
      if (DEBUG_MODE) {
        console.log("Vibration failed:", e);
      }
    }
  }

  notifyDamage() {
    if (this.enabled && this.activeGamepad && GAMEPAD_CONTROLS_CONFIG.vibration.enabled) {
      this.vibrate(GAMEPAD_CONTROLS_CONFIG.vibration.intensities.damage);
    }
  }

  notifyCurrentAreaEntered() {
    if (this.enabled && this.activeGamepad && GAMEPAD_CONTROLS_CONFIG.vibration.enabled) {
      this.vibrate(GAMEPAD_CONTROLS_CONFIG.vibration.intensities.currentArea);
    }
  }
  
  // Method to send appropriate vibration based on event type
  notifyEvent(eventType) {
    if (!this.enabled || !this.activeGamepad || !GAMEPAD_CONTROLS_CONFIG.vibration.enabled) return;
    
    switch(eventType) {
      case 'powerup':
        this.vibrate({ weak: 0.2, strong: 0.4, duration: 250 });
        break;
      case 'levelComplete':
        this.vibrate({ weak: 0.5, strong: 0.3, duration: 500 });
        break;
      case 'gameOver':
        this.vibrate({ weak: 0.7, strong: 0.7, duration: 750 });
        break;
    }
  }

  render() {
    if (!this.enabled || !this.activeGamepad || !GAMEPAD_CONTROLS_CONFIG.visualFeedback.enabled) return;

    // Update position to be fixed near the bottom right
    this.visualFeedbackPosition = {
      x: width - 150,
      y: height - 30
    };

    // Only show visual feedback in playing state or if recently used
    if (gameState !== gameStates.PLAYING) return;
    
    // Check if any input is currently active to keep display visible
    let inputActive = this.isGamepadActive(this.activeGamepad);
    
    // If input is active, update the last input time
    if (inputActive) {
      this.lastInputTime = millis();
    }
    
    // Determine if we should show the feedback based on recent activity
    const showFeedback = inputActive || (millis() - this.lastInputTime < this.inputActiveTimeout);
    
    // Only render if we're showing feedback
    if (!showFeedback) return;
    
    push();
    const config = GAMEPAD_CONTROLS_CONFIG.visualFeedback;
    
    // Draw controller indicator with connection status
    noFill();
    stroke(config.color.h, config.color.s, config.color.b, config.alpha);
    strokeWeight(config.strokeWeight);
    
    const x = this.visualFeedbackPosition.x;
    const y = this.visualFeedbackPosition.y;
    
    // Simple gamepad icon
    rectMode(CENTER);
    rect(x, y, 30, 20, 5);
    
    // Draw buttons based on active state
    const buttonConfig = GAMEPAD_CONTROLS_CONFIG.buttons;
    const fireButtonPressed = this.activeGamepad.buttons[buttonConfig.fire]?.pressed;
    const sonarButtonPressed = this.activeGamepad.buttons[buttonConfig.sonar]?.pressed;
    
    // Fire button (red)
    fill(0, 100, 100, fireButtonPressed ? config.buttonPressedAlpha : config.alpha);
    circle(x + 10, y - 3, 6);
    
    // Sonar button (cyan)
    fill(180, 100, 100, sonarButtonPressed ? config.buttonPressedAlpha : config.alpha);
    circle(x + 4, y + 3, 6);
    
    // D-pad config
    const dpadConfig = GAMEPAD_CONTROLS_CONFIG.buttons.dpad;
    
    // Check both standard and alternate D-pad mappings for visual indicators
    // Standard mapping
    let upPressed = (this.activeGamepad.buttons.length > dpadConfig.up) && 
                   this.activeGamepad.buttons[dpadConfig.up]?.pressed;
                   
    let downPressed = (this.activeGamepad.buttons.length > dpadConfig.down) && 
                     this.activeGamepad.buttons[dpadConfig.down]?.pressed;
                     
    let leftPressed = (this.activeGamepad.buttons.length > dpadConfig.left) && 
                     this.activeGamepad.buttons[dpadConfig.left]?.pressed;
                     
    let rightPressed = (this.activeGamepad.buttons.length > dpadConfig.right) && 
                      this.activeGamepad.buttons[dpadConfig.right]?.pressed;
    
    // Alternate mapping
    upPressed = upPressed || ((this.activeGamepad.buttons.length > dpadConfig.altUp) && 
                      this.activeGamepad.buttons[dpadConfig.altUp]?.pressed);
                      
    downPressed = downPressed || ((this.activeGamepad.buttons.length > dpadConfig.altDown) && 
                        this.activeGamepad.buttons[dpadConfig.altDown]?.pressed);
                        
    leftPressed = leftPressed || ((this.activeGamepad.buttons.length > dpadConfig.altLeft) && 
                        this.activeGamepad.buttons[dpadConfig.altLeft]?.pressed);
                        
    rightPressed = rightPressed || ((this.activeGamepad.buttons.length > dpadConfig.altRight) && 
                         this.activeGamepad.buttons[dpadConfig.altRight]?.pressed);
    
    // Show D-pad input indicators when active
    if (upPressed) {
      fill(120, 100, 100, config.buttonPressedAlpha);
      triangle(x - 10, y - 2, x - 13, y + 3, x - 7, y + 3);
    }
    
    if (downPressed) {
      fill(120, 100, 100, config.buttonPressedAlpha);
      triangle(x - 10, y + 5, x - 13, y, x - 7, y);
    }
    
    if (leftPressed) {
      fill(120, 100, 100, config.buttonPressedAlpha);
      triangle(x - 15, y + 1, x - 10, y - 2, x - 10, y + 4);
    }
    
    if (rightPressed) {
      fill(120, 100, 100, config.buttonPressedAlpha);
      triangle(x - 5, y + 1, x - 10, y - 2, x - 10, y + 4);
    }
    
    pop();
  }
}

// Global gamepad controls instance
let gamepadControls;

function initGamepadControls() {
  gamepadControls = new GamepadControls();
}

// This will be called in the sketch.js to check for gamepad input
function updateGamepadControls() {
  gamepadControls?.update();
}

// This will be called in the sketch.js to render gamepad feedback
function renderGamepadControls() {
  gamepadControls?.render();
}

// Function to check if gamepad controls are enabled
function isGamepadControlsEnabled() {
  return gamepadControls?.enabled && gamepadControls?.activeGamepad !== null;
}
