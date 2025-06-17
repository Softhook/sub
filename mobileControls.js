// Mobile and iPad Touch Controls for Submarine Game
// Direct movement controls: Up moves up, Right moves right, etc.
// Refactored for better organization and maintainability

// Mobile Controls Configuration
const MOBILE_CONTROLS_CONFIG = {
  // Joystick settings
  joystick: {
    x: 120,           // Position from left edge
    y: null,          // Will be set to screen height - 120
    outerRadius: 80,  // Outer circle radius
    innerRadius: 25,  // Inner knob radius
    maxDistance: 55,  // Maximum distance inner can move from center
    sensitivity: 0.8, // Movement sensitivity multiplier
  },
  
  // Fire button settings
  fireButton: {
    x: null,          // Will be set to screen width - 100
    y: null,          // Will be set to screen height - 120
    radius: 60,       // Button radius
    cooldownDisplay: true, // Show cooldown indicator
  },
  
  // Sonar button (optional - sonar is automatic but manual trigger can be useful)
  sonarButton: {
    x: null,          // Will be set to screen width - 100
    y: null,          // Will be set to screen height - 220
    radius: 45,       // Smaller than fire button
    enabled: false,   // Disabled by default since sonar is automatic
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
    fireButtonColor: { h: 0, s: 80, b: 85 },
    sonarButtonColor: { h: 120, s: 70, b: 80 },
    pressedColor: { h: 60, s: 90, b: 95 },
  },

  // Smooth rotation settings
  // Eliminates jittery submarine movement when changing joystick direction
  smoothRotation: {
    enabled: true,              // Enable/disable smooth rotation
    lerpSpeed: 0.15,           // How fast to rotate toward target (0.1 = slow, 0.3 = fast)
    movementThreshold: 0.4,    // Minimum movement magnitude to trigger rotation (higher = less sensitive)
    stabilityFrames: 8,        // Frames required for stable movement before changing target (higher = less jittery)
    angleTolerance: 0.3,       // Radians tolerance for movement stability (≈17 degrees, higher = more forgiving)
  }
};

class MobileControls {
  constructor() {
    this.enabled = this.isMobileDevice();
    this.touches = new Map(); // Track multiple touches
    this.joystickActive = false;
    this.joystickOffset = { x: 0, y: 0 };
    this.fireButtonPressed = false;
    this.sonarButtonPressed = false;
    this.lastFireTime = 0;
    this.lastSonarTime = 0;
    
    // Movement state
    this.movementVector = { x: 0, y: 0 };
    
    // Smooth rotation properties
    this.targetAngle = 0;
    this.lastMovementAngle = 0;
    this.angleLerpSpeed = MOBILE_CONTROLS_CONFIG.smoothRotation.lerpSpeed;
    this.movementThreshold = MOBILE_CONTROLS_CONFIG.smoothRotation.movementThreshold;
    this.angleStabilityFrames = 0;
    this.requiredStabilityFrames = MOBILE_CONTROLS_CONFIG.smoothRotation.stabilityFrames;
    this.angleTolerance = MOBILE_CONTROLS_CONFIG.smoothRotation.angleTolerance;
    
    if (this.enabled) {
      this.initializeControls();
      console.log("Mobile controls enabled");
    }
  }
  
