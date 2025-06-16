// Mobile and iPad Touch Controls for Submarine Game
// Only appears on mobile devices and tablets

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
    
    if (this.enabled) {
      this.initializeControls();
      console.log("Mobile controls enabled");
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
    
    // Update joystick position (bottom left)
    MOBILE_CONTROLS_CONFIG.joystick.y = height - 120;
    
    // Update fire button position (bottom right)
    MOBILE_CONTROLS_CONFIG.fireButton.x = width - 100;
    MOBILE_CONTROLS_CONFIG.fireButton.y = height - 120;
    
    // Update sonar button position (above fire button)
    MOBILE_CONTROLS_CONFIG.sonarButton.x = width - 100;
    MOBILE_CONTROLS_CONFIG.sonarButton.y = height - 220;
  }
  
  setupTouchEvents() {
    if (!this.enabled) return;
    
    console.log('Setting up touch events for mobile controls');
    
    // Prevent default touch behaviors that might interfere
    document.addEventListener('touchstart', (e) => {
      // During gameplay, only prevent default for control touches
      if (typeof gameState !== 'undefined' && gameState === 'playing') {
        if (this.isTouchOnControls(e.touches[0])) {
          e.preventDefault();
        }
      }
      // For other game states, we'll let the touch through to be handled by our touch handlers
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (this.joystickActive || this.fireButtonPressed || this.sonarButtonPressed) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
      if (this.joystickActive || this.fireButtonPressed || this.sonarButtonPressed) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Additional setup for iOS Safari to handle touch events properly
    document.body.style.touchAction = 'manipulation';
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
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      
      // Handle start screen and other non-gameplay screens - tap anywhere to continue
      if (typeof gameState !== 'undefined' && 
          (gameState === 'start' || gameState === 'levelComplete' || 
           gameState === 'gameOver' || gameState === 'gameComplete')) {
        
        console.log('Touch detected on non-gameplay screen, simulating ENTER key');
        
        // Simulate ENTER key press for non-gameplay screens
        if (typeof keyCode !== 'undefined' && typeof keyPressed === 'function') {
          // Set the global keyCode variable that p5.js uses
          window.keyCode = 13; // ENTER key code
          try {
            keyPressed(); // Call the keyPressed function
          } catch (e) {
            console.log('Error calling keyPressed:', e);
          }
        }
        return;
      }
      
      // Only handle control touches during gameplay
      if (typeof gameState === 'undefined' || gameState !== 'playing') {
        return;
      }
      
      // Check joystick
      if (this.isPointInJoystick(touchX, touchY)) {
        this.joystickActive = true;
        this.touches.set(touch.identifier, { type: 'joystick', x: touchX, y: touchY });
        this.updateJoystick(touchX, touchY);
        console.log('Joystick activated');
      }
      // Check fire button
      else if (this.isPointInFireButton(touchX, touchY)) {
        this.fireButtonPressed = true;
        this.touches.set(touch.identifier, { type: 'fire', x: touchX, y: touchY });
        this.handleFire();
        console.log('Fire button pressed');
      }
      // Check sonar button
      else if (MOBILE_CONTROLS_CONFIG.sonarButton.enabled && this.isPointInSonarButton(touchX, touchY)) {
        this.sonarButtonPressed = true;
        this.touches.set(touch.identifier, { type: 'sonar', x: touchX, y: touchY });
        this.handleSonar();
        console.log('Sonar button pressed');
      }
    }
  }
  
  handleTouchMove(touches) {
    if (!this.enabled) return;
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const storedTouch = this.touches.get(touch.identifier);
      
      if (storedTouch && storedTouch.type === 'joystick') {
        this.updateJoystick(touch.clientX, touch.clientY);
      }
    }
  }
  
  handleTouchEnd(touches) {
    if (!this.enabled) return;
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const storedTouch = this.touches.get(touch.identifier);
      
      if (storedTouch) {
        if (storedTouch.type === 'joystick') {
          this.joystickActive = false;
          this.joystickOffset = { x: 0, y: 0 };
          this.movementVector = { x: 0, y: 0 };
        } else if (storedTouch.type === 'fire') {
          this.fireButtonPressed = false;
        } else if (storedTouch.type === 'sonar') {
          this.sonarButtonPressed = false;
        }
        
        this.touches.delete(touch.identifier);
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
    if (currentTime - this.lastFireTime > 200) { // Minimum 200ms between shots to prevent spam
      this.lastFireTime = currentTime;
      
      // Trigger player shoot if player exists and game is playing
      if (typeof player !== 'undefined' && player && gameState === 'playing') {
        player.shoot();
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
    
    // Apply movement as velocity adjustments
    if (Math.abs(moveX) > 0.1) {
      // Horizontal movement affects turning
      player.angle += moveX * PLAYER_TURN_SPEED * 1.5; // Slightly faster turning for touch
    }
    
    if (moveY < -0.1) {
      // Forward movement (touch up)
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(PLAYER_THRUST_POWER * Math.abs(moveY)));
    } else if (moveY > 0.1) {
      // Backward movement (touch down)
      player.vel.add(p5.Vector.fromAngle(player.angle).mult(-PLAYER_THRUST_POWER * PLAYER_REVERSE_THRUST_FACTOR * moveY));
    }
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
  
  renderSonarButton() {
    const button = MOBILE_CONTROLS_CONFIG.sonarButton;
    const style = MOBILE_CONTROLS_CONFIG.style;
    
    push();
    
    // Main button
    const buttonAlpha = this.sonarButtonPressed ? style.pressedAlpha : style.innerAlpha;
    const buttonColor = this.sonarButtonPressed ? style.pressedColor : style.sonarButtonColor;
    
    strokeWeight(style.strokeWeight);
    stroke(buttonColor.h, buttonColor.s, buttonColor.b + 20, buttonAlpha);
    fill(buttonColor.h, buttonColor.s, buttonColor.b, buttonAlpha * 0.7);
    ellipse(button.x, button.y, button.radius * 2);
    
    // Sonar icon (concentric arcs)
    stroke(buttonColor.h, buttonColor.s, buttonColor.b + 30, buttonAlpha);
    strokeWeight(2);
    noFill();
    const iconSize = button.radius * 0.5;
    for (let i = 1; i <= 3; i++) {
      arc(button.x, button.y, iconSize * i * 0.6, iconSize * i * 0.6, 
          -PI/3, PI/3);
    }
    
    // Label
    fill(buttonColor.h, buttonColor.s, buttonColor.b + 40, buttonAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(style.textSize * 0.7);
    text("SONAR", button.x, button.y + button.radius + 15);
    
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
