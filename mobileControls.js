// Mobile and iPad Touch Controls for Submarine Game
// Only appears on mobile devices and tablets

// Mobile Controls Configuration
const MOBILE_CONTROLS_CONFIG = {
  // Directional buttons
  thrustButton: {
    x: 120,
    y: null, // Will be set to screen height - 180
    width: 70,
    height: 70,
    label: "↑"
  },
  reverseButton: {
    x: 120,
    y: null, // Will be set to screen height - 100
    width: 70,
    height: 70,
    label: "↓"
  },
  turnLeftButton: {
    x: 50,
    y: null, // Will be set to screen height - 140
    width: 70,
    height: 70,
    label: "←"
  },
  turnRightButton: {
    x: 190,
    y: null, // Will be set to screen height - 140
    width: 70,
    height: 70,
    label: "→"
  },

  // Fire button settings
  fireButton: {
    x: null,          // Will be set to screen width - 100
    y: null,          // Will be set to screen height - 120
    radius: 60,       // Button radius
    cooldownDisplay: true, // Show cooldown indicator
  },

  // Visual styling
  style: {
    strokeWeight: 3,
    outerAlpha: 120,  // Transparency for outer elements
    innerAlpha: 180,  // Transparency for inner elements
    pressedAlpha: 220, // Transparency when pressed
    textSize: 24, // Increased for button labels
    buttonCornerRadius: 10,

    // Colors (HSB values to match game's color scheme)
    controlButtonColor: { h: 180, s: 50, b: 70 }, // For directional buttons
    fireButtonColor: { h: 0, s: 80, b: 85 },
    pressedColor: { h: 60, s: 90, b: 95 },
  }
};

class MobileControls {
  constructor() {
    this.enabled = this.isMobileDevice();
    this.touches = new Map(); // Track multiple touches
    // Button states
    this.thrustButtonPressed = false;
    this.reverseButtonPressed = false;
    this.turnLeftButtonPressed = false;
    this.turnRightButtonPressed = false;
    this.fireButtonPressed = false;

    // Button press timestamps for timeout safety
    this.buttonPressTimestamps = {
      thrust: 0,
      reverse: 0,
      turnLeft: 0,
      turnRight: 0,
      fire: 0
    };

    this.lastFireTime = 0;

    // Safety timeout to prevent stuck buttons (in milliseconds)
    this.BUTTON_TIMEOUT = 5000; // 5 seconds max button press

    if (this.enabled) {
      this.initializeControls();
      console.log("Mobile controls enabled with D-pad");
    }
  }