  isMobileDevice() {
    // Detect mobile devices and tablets
    const userAgent = navigator.userAgent.toLowerCase();
    const patterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check for specific mobile/tablet patterns
    const isMobile = patterns.test(userAgent);
    
    // Enhanced iPad detection for modern iPadOS
    const isIPad = /ipad/i.test(userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
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
    
    // Get canvas dimensions
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    console.log('Updating mobile control positions. Canvas size:', canvasWidth, 'x', canvasHeight);
    
    // Update joystick position (bottom left)
    MOBILE_CONTROLS_CONFIG.joystick.y = canvasHeight - 120;
    
    // Update fire button position (bottom right)
    MOBILE_CONTROLS_CONFIG.fireButton.x = canvasWidth - 100;
    MOBILE_CONTROLS_CONFIG.fireButton.y = canvasHeight - 120;
    
    // Update sonar button position (above fire button)
    MOBILE_CONTROLS_CONFIG.sonarButton.x = canvasWidth - 100;
    MOBILE_CONTROLS_CONFIG.sonarButton.y = canvasHeight - 220;
    
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
      if (this.joystickActive || this.fireButtonPressed || this.sonarButtonPressed) {
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
           this.isPointInFireButton(touchX, touchY) ||
           (MOBILE_CONTROLS_CONFIG.sonarButton.enabled && this.isPointInSonarButton(touchX, touchY));
  }

  handleTouchStart(touches) {
    if (!this.enabled) return;
    
    console.log('Touch start detected, touches:', touches.length);
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      
      // p5.js touch events have x and y properties directly
      let touchX, touchY;
      
      if (touch.x !== undefined && touch.y !== undefined) {
        // p5.js touch object - coordinates are already in canvas space
        touchX = touch.x;
        touchY = touch.y;
      } else if (touch.clientX !== undefined && touch.clientY !== undefined) {
        // Fallback to client coordinates
        touchX = touch.clientX;
        touchY = touch.clientY;
      } else {
        console.log('Touch object missing coordinates:', touch);
        continue;
      }
      
      console.log(`Touch ${i}: x=${touchX}, y=${touchY}, identifier=${touch.identifier}`);
      console.log('Game state:', typeof gameState !== 'undefined' ? gameState : 'undefined');
      
      // Update positions to ensure they're current
      this.updatePositions();
      
      // Handle start screen and other non-gameplay screens - tap anywhere to continue
      if (typeof gameState !== 'undefined' && 
          (gameState === 'start' || gameState === 'levelComplete' || 
           gameState === 'gameOver' || gameState === 'gameComplete')) {
        
        console.log('Touch detected on non-gameplay screen, simulating ENTER key');
        
        // Simulate ENTER key press for non-gameplay screens
        if (typeof keyPressed === 'function') {
          // Set the global keyCode variable that p5.js uses
          // Try both window.keyCode and global keyCode for compatibility
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
        return;
      }
      
      // Only handle control touches during gameplay
      if (typeof gameState === 'undefined' || gameState !== 'playing') {
        console.log('Not in playing state, ignoring touch');
        return;
      }
      
      console.log('Checking control positions:');
      console.log('Joystick at:', MOBILE_CONTROLS_CONFIG.joystick.x, MOBILE_CONTROLS_CONFIG.joystick.y);
      console.log('Fire button at:', MOBILE_CONTROLS_CONFIG.fireButton.x, MOBILE_CONTROLS_CONFIG.fireButton.y);
      
      // Check joystick
      if (this.isPointInJoystick(touchX, touchY)) {
        console.log('Joystick touch detected! Touch at:', touchX, touchY, 'Joystick at:', MOBILE_CONTROLS_CONFIG.joystick.x, MOBILE_CONTROLS_CONFIG.joystick.y);
        
        // Initialize smooth rotation when joystick becomes active
        if (!this.joystickActive && typeof player !== 'undefined' && player) {
          this.targetAngle = player.angle; // Start with current submarine angle
          this.lastMovementAngle = player.angle;
          this.angleStabilityFrames = 0;
        }
        
        this.joystickActive = true;
        const touchId = touch.identifier !== undefined ? touch.identifier : i;
        this.touches.set(touchId, { type: 'joystick', x: touchX, y: touchY });
        this.updateJoystick(touchX, touchY);
      }
      // Check fire button
      else if (this.isPointInFireButton(touchX, touchY)) {
        console.log('Fire button touch detected! Touch at:', touchX, touchY, 'Fire button at:', MOBILE_CONTROLS_CONFIG.fireButton.x, MOBILE_CONTROLS_CONFIG.fireButton.y);
        this.fireButtonPressed = true;
        const touchId = touch.identifier !== undefined ? touch.identifier : i;
        this.touches.set(touchId, { type: 'fire', x: touchX, y: touchY });
        this.handleFire();
      }
      // Check sonar button
      else if (MOBILE_CONTROLS_CONFIG.sonarButton.enabled && this.isPointInSonarButton(touchX, touchY)) {
        console.log('Sonar button touch detected!');
        this.sonarButtonPressed = true;
        const touchId = touch.identifier !== undefined ? touch.identifier : i;
        this.touches.set(touchId, { type: 'sonar', x: touchX, y: touchY });
        this.handleSonar();
      } else {
        console.log('Touch not on any control - touch at:', touchX, touchY);
        console.log('Joystick bounds check:', 
          'Distance to joystick center:', 
          Math.sqrt(Math.pow(touchX - MOBILE_CONTROLS_CONFIG.joystick.x, 2) + Math.pow(touchY - MOBILE_CONTROLS_CONFIG.joystick.y, 2)),
          'vs joystick radius:', MOBILE_CONTROLS_CONFIG.joystick.outerRadius);
        console.log('Fire button bounds check:', 
          'Distance to fire button center:', 
          Math.sqrt(Math.pow(touchX - MOBILE_CONTROLS_CONFIG.fireButton.x, 2) + Math.pow(touchY - MOBILE_CONTROLS_CONFIG.fireButton.y, 2)),
          'vs fire button radius:', MOBILE_CONTROLS_CONFIG.fireButton.radius);
      }
    }
  }

  handleTouchMove(touches) {
    if (!this.enabled) return;
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchId = touch.identifier !== undefined ? touch.identifier : i;
      const storedTouch = this.touches.get(touchId);
      
      if (storedTouch && storedTouch.type === 'joystick') {
        // Get touch coordinates
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
        
        this.updateJoystick(touchX, touchY);
      }
    }
  }

  handleTouchEnd(touches) {
    if (!this.enabled) return;
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchId = touch.identifier !== undefined ? touch.identifier : i;
      const storedTouch = this.touches.get(touchId);
      
      if (storedTouch) {
        if (storedTouch.type === 'joystick') {
          this.joystickActive = false;
          this.joystickOffset = { x: 0, y: 0 };
          this.movementVector = { x: 0, y: 0 };
          // Reset rotation state when joystick is released
          this.angleStabilityFrames = 0;
        } else if (storedTouch.type === 'fire') {
          this.fireButtonPressed = false;
        } else if (storedTouch.type === 'sonar') {
          this.sonarButtonPressed = false;
        }
        
        this.touches.delete(touchId);
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
  
  isPointInSonarButton(x, y) {
    const button = MOBILE_CONTROLS_CONFIG.sonarButton;
    const distance = Math.sqrt(Math.pow(x - button.x, 2) + Math.pow(y - button.y, 2));
    return distance <= button.radius;
  }
  
  // Apply movement to player
  applyMovement() {
    if (!this.enabled || !this.joystickActive) return;
    if (typeof player === 'undefined' || !player || gameState !== 'playing') return;
    
    const sensitivity = MOBILE_CONTROLS_CONFIG.joystick.sensitivity;
    const moveX = this.movementVector.x * sensitivity;
    const moveY = this.movementVector.y * sensitivity;
    
    // Apply direct movement (joystick-style)
    // Horizontal movement: left/right moves the submarine left/right
    if (Math.abs(moveX) > 0.1) {
      player.vel.x += moveX * PLAYER_THRUST_POWER;
    }
    
    // Vertical movement: up/down moves the submarine up/down
    if (Math.abs(moveY) > 0.1) {
      player.vel.y += moveY * PLAYER_THRUST_POWER;
    }
    
    // Update submarine facing direction based on joystick input
    if (MOBILE_CONTROLS_CONFIG.smoothRotation.enabled) {
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
    } else {
      // Original immediate rotation (for comparison/fallback)
      const movementMagnitude = Math.sqrt(moveX * moveX + moveY * moveY);
      if (movementMagnitude > 0.2) {
        const targetAngle = Math.atan2(moveY, moveX);
        if (typeof player !== 'undefined' && player) {
          player.angle = targetAngle;
        }
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
    if (!this.enabled) return;
    
    // Only show controls during gameplay
    if (typeof gameState === 'undefined' || gameState !== 'playing') {
      return;
    }
    
    // Update positions in case of screen size changes
    this.updatePositions();
    
    // Draw joystick
    this.renderJoystick();
    
    // Draw fire button
    this.renderFireButton();
    
    // Draw sonar button if enabled
    if (MOBILE_CONTROLS_CONFIG.sonarButton.enabled) {
      this.renderSonarButton();
    }
    
    // Add debug info at top of screen
    if (typeof fill === 'function' && typeof text === 'function') {
      fill(255, 255, 255, 150);
      textAlign(LEFT, TOP);
      textSize(12);
      
      const angleInfo = (typeof player !== 'undefined' && player) ? 
        ` | Angle: ${(player.angle * 180 / Math.PI).toFixed(0)}°` : '';
      const targetInfo = this.joystickActive ? 
        ` | Target: ${(this.targetAngle * 180 / Math.PI).toFixed(0)}°` : '';
      const stabilityInfo = this.joystickActive ? 
        ` | Stability: ${this.angleStabilityFrames}/${this.requiredStabilityFrames}` : '';
      const moveInfo = this.joystickActive ? 
        ` | Move: ${this.movementVector.x.toFixed(2)},${this.movementVector.y.toFixed(2)}` : '';
      
      // Add fire cooldown info using actual player shot timing
      const canFire = typeof player !== 'undefined' && player && 
                     frameCount - player.lastShotTime >= player.shotCooldown;
      const frameRemaining = typeof player !== 'undefined' && player ? 
                           Math.max(0, player.shotCooldown - (frameCount - player.lastShotTime)) : 0;
      const cooldownInfo = !canFire ? 
                         ` | Cooldown: ${frameRemaining} frames` : 
                         ' | Ready to Fire!';
      
      text(`Mobile: ${this.enabled ? 'ON' : 'OFF'} | Touch: ${this.joystickActive ? 'JOY' : ''}${this.fireButtonPressed ? 'FIRE' : ''}${angleInfo}${targetInfo}${stabilityInfo}${moveInfo}${cooldownInfo}`, 10, 10);
    }
  }
  
  renderJoystick() {
    const joystick = MOBILE_CONTROLS_CONFIG.joystick;
    const style = MOBILE_CONTROLS_CONFIG.style;
    
    push();
    
    // Outer circle - make it more visible
    strokeWeight(style.strokeWeight + 1);
    stroke(style.joystickColor.h, style.joystickColor.s, style.joystickColor.b, style.outerAlpha + 50);
    fill(style.joystickColor.h, style.joystickColor.s, style.joystickColor.b, style.outerAlpha * 0.5);
    ellipse(joystick.x, joystick.y, joystick.outerRadius * 2);
    
    // Inner knob - more prominent when active
    const knobX = joystick.x + this.joystickOffset.x;
    const knobY = joystick.y + this.joystickOffset.y;
    const knobAlpha = this.joystickActive ? style.pressedAlpha : style.innerAlpha;
    const knobColor = this.joystickActive ? style.pressedColor : style.joystickKnobColor;
    
    fill(knobColor.h, knobColor.s, knobColor.b, knobAlpha);
    stroke(knobColor.h, knobColor.s, knobColor.b + 20, knobAlpha);
    strokeWeight(style.strokeWeight);
    ellipse(knobX, knobY, joystick.innerRadius * 2);
    
    // Direction indicator lines - more visible
    if (this.joystickActive) {
      stroke(knobColor.h, knobColor.s, knobColor.b + 30, knobAlpha);
      strokeWeight(style.strokeWeight + 1);
      line(joystick.x, joystick.y, knobX, knobY);
    }
    
    pop();
  }
  
  renderFireButton() {
    const button = MOBILE_CONTROLS_CONFIG.fireButton;
    const style = MOBILE_CONTROLS_CONFIG.style;
    const isPressed = this.fireButtonPressed;
    
    push();
    
    // Determine if player can fire based on cooldown
    const canFire = typeof player !== 'undefined' && 
                    player && 
                    frameCount - player.lastShotTime >= player.shotCooldown;
    
    // Use red when ready to fire, orange/yellow when in cooldown
    const baseColor = canFire ? 
      { h: 0, s: 90, b: 85 } :           // Red when ready to fire
      { h: 30, s: 70, b: 80 };           // Orange when in cooldown
    
    const color = isPressed ? style.pressedColor : baseColor;
    const alpha = isPressed ? style.pressedAlpha + 50 : style.innerAlpha + 30;
    
    strokeWeight(style.strokeWeight + 1);
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
    this.renderFireCooldown(button, alpha);
    
    // Label
    fill(color.h, color.s, color.b + 40, alpha + 30);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(style.textSize * 0.9);
    text("FIRE", button.x, button.y + button.radius + 25);
    
    pop();
  }

  renderSonarButton() {
    if (!MOBILE_CONTROLS_CONFIG.sonarButton.enabled) return;
    
    const button = MOBILE_CONTROLS_CONFIG.sonarButton;
    const style = MOBILE_CONTROLS_CONFIG.style;
    const isPressed = this.sonarButtonPressed;
    
    push();
    
    const alpha = isPressed ? style.pressedAlpha : style.innerAlpha;
    const color = isPressed ? style.pressedColor : style.sonarButtonColor;
    
    strokeWeight(style.strokeWeight);
    stroke(color.h, color.s, color.b, alpha);
    fill(color.h, color.s, color.b, alpha * 0.7);
    ellipse(button.x, button.y, button.radius * 2);
    
    // Sonar icon (concentric circles)
    noFill();
    stroke(color.h, color.s, color.b + 20, alpha);
    strokeWeight(style.strokeWeight - 1);
    ellipse(button.x, button.y, button.radius * 0.6);
    ellipse(button.x, button.y, button.radius * 0.9);
    
    // Label
    fill(color.h, color.s, color.b + 30, alpha + 20);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(style.textSize * 0.8);
    text("SONAR", button.x, button.y + button.radius + 20);
    
    pop();
  }

  renderFireCooldown(button, alpha) {
    if (typeof player !== 'undefined' && player) {
      // Use the actual player shot cooldown for timing consistency
      const shotCooldownFrames = player.shotCooldown;
      const framesSinceLastShot = frameCount - player.lastShotTime;
      const cooldownRatio = 1 - Math.min(1, framesSinceLastShot / shotCooldownFrames);
      
      // Change button color based on whether we can fire
      if (framesSinceLastShot >= shotCooldownFrames) {
        // Ready to fire - Red button (more saturated)
        stroke(0, 100, 90, 220); // Bright red outline to indicate ready
        strokeWeight(MOBILE_CONTROLS_CONFIG.style.strokeWeight + 1);
        noFill();
        ellipse(button.x, button.y, button.radius * 2.1, button.radius * 2.1); 
      } else {
        // Still in cooldown - show yellow/orange cooldown arc
        stroke(40, 100, 90, 220); // Yellow/orange color to show "not ready"
        strokeWeight(MOBILE_CONTROLS_CONFIG.style.strokeWeight + 2);
        noFill();
        
        // Draw arc from top, going clockwise, showing remaining cooldown time
        arc(button.x, button.y, button.radius * 2.2, button.radius * 2.2, 
            -PI/2, -PI/2 + TWO_PI * cooldownRatio);
      }
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
