// Mobile and iPad Touch Controls for Submarine Game
// Direct movement controls: Up moves up, Right moves right, etc.
// Refactored for better organization and maintainability

// Mobile Controls Configuration
const MOBILE_CONTROLS_CONFIG = {
  // Joystick settings
  joystick: {
    x: 120,           // Position from left edge
    y: null,          // Will be set to screen height - 150
    outerRadius: 100, // Made larger
    deadZoneRadius: 50, // New: inner ring for dead zone
    innerRadius: 30,  // Knob radius, made larger
    maxDistance: 70,  // outerRadius - innerRadius
    sensitivity: 1.0, // Using 1.0 for more direct control
  },
  
  // Fire button settings
  fireButton: {
    x: null,          // Will be set to screen width - 120
    y: null,          // Will be set to screen height - 150
    radius: 60,       // Button radius
    cooldownDisplay: true, // Show cooldown indicator
  },

  // Visual styling
  style: {
    strokeWeight: 3,
    outerAlpha: 120,  // Transparency for outer elements
    innerAlpha: 180,  // Transparency for inner elements
    pressedAlpha: 220, // Transparency when pressed
    textSize: 16,
    
    // Colors (HSB values to match game's color scheme)
    joystickColor: { h: 180, s: 50, b: 70 },
    joystickKnobColor: { h: 180, s: 70, b: 90 },
    fireButtonColor: { h: 50, s: 90, b: 90 }, // Yellow for fire button
    pressedColor: { h: 60, s: 90, b: 95 },
  },

  // Smooth rotation settings
  // Eliminates jittery submarine movement when changing joystick direction
  smoothRotation: {
    enabled: true,              // Enable/disable smooth rotation
    lerpSpeed: 0.15,           // How fast to rotate toward target (0.1 = slow, 0.3 = fast)
    movementThreshold: 0.01,    // Minimum movement magnitude to trigger rotation. Set low for responsive rotation.
    stabilityFrames: 8,        // Frames required for stable movement before changing target (higher = less jittery)
    angleTolerance: 0.3,       // Radians tolerance for movement stability (≈17 degrees, higher = more forgiving)
  }
};

class MobileControls {
  constructor() {
    // Device and state initialization
    this.enabled = this.detectMobileDevice();
    this.initializeControlState();
    this.initializeMovementState();
    this.initializeSmoothRotation();
    
    if (this.enabled) {
      this.initializeControls();
      console.log("Mobile controls enabled");
    }
  }
  
  initializeControlState() {
    this.touches = new Map();
    this.joystickActive = false;
    this.joystickOffset = { x: 0, y: 0 };
    this.fireButtonPressed = false;
    this.lastFireTime = 0;
    this.lastSonarTime = 0;
  }
  
  initializeMovementState() {
    this.movementVector = { x: 0, y: 0 };
  }
  
  initializeSmoothRotation() {
    const config = MOBILE_CONTROLS_CONFIG.smoothRotation;
    this.targetAngle = 0;
    this.lastMovementAngle = 0;
    this.angleLerpSpeed = config.lerpSpeed;
    this.movementThreshold = config.movementThreshold;
    this.angleStabilityFrames = 0;
    this.requiredStabilityFrames = config.stabilityFrames;
    this.angleTolerance = config.angleTolerance;
  }
  
