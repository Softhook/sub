// Mobile and iPad Touch Controls for Submarine Game
// Refactored for better organization and maintainability

// ==================== CONSTANTS & CONFIGURATION ====================

const MOBILE_CONFIG = {
  // Button dimensions and layout
  DPAD: {
    BUTTON_SIZE: 70,
    CENTER_X: 120,
    LEFT_X: 50,
    RIGHT_X: 190,
    TOP_OFFSET: 200,     // from bottom
    MIDDLE_OFFSET: 150,  // from bottom
    BOTTOM_OFFSET: 100   // from bottom
  },
  
  FIRE_BUTTON: {
    RADIUS: 60,
    RIGHT_MARGIN: 100,   // from right edge
    BOTTOM_MARGIN: 120   // from bottom
  },
  
  // Visual styling
  STYLE: {
    STROKE_WEIGHT: 3,
    ALPHA: {
      NORMAL: 180,
      PRESSED: 220,
      OUTER: 120
    },
    TEXT_SIZE: 24,
    CORNER_RADIUS: 10,
    COLORS: {
      CONTROL: { h: 180, s: 50, b: 70 },
      FIRE: { h: 0, s: 80, b: 85 },
      PRESSED: { h: 60, s: 90, b: 95 }
    }
  },
  
  // Timing
  TIMING: {
    FIRE_COOLDOWN: 200,      // ms between shots
    BUTTON_TIMEOUT: 5000,    // ms max button press
    ORIENTATION_DELAY: 100   // ms delay after orientation change
  }
};

// Button type enumeration for cleaner code
const BUTTON_TYPES = {
  THRUST: 'thrust',
  REVERSE: 'reverse', 
  TURN_LEFT: 'turnLeft',
  TURN_RIGHT: 'turnRight',
  FIRE: 'fire'
};

// ==================== UTILITY CLASSES ====================

class DeviceDetector {
  static isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    const patterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Enhanced iPad detection for modern iPadOS
    const isIPad = /ipad/i.test(userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    const screenSize = Math.max(window.screen.width, window.screen.height);
    const isTabletSize = screenSize >= 768 && screenSize <= 1366;
    
    const result = patterns.test(userAgent) || isIPad || (hasTouch && isTabletSize);
    
    if (result) {
      console.log('Mobile device detected:', {
        userAgent: userAgent.substring(0, 50) + '...',
        hasTouch,
        isIPad,
        screenSize,
        platform: navigator.platform
      });
    }
    
    return result;
  }
}

class TouchTracker {
  constructor() {
    this.activeTouches = new Map();
  }
  
  addTouch(touchId, buttonType, position) {
    this.activeTouches.set(touchId, {
      type: buttonType,
      startTime: millis(),
      position
    });
  }
  
  removeTouch(touchId) {
    return this.activeTouches.delete(touchId);
  }
  
  getTouch(touchId) {
    return this.activeTouches.get(touchId);
  }
  
  clear() {
    this.activeTouches.clear();
  }
  
  get size() {
    return this.activeTouches.size;
  }
  
  entries() {
    return this.activeTouches.entries();
  }
}

class ButtonState {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.thrust = false;
    this.reverse = false;
    this.turnLeft = false;
    this.turnRight = false;
    this.fire = false;
  }
  
  set(buttonType, pressed) {
    this[buttonType] = pressed;
  }
  
  get(buttonType) {
    return this[buttonType];
  }
}

// ==================== MAIN MOBILE CONTROLS CLASS ====================

class MobileControls {
  constructor() {
    this.enabled = DeviceDetector.isMobile();
    this.touchTracker = new TouchTracker();
    this.buttonState = new ButtonState();
    this.buttonTimestamps = new Map();
    this.lastFireTime = 0;
    this.buttonPositions = this._initializeButtonPositions();
    
    if (this.enabled) {
      this._initialize();
      console.log("Mobile controls enabled with refactored D-pad");
    }
  }

  // ==================== INITIALIZATION ====================
  
  _initialize() {
    this._updateButtonPositions();
    this._setupTouchEvents();
    this._setupResizeListeners();
  }
  
  _initializeButtonPositions() {
    return {
      thrust: { x: 0, y: 0, width: MOBILE_CONFIG.DPAD.BUTTON_SIZE, height: MOBILE_CONFIG.DPAD.BUTTON_SIZE, label: "↑" },
      reverse: { x: 0, y: 0, width: MOBILE_CONFIG.DPAD.BUTTON_SIZE, height: MOBILE_CONFIG.DPAD.BUTTON_SIZE, label: "↓" },
      turnLeft: { x: 0, y: 0, width: MOBILE_CONFIG.DPAD.BUTTON_SIZE, height: MOBILE_CONFIG.DPAD.BUTTON_SIZE, label: "←" },
      turnRight: { x: 0, y: 0, width: MOBILE_CONFIG.DPAD.BUTTON_SIZE, height: MOBILE_CONFIG.DPAD.BUTTON_SIZE, label: "→" },
      fire: { x: 0, y: 0, radius: MOBILE_CONFIG.FIRE_BUTTON.RADIUS }
    };
  }
  