  isMobileDevice() {
    // Detect mobile devices and tablets
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for specific mobile/tablet patterns
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Improved iPad detection - iPad can report as desktop in some cases
    const isIPad = /ipad/i.test(userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                   (userAgent.includes('mac') && hasTouch && navigator.maxTouchPoints > 0);
    
    // Screen size detection for tablets
    const screenSize = Math.max(window.screen.width, window.screen.height);
    const isTabletSize = screenSize >= 768 && screenSize <= 1366;
    
    // Additional checks for modern iPadOS (Safari might report as Mac)
    const isProbablyIPad = navigator.platform === 'MacIntel' && 
                          navigator.maxTouchPoints > 1 && 
                          !window.MSStream;
    
    // Debug logging
    console.log('Device detection:', {
      userAgent,
      isMobile,
      hasTouch,
      isIPad,
      isProbablyIPad,
      screenSize,
      isTabletSize,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints
    });
    
    // Return true if any mobile/tablet indicator is present
    return isMobile || isIPad || isProbablyIPad || (hasTouch && isTabletSize);
  }

  isDesktop() {
    // Simplified desktop detection - if it's not clearly mobile, don't force disable
    const userAgent = navigator.userAgent.toLowerCase();
    const hasNoTouch = !('ontouchstart' in window) && navigator.maxTouchPoints === 0;
    const isWindows = /windows/i.test(userAgent) && hasNoTouch;
    const isLinux = /linux/i.test(userAgent) && hasNoTouch && !/android/i.test(userAgent);
    
    return (isWindows || isLinux) && !/mobile|tablet|ipad|iphone/i.test(userAgent);
  }

  initializeControls() {
    // Set up responsive positioning
    this.updatePositions();
    
    // Add touch event listeners
    this.setupTouchEvents();
    
    // Update positions on resize
    window.addEventListener('resize', () => this.updatePositions());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.updatePositions(), 100);
    });
  }

  updatePositions() {
    if (!this.enabled) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    console.log('Updating mobile control positions. Canvas size:', canvasWidth, 'x', canvasHeight);

    // Update D-pad button positions (bottom left)
    MOBILE_CONTROLS_CONFIG.thrustButton.y = canvasHeight - 200; // Top button
    MOBILE_CONTROLS_CONFIG.reverseButton.y = canvasHeight - 100; // Bottom button
    MOBILE_CONTROLS_CONFIG.turnLeftButton.y = canvasHeight - 150; // Middle row
    MOBILE_CONTROLS_CONFIG.turnRightButton.y = canvasHeight - 150; // Middle row
    
    // Adjust X positions for D-pad layout
    MOBILE_CONTROLS_CONFIG.thrustButton.x = 120;
    MOBILE_CONTROLS_CONFIG.reverseButton.x = 120;
    MOBILE_CONTROLS_CONFIG.turnLeftButton.x = 50;
    MOBILE_CONTROLS_CONFIG.turnRightButton.x = 190;

    // Update fire button position (bottom right)
    MOBILE_CONTROLS_CONFIG.fireButton.x = canvasWidth - 100;
    MOBILE_CONTROLS_CONFIG.fireButton.y = canvasHeight - 120;

    console.log('Control positions updated:', {
      thrustButton: { x: MOBILE_CONTROLS_CONFIG.thrustButton.x, y: MOBILE_CONTROLS_CONFIG.thrustButton.y },
      reverseButton: { x: MOBILE_CONTROLS_CONFIG.reverseButton.x, y: MOBILE_CONTROLS_CONFIG.reverseButton.y },
      turnLeftButton: { x: MOBILE_CONTROLS_CONFIG.turnLeftButton.x, y: MOBILE_CONTROLS_CONFIG.turnLeftButton.y },
      turnRightButton: { x: MOBILE_CONTROLS_CONFIG.turnRightButton.x, y: MOBILE_CONTROLS_CONFIG.turnRightButton.y },
      fireButton: { x: MOBILE_CONTROLS_CONFIG.fireButton.x, y: MOBILE_CONTROLS_CONFIG.fireButton.y }
    });
  }

  setupTouchEvents() {
    if (!this.enabled) return;

    console.log('Setting up touch events for mobile controls');

    document.addEventListener('touchmove', (e) => {
      if (this.thrustButtonPressed || this.reverseButtonPressed || this.turnLeftButtonPressed || this.turnRightButtonPressed || this.fireButtonPressed) {
        e.preventDefault();
      }
    }, { passive: false });

    // Prevent zoom on double tap
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Additional setup for iOS Safari
    document.body.style.touchAction = 'manipulation';
    
    console.log('Touch events setup complete');
  }

  isTouchOnControls(touch) {
    if (!touch) return false;

    const touchX = touch.clientX;
    const touchY = touch.clientY;

    return this.isPointInThrustButton(touchX, touchY) ||
           this.isPointInReverseButton(touchX, touchY) ||
           this.isPointInTurnLeftButton(touchX, touchY) ||
           this.isPointInTurnRightButton(touchX, touchY) ||
           this.isPointInFireButton(touchX, touchY);
  }

  handleTouchStart(touches) {
    if (!this.enabled) return;

    console.log('Touch start detected, touches:', touches.length);

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      let touchX, touchY;

      if (touch.x !== undefined && touch.y !== undefined) {
        touchX = touch.x;
        touchY = touch.y;
      } else if (touch.clientX !== undefined && touch.clientY !== undefined) {
        touchX = touch.clientX;
        touchY = touch.clientY;
      } else {
        console.log('Touch object missing coordinates:', touch);
        continue;
      }

      console.log(`Touch ${i}: x=${touchX}, y=${touchY}, identifier=${touch.identifier}`);
      this.updatePositions(); // Ensure positions are current

      if (typeof gameState !== 'undefined' &&
          (gameState === 'start' || gameState === 'levelComplete' ||
           gameState === 'gameOver' || gameState === 'gameComplete')) {
        if (typeof keyPressed === 'function') {
          window.keyCode = 13; // ENTER
          try { keyPressed(); } catch (e) { console.log('Error calling keyPressed:', e); }
        }
        return;
      }

      if (typeof gameState === 'undefined' || gameState !== 'playing') {
        console.log('Not in playing state, ignoring touch for controls');
        return;
      }

      const touchId = touch.identifier !== undefined ? touch.identifier : i;

      if (this.isPointInThrustButton(touchX, touchY)) {
        this.thrustButtonPressed = true;
        this.buttonPressTimestamps.thrust = millis();
        this.touches.set(touchId, { type: 'thrust', x: touchX, y: touchY });
        console.log('Thrust button pressed');
      } else if (this.isPointInReverseButton(touchX, touchY)) {
        this.reverseButtonPressed = true;
        this.buttonPressTimestamps.reverse = millis();
        this.touches.set(touchId, { type: 'reverse', x: touchX, y: touchY });
        console.log('Reverse button pressed');
      } else if (this.isPointInTurnLeftButton(touchX, touchY)) {
        this.turnLeftButtonPressed = true;
        this.buttonPressTimestamps.turnLeft = millis();
        this.touches.set(touchId, { type: 'turnLeft', x: touchX, y: touchY });
        console.log('Turn Left button pressed');
      } else if (this.isPointInTurnRightButton(touchX, touchY)) {
        this.turnRightButtonPressed = true;
        this.buttonPressTimestamps.turnRight = millis();
        this.touches.set(touchId, { type: 'turnRight', x: touchX, y: touchY });
        console.log('Turn Right button pressed');
      } else if (this.isPointInFireButton(touchX, touchY)) {
        this.fireButtonPressed = true;
        this.buttonPressTimestamps.fire = millis();
        this.touches.set(touchId, { type: 'fire', x: touchX, y: touchY });
        this.handleFire();
        console.log('Fire button pressed');
      }
    }
  }

  handleTouchMove(touches) {
    if (!this.enabled) return;

    // Check each tracked touch to see if it's still within its button
    for (let [touchId, storedTouch] of this.touches.entries()) {
      let touchFound = false;
      
      // Find the current position of this touch
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const currentTouchId = touch.identifier !== undefined ? touch.identifier : i;
        
        if (currentTouchId === touchId) {
          touchFound = true;
          let touchX, touchY;

          if (touch.x !== undefined && touch.y !== undefined) {
            touchX = touch.x;
            touchY = touch.y;
          } else if (touch.clientX !== undefined && touch.clientY !== undefined) {
            touchX = touch.clientX;
            touchY = touch.clientY;
          } else {
            continue;
          }

          // Check if the touch is still within the original button
          let stillInButton = false;
          switch (storedTouch.type) {
            case 'thrust':
              stillInButton = this.isPointInThrustButton(touchX, touchY);
              break;
            case 'reverse':
              stillInButton = this.isPointInReverseButton(touchX, touchY);
              break;
            case 'turnLeft':
              stillInButton = this.isPointInTurnLeftButton(touchX, touchY);
              break;
            case 'turnRight':
              stillInButton = this.isPointInTurnRightButton(touchX, touchY);
              break;
            case 'fire':
              stillInButton = this.isPointInFireButton(touchX, touchY);
              break;
          }

          // If touch moved outside the button, release it
          if (!stillInButton) {
            console.log('Touch moved outside button, releasing:', storedTouch.type);
            switch (storedTouch.type) {
              case 'thrust': this.thrustButtonPressed = false; break;
              case 'reverse': this.reverseButtonPressed = false; break;
              case 'turnLeft': this.turnLeftButtonPressed = false; break;
              case 'turnRight': this.turnRightButtonPressed = false; break;
              case 'fire': this.fireButtonPressed = false; break;
            }
            this.touches.delete(touchId);
          }
          break;
        }
      }

      // If we couldn't find this touch in the current touches array, it probably ended
      if (!touchFound) {
        console.log('Touch not found in current touches, releasing:', storedTouch.type);
        switch (storedTouch.type) {
          case 'thrust': this.thrustButtonPressed = false; break;
          case 'reverse': this.reverseButtonPressed = false; break;
          case 'turnLeft': this.turnLeftButtonPressed = false; break;
          case 'turnRight': this.turnRightButtonPressed = false; break;
          case 'fire': this.fireButtonPressed = false; break;
        }
        this.touches.delete(touchId);
      }
    }
  }

  handleTouchEnd(touches) {
    if (!this.enabled) return;

    console.log('Touch end event, touches provided:', touches.length);

    // In p5.js touchEnded, the touches array contains the touches that just ended
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchId = touch.identifier !== undefined ? touch.identifier : i;
      const storedTouch = this.touches.get(touchId);

      console.log('Processing touch end for ID:', touchId, 'stored touch:', storedTouch);

      if (storedTouch) {
        console.log('Touch end for type:', storedTouch.type, 'ID:', touchId);
        switch (storedTouch.type) {
          case 'thrust': 
            this.thrustButtonPressed = false; 
            console.log('Thrust button released');
            break;
          case 'reverse': 
            this.reverseButtonPressed = false; 
            console.log('Reverse button released');
            break;
          case 'turnLeft': 
            this.turnLeftButtonPressed = false; 
            console.log('Turn left button released');
            break;
          case 'turnRight': 
            this.turnRightButtonPressed = false; 
            console.log('Turn right button released');
            break;
          case 'fire': 
            this.fireButtonPressed = false; 
            console.log('Fire button released');
            break;
        }
        this.touches.delete(touchId);
      } else {
        // If we don't have a stored touch, this might be a touch that ended
        // without being tracked properly. Reset all buttons as a safety measure.
        console.log('Unknown touch ended, resetting all buttons as safety measure');
        this.resetAllButtons();
      }
    }

    // Also check if all touches have ended by checking remaining active touches
    console.log('Remaining tracked touches:', this.touches.size);
    if (this.touches.size === 0) {
      console.log('No more tracked touches, ensuring all buttons are released');
      this.resetAllButtons();
    }
  }

  resetAllButtons() {
    this.thrustButtonPressed = false;
    this.reverseButtonPressed = false;
    this.turnLeftButtonPressed = false;
    this.turnRightButtonPressed = false;
    this.fireButtonPressed = false;
    console.log('All buttons reset');
  }

  handleFire() {
    const currentTime = millis();
    if (currentTime - this.lastFireTime > 200) { // Minimum 200ms between shots to prevent spam
      this.lastFireTime = currentTime;
      
      // Trigger player shoot if player exists and game is playing
      if (typeof player !== 'undefined' && player && gameState === 'playing') {
        player.shoot();
      }
    }
  }

  // Collision detection methods for new buttons
  isPointInButton(x, y, buttonConfig) {
    return x >= buttonConfig.x - buttonConfig.width / 2 &&
           x <= buttonConfig.x + buttonConfig.width / 2 &&
           y >= buttonConfig.y - buttonConfig.height / 2 &&
           y <= buttonConfig.y + buttonConfig.height / 2;
  }

  isPointInThrustButton(x, y) {
    return this.isPointInButton(x, y, MOBILE_CONTROLS_CONFIG.thrustButton);
  }
  isPointInReverseButton(x, y) {
    return this.isPointInButton(x, y, MOBILE_CONTROLS_CONFIG.reverseButton);
  }
  isPointInTurnLeftButton(x, y) {
    return this.isPointInButton(x, y, MOBILE_CONTROLS_CONFIG.turnLeftButton);
  }
  isPointInTurnRightButton(x, y) {
    return this.isPointInButton(x, y, MOBILE_CONTROLS_CONFIG.turnRightButton);
  }

  isPointInFireButton(x, y) {
    const button = MOBILE_CONTROLS_CONFIG.fireButton;
    const distance = Math.sqrt(Math.pow(x - button.x, 2) + Math.pow(y - button.y, 2));
    return distance <= button.radius;
  }

  applyMovement() {
    if (!this.enabled || (typeof player === 'undefined' || !player || gameState !== 'playing')) return;

    if (this.thrustButtonPressed) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(PLAYER_THRUST_POWER));
    }
    if (this.reverseButtonPressed) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(-PLAYER_THRUST_POWER * PLAYER_REVERSE_THRUST_FACTOR));
    }
    if (this.turnLeftButtonPressed) {
      player.angle -= PLAYER_TURN_SPEED;
    }
    if (this.turnRightButtonPressed) {
      player.angle += PLAYER_TURN_SPEED;
    }
  }

  render() {
    if (!this.enabled || (typeof gameState === 'undefined' || gameState !== 'playing')) {
      return;
    }
    this.updatePositions(); // Ensure positions are current
    
    // Safety check: release buttons that have been pressed too long
    this.checkButtonTimeouts();

    // Draw D-pad buttons
    this.renderDirectionalButton(MOBILE_CONTROLS_CONFIG.thrustButton, this.thrustButtonPressed);
    this.renderDirectionalButton(MOBILE_CONTROLS_CONFIG.reverseButton, this.reverseButtonPressed);
    this.renderDirectionalButton(MOBILE_CONTROLS_CONFIG.turnLeftButton, this.turnLeftButtonPressed);
    this.renderDirectionalButton(MOBILE_CONTROLS_CONFIG.turnRightButton, this.turnRightButtonPressed);

    this.renderFireButton();

    if (typeof fill === 'function' && typeof text === 'function') {
      fill(255, 255, 255, 150);
      textAlign(LEFT, TOP);
      textSize(12);
      let touchDebug = `T:${this.thrustButtonPressed ? 'U' : ''}${this.reverseButtonPressed ? 'D' : ''}${this.turnLeftButtonPressed ? 'L' : ''}${this.turnRightButtonPressed ? 'R' : ''}`;
      text(`Mobile: ${this.enabled ? 'ON' : 'OFF'} | ${touchDebug} ${this.fireButtonPressed ? 'FIRE' : ''}`, 10, 10);
    }
  }

  checkButtonTimeouts() {
    const currentTime = millis();
    
    if (this.thrustButtonPressed && currentTime - this.buttonPressTimestamps.thrust > this.BUTTON_TIMEOUT) {
      console.log('Thrust button timeout, releasing');
      this.thrustButtonPressed = false;
    }
    if (this.reverseButtonPressed && currentTime - this.buttonPressTimestamps.reverse > this.BUTTON_TIMEOUT) {
      console.log('Reverse button timeout, releasing');
      this.reverseButtonPressed = false;
    }
    if (this.turnLeftButtonPressed && currentTime - this.buttonPressTimestamps.turnLeft > this.BUTTON_TIMEOUT) {
      console.log('Turn left button timeout, releasing');
      this.turnLeftButtonPressed = false;
    }
    if (this.turnRightButtonPressed && currentTime - this.buttonPressTimestamps.turnRight > this.BUTTON_TIMEOUT) {
      console.log('Turn right button timeout, releasing');
      this.turnRightButtonPressed = false;
    }
    if (this.fireButtonPressed && currentTime - this.buttonPressTimestamps.fire > this.BUTTON_TIMEOUT) {
      console.log('Fire button timeout, releasing');
      this.fireButtonPressed = false;
    }
  }

  renderDirectionalButton(buttonConfig, isPressed) {
    const style = MOBILE_CONTROLS_CONFIG.style;
    push();
    rectMode(CENTER);
    const buttonAlpha = isPressed ? style.pressedAlpha : style.innerAlpha;
    const buttonColor = isPressed ? style.pressedColor : style.controlButtonColor;

    strokeWeight(style.strokeWeight);
    stroke(buttonColor.h, buttonColor.s, buttonColor.b + 20, buttonAlpha);
    fill(buttonColor.h, buttonColor.s, buttonColor.b, buttonAlpha * 0.7);
    rect(buttonConfig.x, buttonConfig.y, buttonConfig.width, buttonConfig.height, style.buttonCornerRadius);

    fill(buttonColor.h, buttonColor.s, buttonColor.b + 40, buttonAlpha + 30);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(style.textSize);
    text(buttonConfig.label, buttonConfig.x, buttonConfig.y);
    pop();
  }

  renderFireButton() {
    const button = MOBILE_CONTROLS_CONFIG.fireButton;
    const style = MOBILE_CONTROLS_CONFIG.style;
    
    push();
    
    // Main button - more prominent when pressed
    const buttonAlpha = this.fireButtonPressed ? style.pressedAlpha + 50 : style.innerAlpha + 30;
    const buttonColor = this.fireButtonPressed ? style.pressedColor : style.fireButtonColor;
    
    strokeWeight(style.strokeWeight + 1);
    stroke(buttonColor.h, buttonColor.s, buttonColor.b + 20, buttonAlpha);
    fill(buttonColor.h, buttonColor.s, buttonColor.b, buttonAlpha * 0.8);
    ellipse(button.x, button.y, button.radius * 2);
    
    // Fire icon (simple triangle/arrow) - more prominent
    fill(buttonColor.h, buttonColor.s, buttonColor.b + 30, buttonAlpha + 50);
    noStroke();
    const iconSize = button.radius * 0.5; // Slightly larger icon
    triangle(
      button.x + iconSize * 0.8, button.y,
      button.x - iconSize * 0.4, button.y - iconSize * 0.6,
      button.x - iconSize * 0.4, button.y + iconSize * 0.6
    );
    
    // Cooldown indicator
    if (button.cooldownDisplay && typeof player !== 'undefined' && player) {
      const cooldownProgress = Math.max(0, (millis() - this.lastFireTime) / 200);
      if (cooldownProgress < 1) {
        stroke(60, 100, 100, 200);
        strokeWeight(style.strokeWeight + 2);
        noFill();
        arc(button.x, button.y, button.radius * 2.2, button.radius * 2.2, 
            -PI/2, -PI/2 + TWO_PI * cooldownProgress);
      }
    }
    
    // Label - more visible
    fill(buttonColor.h, buttonColor.s, buttonColor.b + 40, buttonAlpha + 30);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(style.textSize * 0.9);
    text("FIRE", button.x, button.y + button.radius + 25);
    
    pop();
  }
}

// Global mobile controls instance
let mobileControls;

// Initialize mobile controls when the script loads
function initMobileControls() {
  mobileControls = new MobileControls();
}

// Touch event handlers to be called from main sketch
function handleMobileTouchStart(touches) {
  if (mobileControls && mobileControls.enabled) {
    mobileControls.handleTouchStart(touches);
  }
}

function handleMobileTouchMove(touches) {
  if (mobileControls && mobileControls.enabled) {
    mobileControls.handleTouchMove(touches);
  }
}

function handleMobileTouchEnd(touches) {
  if (mobileControls && mobileControls.enabled) {
    mobileControls.handleTouchEnd(touches);
  }
}

// Apply mobile movement - call this in the player update loop
function applyMobileMovement() {
  if (mobileControls && mobileControls.enabled) {
    mobileControls.applyMovement();
  }
}

// Render mobile controls - call this in the draw loop
function renderMobileControls() {
  if (mobileControls && mobileControls.enabled) {
    mobileControls.render();
  }
}

// Check if mobile controls are active
function isMobileControlsEnabled() {
  return mobileControls && mobileControls.enabled;
}