  detectMobileDevice() {
    const deviceInfo = this.getDeviceInfo();
    const detectionResults = this.performDeviceDetection(deviceInfo);
    
    this.logDeviceDetection(deviceInfo, detectionResults);
    
    return detectionResults.isMobile || detectionResults.isIPad || 
           detectionResults.isProbablyIPad || detectionResults.isTouchTablet;
  }
  
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent.toLowerCase(),
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      screenSize: Math.max(window.screen.width, window.screen.height),
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints
    };
  }
  
  performDeviceDetection(deviceInfo) {
    const patterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    
    return {
      isMobile: patterns.test(deviceInfo.userAgent),
      isIPad: /ipad/i.test(deviceInfo.userAgent) || 
              (deviceInfo.platform === 'MacIntel' && deviceInfo.maxTouchPoints > 1),
      isProbablyIPad: deviceInfo.platform === 'MacIntel' && 
                      deviceInfo.maxTouchPoints > 1 && 
                      !window.MSStream,
      isTouchTablet: deviceInfo.hasTouch && 
                     deviceInfo.screenSize >= 768 && 
                     deviceInfo.screenSize <= 1366
    };
  }
  
  logDeviceDetection(deviceInfo, results) {
    console.log('Device detection:', {
      userAgent: deviceInfo.userAgent,
      isMobile: results.isMobile,
      hasTouch: deviceInfo.hasTouch,
      isIPad: results.isIPad,
      isProbablyIPad: results.isProbablyIPad,
      screenSize: deviceInfo.screenSize,
      isTabletSize: results.isTouchTablet,
      platform: deviceInfo.platform,
      maxTouchPoints: deviceInfo.maxTouchPoints
    });
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
    
    // Get canvas dimensions
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    console.log('Updating mobile control positions. Canvas size:', canvasWidth, 'x', canvasHeight);
    
    // Update joystick position (bottom left)
    MOBILE_CONTROLS_CONFIG.joystick.y = canvasHeight - 150;
    
    // Update fire button position (bottom right)
    MOBILE_CONTROLS_CONFIG.fireButton.x = canvasWidth - 120;
    MOBILE_CONTROLS_CONFIG.fireButton.y = canvasHeight - 150;
    
    console.log('Control positions updated:', {
      joystick: { x: MOBILE_CONTROLS_CONFIG.joystick.x, y: MOBILE_CONTROLS_CONFIG.joystick.y },
      fireButton: { x: MOBILE_CONTROLS_CONFIG.fireButton.x, y: MOBILE_CONTROLS_CONFIG.fireButton.y }
    });
  }
  
  setupTouchEvents() {
    if (!this.enabled) return;
    
    console.log('Setting up touch events for mobile controls');
    
    // Minimal touch event setup - let p5.js handle most of it
    // Only prevent default when absolutely necessary
    document.addEventListener('touchmove', (e) => {
      // Only prevent scrolling if we're actively using controls
      if (this.joystickActive || this.fireButtonPressed) {
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
    
    console.log('Touch events setup complete');
  }
  
  isTouchOnControls(touch) {
    if (!touch) return false;
    
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Check if touch is on any control element
    return this.isPointInJoystick(touchX, touchY) ||
           this.isPointInFireButton(touchX, touchY);
  }

  handleTouchStart(touches) {
    if (!this.enabled) return;
    
    console.log('Touch start detected, touches:', touches.length);
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const coordinates = this.extractTouchCoordinates(touch);
      
      if (!coordinates) {
        console.log('Touch object missing coordinates:', touch);
        continue;
      }
      
      console.log(`Touch ${i}: x=${coordinates.x}, y=${coordinates.y}, identifier=${touch.identifier}`);
      
      // Handle non-gameplay screen touches
      if (this.handleNonGameplayTouch()) {
        return;
      }
      
      // Only handle control touches during gameplay
      if (!this.isInPlayingState()) {
        console.log('Not in playing state, ignoring touch');
        return;
      }
      
      this.updatePositions();
      this.processControlTouch(touch, coordinates);
    }
  }
  
  extractTouchCoordinates(touch) {
    // p5.js touch events have x and y properties directly
    if (touch.x !== undefined && touch.y !== undefined) {
      // p5.js touch object - coordinates are already in canvas space
      return { x: touch.x, y: touch.y };
    } else if (touch.clientX !== undefined && touch.clientY !== undefined) {
      // Fallback to client coordinates
      return { x: touch.clientX, y: touch.clientY };
    }
    return null;
  }
  
  handleNonGameplayTouch() {
    console.log('Game state:', typeof gameState !== 'undefined' ? gameState : 'undefined');
    
    // Handle start screen and other non-gameplay screens - tap anywhere to continue
    if (typeof gameState !== 'undefined' && 
        this.isNonGameplayState(gameState)) {
      
      console.log('Touch detected on non-gameplay screen, simulating ENTER key');
      this.simulateEnterKey();
      return true;
    }
    return false;
  }
  
  isNonGameplayState(state) {
    return state === 'start' || state === 'highScores' || 
           state === 'levelComplete' || state === 'gameOver' || 
           state === 'gameComplete';
  }
  
  simulateEnterKey() {
    if (typeof keyPressed === 'function') {
      // Set the global keyCode variable that p5.js uses
      const originalKeyCode = typeof keyCode !== 'undefined' ? keyCode : null;
      const originalWindowKeyCode = window.keyCode;
      
      keyCode = 13; // ENTER key code
      window.keyCode = 13;
      
      try {
        keyPressed(); // Call the keyPressed function
        console.log('Successfully triggered keyPressed for mobile tap-to-restart');
      } catch (e) {
        console.log('Error calling keyPressed:', e);
      }
      
      // Restore original values
      if (originalKeyCode !== null) keyCode = originalKeyCode;
      if (originalWindowKeyCode !== undefined) window.keyCode = originalWindowKeyCode;
    }
  }
  
  isInPlayingState() {
    return typeof gameState !== 'undefined' && gameState === 'playing';
  }
  
  processControlTouch(touch, coordinates) {
    console.log('Checking control positions:');
    console.log('Joystick at:', MOBILE_CONTROLS_CONFIG.joystick.x, MOBILE_CONTROLS_CONFIG.joystick.y);
    console.log('Fire button at:', MOBILE_CONTROLS_CONFIG.fireButton.x, MOBILE_CONTROLS_CONFIG.fireButton.y);
    
    const { x: touchX, y: touchY } = coordinates;
    
    if (this.isPointInJoystick(touchX, touchY)) {
      this.handleJoystickTouch(touch, touchX, touchY);
    } else if (this.isPointInFireButton(touchX, touchY)) {
      this.handleFireButtonTouch(touch, touchX, touchY);
    } else {
      this.logMissedTouch(touchX, touchY);
    }
  }
  
  handleJoystickTouch(touch, touchX, touchY) {
    console.log('Joystick touch detected! Touch at:', touchX, touchY, 
                'Joystick at:', MOBILE_CONTROLS_CONFIG.joystick.x, MOBILE_CONTROLS_CONFIG.joystick.y);
    
    // Initialize smooth rotation when joystick becomes active
    if (!this.joystickActive && typeof player !== 'undefined' && player) {
      this.targetAngle = player.angle; // Start with current submarine angle
      this.lastMovementAngle = player.angle;
      this.angleStabilityFrames = 0;
    }
    
    this.joystickActive = true;
    const touchId = touch.id; // Use p5.js touch id
    this.touches.set(touchId, { type: 'joystick', x: touchX, y: touchY });
    this.updateJoystick(touchX, touchY);
  }
  
  handleFireButtonTouch(touch, touchX, touchY) {
    console.log('Fire button touch detected! Touch at:', touchX, touchY, 
                'Fire button at:', MOBILE_CONTROLS_CONFIG.fireButton.x, MOBILE_CONTROLS_CONFIG.fireButton.y);
    this.fireButtonPressed = true;
    const touchId = touch.id; // Use p5.js touch id
    this.touches.set(touchId, { type: 'fire', x: touchX, y: touchY });
    this.handleFire();
  }
  
  logMissedTouch(touchX, touchY) {
    console.log('Touch not on any control - touch at:', touchX, touchY);
    console.log('Joystick bounds check:', 
      'Distance to joystick center:', 
      Math.sqrt(Math.pow(touchX - MOBILE_CONTROLS_CONFIG.joystick.x, 2) + 
                Math.pow(touchY - MOBILE_CONTROLS_CONFIG.joystick.y, 2)),
      'vs joystick radius:', MOBILE_CONTROLS_CONFIG.joystick.outerRadius);
    console.log('Fire button bounds check:', 
      'Distance to fire button center:', 
      Math.sqrt(Math.pow(touchX - MOBILE_CONTROLS_CONFIG.fireButton.x, 2) + 
                Math.pow(touchY - MOBILE_CONTROLS_CONFIG.fireButton.y, 2)),
      'vs fire button radius:', MOBILE_CONTROLS_CONFIG.fireButton.radius);
  }

  handleTouchMove(touches) {
    if (!this.enabled) return;
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchId = touch.id; // Use p5.js touch id
      const storedTouch = this.touches.get(touchId);
      
      if (storedTouch && storedTouch.type === 'joystick') {
        const coordinates = this.extractTouchCoordinates(touch);
        if (coordinates) {
          this.updateJoystick(coordinates.x, coordinates.y);
        }
      }
    }
  }

  handleTouchEnd(p5Touches) {
    if (!this.enabled) return;

    const remainingTouchIds = new Set();
    // The p5Touches argument is an array of the touches that are STILL on the screen
    for (const touch of p5Touches) {
        remainingTouchIds.add(touch.id);
    }

    // Find which of our tracked touches are no longer on the screen
    const liftedTouchIds = [];
    for (const trackedId of this.touches.keys()) {
        if (!remainingTouchIds.has(trackedId)) {
            liftedTouchIds.push(trackedId);
        }
    }

    // Process the lifted touches
    for (const liftedId of liftedTouchIds) {
        const storedTouch = this.touches.get(liftedId);
        if (storedTouch) {
            if (storedTouch.type === 'joystick') {
                this.joystickActive = false;
                this.joystickOffset = { x: 0, y: 0 };
                this.movementVector = { x: 0, y: 0 };
                // Reset rotation state when joystick is released
                this.angleStabilityFrames = 0;
            } else if (storedTouch.type === 'fire') {
                this.fireButtonPressed = false;
            }
            
            // Stop tracking this touch
            this.touches.delete(liftedId);
        }
    }
  }
  
  updateJoystick(touchX, touchY) {
    const joystick = MOBILE_CONTROLS_CONFIG.joystick;
    const centerX = joystick.x;
    const centerY = joystick.y;
    
    // Calculate offset from center
    let offsetX = touchX - centerX;
    let offsetY = touchY - centerY;
    
    // Limit to maximum distance
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    if (distance > joystick.maxDistance) {
      offsetX = (offsetX / distance) * joystick.maxDistance;
      offsetY = (offsetY / distance) * joystick.maxDistance;
    }
    
    this.joystickOffset = { x: offsetX, y: offsetY };
    
    // Convert to movement vector (-1 to 1 range)
    this.movementVector = {
      x: offsetX / joystick.maxDistance,
      y: offsetY / joystick.maxDistance
    };
  }
  
  handleFire() {
    const currentTime = millis();
    
    // Only attempt to shoot if player exists
    if (typeof player !== 'undefined' && player && gameState === 'playing') {
      // Use the actual player shot cooldown frames for consistency
      // At 60fps, this is approximately 1167ms but works regardless of framerate
      if (frameCount - player.lastShotTime >= player.shotCooldown) {
        player.shoot();
        this.lastFireTime = currentTime; // Store when we last successfully fired
      }
    }
  }
  
  handleSonar() {
    const currentTime = millis();
    if (currentTime - this.lastSonarTime > 500) { // Minimum 500ms between sonar pulses
      this.lastSonarTime = currentTime;
      
      // Trigger manual sonar if player exists and game is playing
      if (typeof player !== 'undefined' && player && gameState === 'playing') {
        player.fireSonar(cave, enemies, jellyfish);
      }
    }
  }
  
  // Collision detection methods
  isPointInJoystick(x, y) {
    const joystick = MOBILE_CONTROLS_CONFIG.joystick;
    const distance = Math.sqrt(Math.pow(x - joystick.x, 2) + Math.pow(y - joystick.y, 2));
    return distance <= joystick.outerRadius;
  }
  
  isPointInFireButton(x, y) {
    const button = MOBILE_CONTROLS_CONFIG.fireButton;
    const distance = Math.sqrt(Math.pow(x - button.x, 2) + Math.pow(y - button.y, 2));
    return distance <= button.radius;
  }
  
  // Apply movement to player
  applyMovement() {
    if (!this.canApplyMovement()) return;

    const joystick = MOBILE_CONTROLS_CONFIG.joystick;
    const sensitivity = joystick.sensitivity;
    const moveX = this.movementVector.x * sensitivity;
    const moveY = this.movementVector.y * sensitivity;

    // Apply movement and rotation
    this.applyPhysicalMovement(moveX, moveY, joystick);
    this.applyRotation(moveX, moveY);
  }
  
  canApplyMovement() {
    return this.enabled && this.joystickActive && 
           typeof player !== 'undefined' && player && 
           gameState === 'playing';
  }
  
  applyPhysicalMovement(moveX, moveY, joystick) {
    // --- MOVEMENT LOGIC ---
    const knobDistance = Math.sqrt(this.joystickOffset.x**2 + this.joystickOffset.y**2);
    if (knobDistance > joystick.deadZoneRadius) {
        // We are outside the dead zone.
        // Scale the movement based on distance from deadzone.
        const movementZoneSize = joystick.maxDistance - joystick.deadZoneRadius;
        const distanceIntoZone = knobDistance - joystick.deadZoneRadius;
        const thrustScale = Math.min(1.0, distanceIntoZone / movementZoneSize);

        const finalMoveX = moveX * thrustScale;
        const finalMoveY = moveY * thrustScale;

        if (Math.abs(finalMoveX) > 0.01) {
            player.vel.x += finalMoveX * PLAYER_THRUST_POWER;
        }
        if (Math.abs(finalMoveY) > 0.01) {
            player.vel.y += finalMoveY * PLAYER_THRUST_POWER;
        }
    }
  }
  
  applyRotation(moveX, moveY) {
    // --- ROTATION LOGIC ---
    // This part will now run regardless of whether movement is applied.
    // It depends on moveX/moveY which are calculated from the raw joystick vector,
    // which is what we want for rotation.
    if (MOBILE_CONTROLS_CONFIG.smoothRotation.enabled) {
      this.applySmoothRotation(moveX, moveY);
    } else {
      this.applyImmediateRotation(moveX, moveY);
    }
  }
  
  applySmoothRotation(moveX, moveY) {
    // Use smooth rotation with stability checking to reduce jitter
    const movementMagnitude = Math.sqrt(moveX * moveX + moveY * moveY);
    
    if (movementMagnitude > this.movementThreshold) {
      const currentMovementAngle = Math.atan2(moveY, moveX);
      
      // Check if the movement direction is stable (not changing rapidly)
      const angleDifference = this.getAngleDifference(currentMovementAngle, this.lastMovementAngle);
      
      if (Math.abs(angleDifference) < this.angleTolerance) {
        this.angleStabilityFrames++;
      } else {
        this.angleStabilityFrames = 0; // Reset if direction changed significantly
      }
      
      // Only update target angle if movement has been stable for enough frames
      if (this.angleStabilityFrames >= this.requiredStabilityFrames) {
        this.targetAngle = currentMovementAngle;
      }
      
      this.lastMovementAngle = currentMovementAngle;
      
      // Smoothly interpolate toward target angle
      if (typeof player !== 'undefined' && player) {
        player.angle = this.lerpAngle(player.angle, this.targetAngle, this.angleLerpSpeed);
      }
    } else {
      // Reset stability when not moving
      this.angleStabilityFrames = 0;
    }
  }
  
  applyImmediateRotation(moveX, moveY) {
    // Original immediate rotation (for comparison/fallback)
    const movementMagnitude = Math.sqrt(moveX * moveX + moveY * moveY);
    if (movementMagnitude > 0.01) { // Use a small threshold to avoid issues with atan2(0,0)
      const targetAngle = Math.atan2(moveY, moveX);
      if (typeof player !== 'undefined' && player) {
        player.angle = targetAngle;
      }
    }
  }
  
  // Helper function to calculate the shortest angular difference between two angles
  getAngleDifference(angle1, angle2) {
    let diff = angle1 - angle2;
    // Normalize to [-PI, PI] range
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return diff;
  }
  
  // Smooth angle interpolation that handles wrapping around PI/-PI
  lerpAngle(currentAngle, targetAngle, lerpFactor) {
    const angleDiff = this.getAngleDifference(targetAngle, currentAngle);
    return currentAngle + angleDiff * lerpFactor;
  }
  
  // Render the mobile controls
  render() {
    if (!this.shouldRenderControls()) return;
    
    // Update positions in case of screen size changes
    this.updatePositions();
    
    // Draw controls
    this.renderJoystick();
    this.renderFireButton();
  }
  
  shouldRenderControls() {
    // Only show controls during gameplay on enabled devices
    return this.enabled && 
           typeof gameState !== 'undefined' && 
           gameState === 'playing';
  }
  
  renderJoystick() {
    const joystick = MOBILE_CONTROLS_CONFIG.joystick;
    const style = MOBILE_CONTROLS_CONFIG.style;
    
    push();
    
    // Draw joystick components
    this.drawJoystickOuter(joystick, style);
    this.drawJoystickDeadZone(joystick, style);
    this.drawJoystickKnob(joystick, style);
    this.drawJoystickDirection(joystick, style);
    
    pop();
  }
  
  drawJoystickOuter(joystick, style) {
    // Outer circle - make it more visible
    strokeWeight(style.strokeWeight + 1);
    stroke(style.joystickColor.h, style.joystickColor.s, style.joystickColor.b, style.outerAlpha + 50);
    fill(style.joystickColor.h, style.joystickColor.s, style.joystickColor.b, style.outerAlpha * 0.5);
    ellipse(joystick.x, joystick.y, joystick.outerRadius * 2);
  }
  
  drawJoystickDeadZone(joystick, style) {
    // Dead zone inner circle
    stroke(style.joystickColor.h, style.joystickColor.s, style.joystickColor.b, style.outerAlpha);
    strokeWeight(style.strokeWeight - 1); // Thinner line
    noFill();
    ellipse(joystick.x, joystick.y, joystick.deadZoneRadius * 2);
  }
  
  drawJoystickKnob(joystick, style) {
    // Inner knob - more prominent when active
    const knobX = joystick.x + this.joystickOffset.x;
    const knobY = joystick.y + this.joystickOffset.y;
    const knobAlpha = this.joystickActive ? style.pressedAlpha : style.innerAlpha;
    const knobColor = this.joystickActive ? style.pressedColor : style.joystickKnobColor;
    
    fill(knobColor.h, knobColor.s, knobColor.b, knobAlpha);
    stroke(knobColor.h, knobColor.s, knobColor.b + 20, knobAlpha);
    strokeWeight(style.strokeWeight);
    ellipse(knobX, knobY, joystick.innerRadius * 2);
  }
  
  drawJoystickDirection(joystick, style) {
    // Direction indicator lines - more visible
    if (this.joystickActive) {
      const knobX = joystick.x + this.joystickOffset.x;
      const knobY = joystick.y + this.joystickOffset.y;
      const knobColor = style.pressedColor;
      const knobAlpha = style.pressedAlpha;
      
      stroke(knobColor.h, knobColor.s, knobColor.b + 30, knobAlpha);
      strokeWeight(style.strokeWeight + 1);
      line(joystick.x, joystick.y, knobX, knobY);
    }
  }
  
  renderFireButton() {
    const button = MOBILE_CONTROLS_CONFIG.fireButton;
    const style = MOBILE_CONTROLS_CONFIG.style;
    
    push();
    
    // Draw fire button components
    this.drawFireButtonBase(button, style);
    this.drawFireButtonIcon(button, style);
    this.renderFireCooldown(button, this.getFireButtonAlpha(style));
    
    pop();
  }
  
  drawFireButtonBase(button, style) {
    const isPressed = this.fireButtonPressed;
    const baseColor = style.fireButtonColor;
    const color = isPressed ? style.pressedColor : baseColor;
    const alpha = this.getFireButtonAlpha(style);
    
    strokeWeight(style.strokeWeight + 1);
    stroke(color.h, color.s, color.b + 20, alpha);
    fill(color.h, color.s, color.b, alpha * 0.8);
    ellipse(button.x, button.y, button.radius * 2);
  }
  
  drawFireButtonIcon(button, style) {
    const isPressed = this.fireButtonPressed;
    const baseColor = style.fireButtonColor;
    const color = isPressed ? style.pressedColor : baseColor;
    const alpha = this.getFireButtonAlpha(style);
    
    // Fire icon (triangle)
    fill(color.h, color.s, color.b + 30, alpha + 50);
    noStroke();
    const iconSize = button.radius * 0.5;
    triangle(
      button.x + iconSize * 0.8, button.y,
      button.x - iconSize * 0.4, button.y - iconSize * 0.6,
      button.x - iconSize * 0.4, button.y + iconSize * 0.6
    );
  }
  
  getFireButtonAlpha(style) {
    const isPressed = this.fireButtonPressed;
    return isPressed ? style.pressedAlpha + 50 : style.innerAlpha + 30;
  }

  renderFireCooldown(button, alpha) {
    if (typeof player !== 'undefined' && player) {
      // Use the actual player shot cooldown for timing consistency
      const shotCooldownFrames = player.shotCooldown;
      const framesSinceLastShot = frameCount - player.lastShotTime;
      const cooldownRatio = 1 - Math.min(1, framesSinceLastShot / shotCooldownFrames);

      // Only draw the arc if there's a cooldown in effect
      if (cooldownRatio > 0) {
        stroke(50, 100, 90, 220); // Bright yellow color for the arc
        strokeWeight(MOBILE_CONTROLS_CONFIG.style.strokeWeight + 2);
        noFill();
        
        // Draw arc from top, going clockwise
        arc(button.x, button.y, button.radius * 2.2, button.radius * 2.2, 
            -PI/2, -PI/2 + TWO_PI * cooldownRatio);
      }
    }
  }
  
  // ==================== UTILITY METHODS ====================
  
  isValidPlayer() {
    return typeof player !== 'undefined' && player;
  }
  
  isValidGameState() {
    return typeof gameState !== 'undefined';
  }
  
  getCurrentTime() {
    return typeof millis !== 'undefined' ? millis() : Date.now();
  }
  
  getCurrentFrameCount() {
    return typeof frameCount !== 'undefined' ? frameCount : 0;
  }
  
  // Distance calculation helper
  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  
  // Clamp value between min and max
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  
  // ==================== CONFIGURATION HELPERS ====================
  
  getJoystickConfig() {
    return MOBILE_CONTROLS_CONFIG.joystick;
  }
  
  getFireButtonConfig() {
    return MOBILE_CONTROLS_CONFIG.fireButton;
  }
  
  getStyleConfig() {
    return MOBILE_CONTROLS_CONFIG.style;
  }
  
  getSmoothRotationConfig() {
    return MOBILE_CONTROLS_CONFIG.smoothRotation;
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
