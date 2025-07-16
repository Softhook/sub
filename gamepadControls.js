// --- GamepadControls.js ---
// Support for gamepad/controller input

// Configuration constants for gamepad
const GAMEPAD_CONFIG = {
  // Analog stick sensitivity and dead zones
  leftStickDeadZone: 0.15,
  rightStickDeadZone: 0.15,
  stickSensitivity: 1.0,
  
  // Button mappings (based on standard gamepad layout)
  buttons: {
    fire: 0,       // A/X button
    sonar: 1,      // B/Circle button
    forward: 12,   // DPad up
    reverse: 13,   // DPad down
    turnLeft: 14,  // DPad left
    turnRight: 15, // DPad right
    pause: 9       // Start button
  }
};

// Variables to track gamepad state
let gamepads = {};
let gamepadConnected = false;

// Event listeners for gamepad connection/disconnection
window.addEventListener("gamepadconnected", (e) => {
  console.log("Gamepad connected:", e.gamepad.id);
  gamepads[e.gamepad.index] = e.gamepad;
  gamepadConnected = true;
});

window.addEventListener("gamepaddisconnected", (e) => {
  console.log("Gamepad disconnected:", e.gamepad.id);
  delete gamepads[e.gamepad.index];
  if (Object.keys(gamepads).length === 0) {
    gamepadConnected = false;
  }
});

// Update input states from gamepad
function updateGamepadInput() {
  if (!gamepadConnected) return;
  
  // Get the current state of all gamepads
  const gamepadsArray = navigator.getGamepads ? navigator.getGamepads() : [];
  
  // Use the first connected gamepad
  let gamepad = null;
  for (let i = 0; i < gamepadsArray.length; i++) {
    if (gamepadsArray[i] && gamepadsArray[i].connected) {
      gamepad = gamepadsArray[i];
      break;
    }
  }
  
  if (!gamepad) return;
  
  // Handle analog sticks
  // Left stick for movement
  const leftX = applyDeadZone(gamepad.axes[0], GAMEPAD_CONFIG.leftStickDeadZone);
  const leftY = applyDeadZone(gamepad.axes[1], GAMEPAD_CONFIG.leftStickDeadZone);
  
  // Use left stick for movement
  if (Math.abs(leftX) > 0) {
    // Turn left/right
    if (leftX < 0) {
      keys.left = true;
      keys.right = false;
    } else {
      keys.left = false;
      keys.right = true;
    }
  } else {
    // Reset turning if stick is centered
    keys.left = false;
    keys.right = false;
  }
  
  if (Math.abs(leftY) > 0) {
    // Forward/reverse
    if (leftY < 0) {
      keys.up = true;
      keys.down = false;
    } else {
      keys.up = false;
      keys.down = true;
    }
  } else {
    // Reset movement if stick is centered
    keys.up = false;
    keys.down = false;
  }
  
  // Handle buttons
  // D-pad controls
  keys.up = keys.up || gamepad.buttons[GAMEPAD_CONFIG.buttons.forward].pressed;
  keys.down = keys.down || gamepad.buttons[GAMEPAD_CONFIG.buttons.reverse].pressed;
  keys.left = keys.left || gamepad.buttons[GAMEPAD_CONFIG.buttons.turnLeft].pressed;
  keys.right = keys.right || gamepad.buttons[GAMEPAD_CONFIG.buttons.turnRight].pressed;
  
  // Action buttons
  if (gamepad.buttons[GAMEPAD_CONFIG.buttons.fire].pressed && !keys.space) {
    keys.space = true;
    spaceWasPressed = true;  // Flag for one-time actions
  } else if (!gamepad.buttons[GAMEPAD_CONFIG.buttons.fire].pressed) {
    keys.space = false;
  }
  
  if (gamepad.buttons[GAMEPAD_CONFIG.buttons.sonar].pressed && !keys.shift) {
    keys.shift = true;
    shiftWasPressed = true;  // Flag for one-time actions
  } else if (!gamepad.buttons[GAMEPAD_CONFIG.buttons.sonar].pressed) {
    keys.shift = false;
  }
  
  // Pause/Menu button
  if (gamepad.buttons[GAMEPAD_CONFIG.buttons.pause].pressed && !escWasPressed) {
    escWasPressed = true;
    handleEscKey();  // Call the same function as keyboard Esc
  } else if (!gamepad.buttons[GAMEPAD_CONFIG.buttons.pause].pressed) {
    escWasPressed = false;
  }
}

// Helper function to apply dead zone to analog sticks
function applyDeadZone(value, deadZone) {
  if (Math.abs(value) < deadZone) {
    return 0;
  }
  
  // Adjust the range to go from 0 to 1 after deadzone
  return value > 0 
    ? (value - deadZone) / (1 - deadZone) 
    : (value + deadZone) / (1 - deadZone);
}