  _setupResizeListeners() {
    window.addEventListener('resize', () => this._updateButtonPositions());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this._updateButtonPositions(), MOBILE_CONFIG.TIMING.ORIENTATION_DELAY);
    });
  }
  
  _setupTouchEvents() {
    if (!this.enabled) return;

    // Prevent scrolling when touching control areas
    document.addEventListener('touchmove', (e) => {
      if (this._anyButtonPressed()) {
        e.preventDefault();
      }
    }, { passive: false });

    // Prevent zoom on double tap
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.body.style.touchAction = 'manipulation';
    console.log('Touch events configured');
  }

  // ==================== BUTTON POSITIONING ====================
  
  _updateButtonPositions() {
    if (!this.enabled) return;

    const { innerWidth: width, innerHeight: height } = window;
    const { DPAD, FIRE_BUTTON } = MOBILE_CONFIG;
    
    // D-pad positioning
    this.buttonPositions.thrust.x = DPAD.CENTER_X;
    this.buttonPositions.thrust.y = height - DPAD.TOP_OFFSET;
    
    this.buttonPositions.reverse.x = DPAD.CENTER_X;
    this.buttonPositions.reverse.y = height - DPAD.BOTTOM_OFFSET;
    
    this.buttonPositions.turnLeft.x = DPAD.LEFT_X;
    this.buttonPositions.turnLeft.y = height - DPAD.MIDDLE_OFFSET;
    
    this.buttonPositions.turnRight.x = DPAD.RIGHT_X;
    this.buttonPositions.turnRight.y = height - DPAD.MIDDLE_OFFSET;
    
    // Fire button positioning
    this.buttonPositions.fire.x = width - FIRE_BUTTON.RIGHT_MARGIN;
    this.buttonPositions.fire.y = height - FIRE_BUTTON.BOTTOM_MARGIN;
  }

  // ==================== BUTTON STATE MANAGEMENT ====================
  
  _anyButtonPressed() {
    return this.buttonState.thrust || this.buttonState.reverse || 
           this.buttonState.turnLeft || this.buttonState.turnRight || 
           this.buttonState.fire;
  }
  
  _setButtonState(buttonType, pressed) {
    this.buttonState.set(buttonType, pressed);
    if (pressed) {
      this.buttonTimestamps.set(buttonType, millis());
    }
  }
  
  _resetAllButtons() {
    this.buttonState.reset();
    this.touchTracker.clear();
    this.buttonTimestamps.clear();
    console.log('All buttons reset');
  }
  
  _checkButtonTimeouts() {
    const currentTime = millis();
    const timeout = MOBILE_CONFIG.TIMING.BUTTON_TIMEOUT;
    
    for (const [buttonType, timestamp] of this.buttonTimestamps.entries()) {
      if (this.buttonState.get(buttonType) && currentTime - timestamp > timeout) {
        console.log(`${buttonType} button timeout, releasing`);
        this.buttonState.set(buttonType, false);
        this.buttonTimestamps.delete(buttonType);
      }
    }
  }

  // ==================== COLLISION DETECTION ====================
  
  _getButtonType(x, y) {
    // Check rectangular buttons (D-pad)
    for (const [type, button] of Object.entries(this.buttonPositions)) {
      if (type === 'fire') continue; // Handle fire button separately
      
      if (this._isPointInRect(x, y, button)) {
        return type;
      }
    }
    
    // Check circular fire button
    if (this._isPointInCircle(x, y, this.buttonPositions.fire)) {
      return BUTTON_TYPES.FIRE;
    }
    
    return null;
  }
  
  _isPointInRect(x, y, button) {
    const halfWidth = button.width / 2;
    const halfHeight = button.height / 2;
    return x >= button.x - halfWidth && x <= button.x + halfWidth &&
           y >= button.y - halfHeight && y <= button.y + halfHeight;
  }
  
  _isPointInCircle(x, y, button) {
    const distance = Math.sqrt(Math.pow(x - button.x, 2) + Math.pow(y - button.y, 2));
    return distance <= button.radius;
  }

  // ==================== TOUCH EVENT HANDLING ====================
  
  _extractTouchCoordinates(touch) {
    if (touch.x !== undefined && touch.y !== undefined) {
      return { x: touch.x, y: touch.y };
    }
    if (touch.clientX !== undefined && touch.clientY !== undefined) {
      return { x: touch.clientX, y: touch.clientY };
    }
    return null;
  }
  
  _shouldIgnoreTouch() {
    return typeof gameState !== 'undefined' && gameState !== 'playing';
  }
  
  _handleMenuTouch() {
    if (typeof gameState !== 'undefined' &&
        (gameState === 'start' || gameState === 'levelComplete' ||
         gameState === 'gameOver' || gameState === 'gameComplete')) {
      if (typeof keyPressed === 'function') {
        window.keyCode = 13; // ENTER
        try { keyPressed(); } catch (e) { console.log('Error calling keyPressed:', e); }
      }
    }
  }

  handleTouchStart(touches) {
    if (!this.enabled) return;

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const coords = this._extractTouchCoordinates(touch);
      if (!coords) continue;

      this._updateButtonPositions();

      // Handle menu navigation
      if (this._shouldIgnoreTouch()) {
        this._handleMenuTouch();
        return;
      }

      const touchId = touch.identifier !== undefined ? touch.identifier : i;
      const buttonType = this._getButtonType(coords.x, coords.y);
      
      if (buttonType) {
        this._setButtonState(buttonType, true);
        this.touchTracker.addTouch(touchId, buttonType, coords);
        
        if (buttonType === BUTTON_TYPES.FIRE) {
          this._handleFire();
        }
        
        console.log(`${buttonType} button pressed`);
      }
    }
  }

  handleTouchMove(touches) {
    if (!this.enabled) return;

    // Check if tracked touches are still within their buttons
    for (const [touchId, touchData] of this.touchTracker.entries()) {
      let touchFound = false;
      
      for (const touch of touches) {
        const currentTouchId = touch.identifier !== undefined ? touch.identifier : touches.indexOf(touch);
        
        if (currentTouchId === touchId) {
          touchFound = true;
          const coords = this._extractTouchCoordinates(touch);
          if (!coords) continue;

          const currentButtonType = this._getButtonType(coords.x, coords.y);
          
          // If touch moved outside the original button, release it
          if (currentButtonType !== touchData.type) {
            this._setButtonState(touchData.type, false);
            this.touchTracker.removeTouch(touchId);
            console.log(`Touch moved outside ${touchData.type} button, releasing`);
          }
          break;
        }
      }

      // If touch disappeared, release the button
      if (!touchFound) {
        this._setButtonState(touchData.type, false);
        this.touchTracker.removeTouch(touchId);
        console.log(`Touch ${touchId} disappeared, releasing ${touchData.type} button`);
      }
    }
  }

  handleTouchEnd(touches) {
    if (!this.enabled) return;

    for (const touch of touches) {
      const touchId = touch.identifier !== undefined ? touch.identifier : touches.indexOf(touch);
      const touchData = this.touchTracker.getTouch(touchId);

      if (touchData) {
        this._setButtonState(touchData.type, false);
        this.touchTracker.removeTouch(touchId);
        console.log(`${touchData.type} button released`);
      }
    }

    // Safety check: if no touches remain, reset all buttons
    if (this.touchTracker.size === 0) {
      this._resetAllButtons();
    }
  }

  // ==================== GAME INTEGRATION ====================
  
  _handleFire() {
    const currentTime = millis();
    if (currentTime - this.lastFireTime > MOBILE_CONFIG.TIMING.FIRE_COOLDOWN) {
      this.lastFireTime = currentTime;
      
      if (typeof player !== 'undefined' && player && gameState === 'playing') {
        player.shoot();
      }
    }
  }

  applyMovement() {
    if (!this.enabled || typeof player === 'undefined' || !player || gameState !== 'playing') {
      return;
    }

    if (this.buttonState.thrust) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(PLAYER_THRUST_POWER));
    }
    if (this.buttonState.reverse) {
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(-PLAYER_THRUST_POWER * PLAYER_REVERSE_THRUST_FACTOR));
    }
    if (this.buttonState.turnLeft) {
      player.angle -= PLAYER_TURN_SPEED;
    }
    if (this.buttonState.turnRight) {
      player.angle += PLAYER_TURN_SPEED;
    }
  }

  // ==================== RENDERING ====================

  render() {
    if (!this.enabled || typeof gameState === 'undefined' || gameState !== 'playing') {
      return;
    }
    
    this._updateButtonPositions();
    this._checkButtonTimeouts();

    // Render D-pad buttons
    this._renderDPadButton(BUTTON_TYPES.THRUST);
    this._renderDPadButton(BUTTON_TYPES.REVERSE);
    this._renderDPadButton(BUTTON_TYPES.TURN_LEFT);
    this._renderDPadButton(BUTTON_TYPES.TURN_RIGHT);

    // Render fire button
    this._renderFireButton();

    // Debug info
    this._renderDebugInfo();
  }

  _renderDPadButton(buttonType) {
    const button = this.buttonPositions[buttonType];
    const isPressed = this.buttonState.get(buttonType);
    const { STYLE } = MOBILE_CONFIG;
    
    push();
    rectMode(CENTER);
    
    const alpha = isPressed ? STYLE.ALPHA.PRESSED : STYLE.ALPHA.NORMAL;
    const color = isPressed ? STYLE.COLORS.PRESSED : STYLE.COLORS.CONTROL;

    strokeWeight(STYLE.STROKE_WEIGHT);
    stroke(color.h, color.s, color.b + 20, alpha);
    fill(color.h, color.s, color.b, alpha * 0.7);
    rect(button.x, button.y, button.width, button.height, STYLE.CORNER_RADIUS);

    // Button label
    fill(color.h, color.s, color.b + 40, alpha + 30);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(STYLE.TEXT_SIZE);
    text(button.label, button.x, button.y);
    
    pop();
  }

  _renderFireButton() {
    const button = this.buttonPositions.fire;
    const isPressed = this.buttonState.fire;
    const { STYLE } = MOBILE_CONFIG;
    
    push();
    
    const alpha = isPressed ? STYLE.ALPHA.PRESSED + 50 : STYLE.ALPHA.NORMAL + 30;
    const color = isPressed ? STYLE.COLORS.PRESSED : STYLE.COLORS.FIRE;
    
    strokeWeight(STYLE.STROKE_WEIGHT + 1);
    stroke(color.h, color.s, color.b + 20, alpha);
    fill(color.h, color.s, color.b, alpha * 0.8);
    ellipse(button.x, button.y, button.radius * 2);
    
    // Fire icon (triangle)
    fill(color.h, color.s, color.b + 30, alpha + 50);
    noStroke();
    const iconSize = button.radius * 0.5;
    triangle(
      button.x + iconSize * 0.8, button.y,
      button.x - iconSize * 0.4, button.y - iconSize * 0.6,
      button.x - iconSize * 0.4, button.y + iconSize * 0.6
    );
    
    // Cooldown indicator
    this._renderFireCooldown(button, alpha);
    
    // Label
    fill(color.h, color.s, color.b + 40, alpha + 30);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(STYLE.TEXT_SIZE * 0.9);
    text("FIRE", button.x, button.y + button.radius + 25);
    
    pop();
  }
  
  _renderFireCooldown(button, alpha) {
    if (typeof player !== 'undefined' && player) {
      const cooldownProgress = Math.max(0, (millis() - this.lastFireTime) / MOBILE_CONFIG.TIMING.FIRE_COOLDOWN);
      if (cooldownProgress < 1) {
        stroke(60, 100, 100, 200);
        strokeWeight(MOBILE_CONFIG.STYLE.STROKE_WEIGHT + 2);
        noFill();
        arc(button.x, button.y, button.radius * 2.2, button.radius * 2.2, 
            -PI/2, -PI/2 + TWO_PI * cooldownProgress);
      }
    }
  }

  _renderDebugInfo() {
    if (typeof fill === 'function' && typeof text === 'function') {
      fill(255, 255, 255, 150);
      textAlign(LEFT, TOP);
      textSize(12);
      
      const activeButtons = [];
      if (this.buttonState.thrust) activeButtons.push('↑');
      if (this.buttonState.reverse) activeButtons.push('↓');
      if (this.buttonState.turnLeft) activeButtons.push('←');
      if (this.buttonState.turnRight) activeButtons.push('→');
      if (this.buttonState.fire) activeButtons.push('FIRE');
      
      const debugText = `Mobile: ${this.enabled ? 'ON' : 'OFF'} | Touches: ${this.touchTracker.size} | Active: ${activeButtons.join(' ')}`;
      text(debugText, 10, 10);
    }
  }
}

// ==================== GLOBAL INTERFACE ====================

let mobileControls;

function initMobileControls() {
  mobileControls = new MobileControls();
}

function handleMobileTouchStart(touches) {
  mobileControls?.handleTouchStart(touches);
}

function handleMobileTouchMove(touches) {
  mobileControls?.handleTouchMove(touches);
}

function handleMobileTouchEnd(touches) {
  mobileControls?.handleTouchEnd(touches);
}

function applyMobileMovement() {
  mobileControls?.applyMovement();
}

function renderMobileControls() {
  mobileControls?.render();
}

function isMobileControlsEnabled() {
  return mobileControls?.enabled ?? false;
}
