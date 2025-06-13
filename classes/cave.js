// --- Cave Class ---
class Cave {
  constructor(worldWidth, worldHeight, cellSize) { // Accept cellSize as a parameter
    this.worldWidth = worldWidth; 
    this.worldHeight = worldHeight; 
    this.cellSize = cellSize; // Use passed cellSize
    this.gridWidth = Math.ceil(worldWidth / this.cellSize); // Use this.cellSize
    this.gridHeight = Math.ceil(worldHeight / this.cellSize); // Use this.cellSize
    this.grid = []; 
    this.exitPathY = 0; 
    this.exitPathRadius = 0;
    this.goalPos = createVector(0,0);
    this.goalSize = GOAL_SQUARE_SIZE_CELLS * this.cellSize; // Use this.cellSize
    this.generateCave();
    this.exitX = worldWidth - this.cellSize * CAVE_EXIT_X_OFFSET_CELLS; // Use this.cellSize
    this.goalPos.x = this.exitX + this.goalSize / 2;
    this.goalPos.y = this.exitPathY * this.cellSize; // Use this.cellSize
  }

  generateCave() {
    for (let i = 0; i < this.gridWidth; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridHeight; j++) this.grid[i][j] = false; // Initialize as open space
    }
    let pathY = this.gridHeight / 2; 
    let currentPathRadius = 0;
    let pathMinRadius = CAVE_PATH_MIN_RADIUS_CELLS; 
    let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    noiseSeed(millis() + currentLevel * 1000); // Seed for consistent cave per level, varied by run
    for (let i = 0; i < this.gridWidth; i++) {
      pathY += (noise(i * CAVE_PATH_Y_NOISE_FACTOR_1, CAVE_PATH_Y_NOISE_OFFSET_1 + currentLevel) - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
      pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1); // Keep path within bounds
      currentPathRadius = map(noise(i * CAVE_PATH_RADIUS_NOISE_FACTOR, CAVE_PATH_RADIUS_NOISE_OFFSET + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
      for (let j = 0; j < this.gridHeight; j++) {
        if (abs(j - pathY) > currentPathRadius) this.grid[i][j] = true; // Mark as wall
      }
      if (i === this.gridWidth - 1) { 
        this.exitPathY = pathY; 
        this.exitPathRadius = currentPathRadius; 
      } // Store exit path details
    }

    // Add some random obstacles and clearings
    for (let i = 1; i < this.gridWidth - 1; i++) {
      for (let j = 1; j < this.gridHeight - 1; j++) {
        if (!this.grid[i][j]) { // If it's currently open path
          if (noise(i * CAVE_OBSTACLE_NOISE_FACTOR_1, j * CAVE_OBSTACLE_NOISE_FACTOR_1, CAVE_OBSTACLE_NOISE_OFFSET_1 + currentLevel) > CAVE_OBSTACLE_THRESHOLD_1 && dist(i, j, i, pathY) > currentPathRadius + CAVE_OBSTACLE_DIST_BUFFER_1) {
            this.grid[i][j] = true; // Add an obstacle
          }
        } else { // If it's currently a wall
          if (noise(i * CAVE_CLEARING_NOISE_FACTOR, j * CAVE_CLEARING_NOISE_FACTOR, CAVE_CLEARING_NOISE_OFFSET + currentLevel) < CAVE_CLEARING_THRESHOLD) {
            this.grid[i][j] = false; // Carve a clearing
          }
        }
      }
    }

    // Ensure borders are walls
    for (let i = 0; i < this.gridWidth; i++) { 
      this.grid[i][0] = true; 
      this.grid[i][this.gridHeight - 1] = true; 
    }
    for (let j = 0; j < this.gridHeight; j++) this.grid[0][j] = true;
    for (let j = 0; j < this.gridHeight; j++) {
      if (abs(j - this.exitPathY) > this.exitPathRadius) this.grid[this.gridWidth - 1][j] = true;
      else this.grid[this.gridWidth - 1][j] = false;
    }

    // Ensure the goal area itself is not a wall in the grid, if it falls within the last column
    let goalGridMinX = floor((this.goalPos.x - this.goalSize / 2) / this.cellSize);
    let goalGridMaxX = floor((this.goalPos.x + this.goalSize / 2) / this.cellSize);
    let goalGridMinY = floor((this.goalPos.y - this.goalSize / 2) / this.cellSize);
    let goalGridMaxY = floor((this.goalPos.y + this.goalSize / 2) / this.cellSize);

    for (let i = goalGridMinX; i <= goalGridMaxX; i++) {
      for (let j = goalGridMinY; j <= goalGridMaxY; j++) {
        if (i >= 0 && i < this.gridWidth && j >= 0 && j < this.gridHeight) {
          // Check if this part of the goal is within the last column where exit path is defined
          if (i === this.gridWidth - 1) {
             // Only clear if it's part of the intended open exit path area
             if (abs(j - this.exitPathY) <= this.exitPathRadius) {
                this.grid[i][j] = false; 
             }
          } else if (i > this.gridWidth - CAVE_EXIT_X_OFFSET_CELLS) {
            // For parts of the goal square that might extend beyond the last column but are in the exit zone
            this.grid[i][j] = false;
          }
        }
      }
    }
  }

  isWall(worldX, worldY, objectRadius = 0) {
    if (worldX < 0 || worldX >= this.worldWidth || worldY < 0 || worldY >= this.worldHeight) return true; // Out of bounds is a wall
    const checks = CAVE_WALL_CHECK_POINTS;
    for (let i = 0; i < checks; i++) {
      const angle = (TWO_PI / checks) * i;
      const checkX = worldX + cos(angle) * objectRadius; 
      const checkY = worldY + sin(angle) * objectRadius;
      let gridX = floor(checkX / this.cellSize); 
      let gridY = floor(checkY / this.cellSize);
      gridX = constrain(gridX, 0, this.gridWidth - 1); 
      gridY = constrain(gridY, 0, this.gridHeight - 1);
      if (this.grid[gridX] && this.grid[gridX][gridY]) return true;
    }
    return false;
  }

  // New method to check if a point is within the goal square
  isGoal(worldX, worldY) {
    return worldX >= this.goalPos.x - this.goalSize / 2 &&
           worldX <= this.goalPos.x + this.goalSize / 2 &&
           worldY >= this.goalPos.y - this.goalSize / 2 &&
           worldY <= this.goalPos.y + this.goalSize / 2;
  }

  // New method to render the goal square
  renderGoal(offsetX, offsetY) {
    push();
    fill(GOAL_SQUARE_VISUAL_COLOR_H, GOAL_SQUARE_VISUAL_COLOR_S, GOAL_SQUARE_VISUAL_COLOR_B);
    noStroke();
    rectMode(CENTER);
    rect(this.goalPos.x - offsetX, this.goalPos.y - offsetY, this.goalSize, this.goalSize);

    // Draw nuclear symbol
    let cx = this.goalPos.x - offsetX;
    let cy = this.goalPos.y - offsetY;
    
    fill(0); // Black for the symbol
    noStroke();

    const overallSymbolRadius = this.goalSize * 0.40; // Overall radius of the symbol
    const centerDiscRadius = overallSymbolRadius * 0.22; // Radius of the central filled circle
    // Adjusted bladeInnerRadius to create a gap around the center circle
    const bladeInnerRadius = centerDiscRadius * 1.35; // Blades start further out from the center circle
    const bladeOuterRadius = overallSymbolRadius;  // Blades extend to the full symbol radius
    const bladeSweepAngle = PI / 3; // Each blade is 60 degrees wide (PI/3 radians)
    const angleStep = PI / 30; // Step for drawing arc segments (6 degrees per step)

    // Center solid circle
    ellipse(cx, cy, centerDiscRadius * 2, centerDiscRadius * 2);

    // 3 blades
    for (let i = 0; i < 3; i++) {
      push();
      translate(cx, cy); // Move origin to the center of the symbol
      
      // Calculate the central angle for this blade.
      // Standard orientation: blades centered at 90 (PI/2), 210 (7PI/6), 330 (11PI/6) degrees.
      let bladeCenterRotation = (PI / 2) + (i * TWO_PI / 3);
      rotate(bladeCenterRotation);

      // Define the blade shape symmetrically around the (new) positive X-axis.
      // It will span from -30 degrees to +30 degrees relative to the rotated X-axis.
      let startAng = -bladeSweepAngle / 2;
      let endAng = bladeSweepAngle / 2;
      
      beginShape();
      // Outer arc vertices (drawn from startAng to endAng)
      for (let a = startAng; a <= endAng; a += angleStep) {
        vertex(cos(a) * bladeOuterRadius, sin(a) * bladeOuterRadius);
      }
      // Ensure the final point of the outer arc is at endAng
      vertex(cos(endAng) * bladeOuterRadius, sin(endAng) * bladeOuterRadius);

      // Inner arc vertices (drawn from endAng back to startAng)
      for (let a = endAng; a >= startAng; a -= angleStep) {
         vertex(cos(a) * bladeInnerRadius, sin(a) * bladeInnerRadius);
      }
      // Ensure the final point of the inner arc (which is the start point) is at startAng
      vertex(cos(startAng) * bladeInnerRadius, sin(startAng) * bladeInnerRadius);
      endShape(CLOSE); // Close the shape to form a filled segment

      pop(); // Restore previous transformation state
    }
    pop(); // Matches the initial push() at the start of renderGoal
  }
}
