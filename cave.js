// --- Cave Class ---
class Cave {
  constructor(worldWidth, worldHeight, cellSize) { // Accept cellSize as a parameter
    // Validate constructor parameters - use larger default world size
    if (isNaN(worldWidth) || worldWidth <= 0) worldWidth = 6000; // Increased from 4000
    if (isNaN(worldHeight) || worldHeight <= 0) worldHeight = 3000; // Increased from 2000
    if (isNaN(cellSize) || cellSize <= 0) cellSize = 20; // Slightly larger cells for better performance
    
    // Safety buffer for path carving - configurable for consistent tunnel widths
    this.pathSafetyBuffer = 4;
    
    this.worldWidth = worldWidth; this.worldHeight = worldHeight; this.cellSize = cellSize; // Use passed cellSize
    this.gridWidth = Math.ceil(worldWidth / this.cellSize); // Use this.cellSize
    this.gridHeight = Math.ceil(worldHeight / this.cellSize); // Use this.cellSize
    this.grid = []; this.exitPathY = 0; this.exitPathRadius = 0;
    this.goalPos = createVector(0,0);
    this.goalSize = GOAL_SQUARE_SIZE_CELLS * this.cellSize; // Use this.cellSize
    
    // Randomize goal direction (0=right, 1=bottom, 2=left, 3=top)
    this.goalDirection = floor(random(4));
    
    // Initialize exitX before cave generation (needed for validation)
    this.exitX = worldWidth - this.cellSize * CAVE_EXIT_X_OFFSET_CELLS; // Use this.cellSize
    
    this.generateCave();
    this.setRandomGoalPosition();
    
    // Calculate player start position AFTER goal position is finalized
    this.calculatePlayerStartPosition();
    
    // Validate and ensure connectivity between player start and goal
    this.ensurePlayerToGoalConnectivity();
  }
  
  calculatePlayerStartPosition() {
    const minDistanceFromGoal = 800; // Minimum distance to maintain consistency
    const maxDistanceFromGoal = 1000; // Maximum distance for variety
    const safeMargin = 100; // Margin from world edges
    
    // Use the actual final goal position (now that it's been set)
    let goalX = this.goalPos.x;
    let goalY = this.goalPos.y;
    
    console.log(`Goal position: (${goalX.toFixed(0)}, ${goalY.toFixed(0)}) - Direction: ${this.goalDirection}`);
    console.log(`World dimensions: ${this.worldWidth} x ${this.worldHeight}`);
    console.log(`Safe margin: ${safeMargin}`);
    
    let bestPlayerX = goalX;
    let bestPlayerY = goalY;
    let bestDistance = 0;
    let attempts = 0;
    const maxAttempts = 50;
    
    // Try multiple positions to find one that maintains good distance
    while (bestDistance < minDistanceFromGoal && attempts < maxAttempts) {
      let targetDistance = random(minDistanceFromGoal, maxDistanceFromGoal);
      let angle = random(TWO_PI);
      
      // Adjust angle based on goal direction to ensure player starts on opposite side
      switch(this.goalDirection) {
        case 0: // Goal on right - player should be towards left
          angle = random(PI/2, 3*PI/2); // 90° to 270° (left semicircle)
          break;
        case 1: // Goal on bottom - player should be towards top
          angle = random(PI, TWO_PI); // 180° to 360° (top semicircle)
          break;
        case 2: // Goal on left - player should be towards right
          angle = random(-PI/2, PI/2); // -90° to 90° (right semicircle)
          break;
        case 3: // Goal on top - player should be towards bottom
          angle = random(0, PI); // 0° to 180° (bottom semicircle)
          break;
      }
      
      // Calculate position at target distance and angle from goal
      let candidateX = goalX + cos(angle) * targetDistance;
      let candidateY = goalY + sin(angle) * targetDistance;
      
      // Check if this position is within bounds
      if (candidateX >= safeMargin && candidateX <= this.worldWidth - safeMargin &&
          candidateY >= safeMargin && candidateY <= this.worldHeight - safeMargin) {
        
        let actualDistance = dist(candidateX, candidateY, goalX, goalY);
        if (actualDistance > bestDistance) {
          bestPlayerX = candidateX;
          bestPlayerY = candidateY;
          bestDistance = actualDistance;
        }
        console.log(`Attempt ${attempts}: candidate (${candidateX.toFixed(0)}, ${candidateY.toFixed(0)}) distance: ${actualDistance.toFixed(0)}`);
      } else {
        console.log(`Attempt ${attempts}: candidate (${candidateX.toFixed(0)}, ${candidateY.toFixed(0)}) OUT OF BOUNDS`);
      }
      
      attempts++;
    }
    
    // If we couldn't find a good position, try a different approach
    if (bestDistance < minDistanceFromGoal) {
      console.warn(`Could not maintain minimum distance after ${maxAttempts} attempts, using fallback positioning`);
      
      // Fallback: place player at maximum possible distance in the opposite direction
      switch(this.goalDirection) {
        case 0: // Goal on right - place player on far left
          bestPlayerX = safeMargin;
          bestPlayerY = constrain(goalY, safeMargin, this.worldHeight - safeMargin);
          break;
        case 1: // Goal on bottom - place player at top
          bestPlayerX = constrain(goalX, safeMargin, this.worldWidth - safeMargin);
          bestPlayerY = safeMargin;
          break;
        case 2: // Goal on left - place player on far right
          bestPlayerX = this.worldWidth - safeMargin;
          bestPlayerY = constrain(goalY, safeMargin, this.worldHeight - safeMargin);
          break;
        case 3: // Goal on top - place player at bottom
          bestPlayerX = constrain(goalX, safeMargin, this.worldWidth - safeMargin);
          bestPlayerY = this.worldHeight - safeMargin;
          break;
      }
      bestDistance = dist(bestPlayerX, bestPlayerY, goalX, goalY);
    }
    
    this.playerStartX = bestPlayerX;
    this.playerStartY = bestPlayerY;
    
    // Debug log to verify distance
    console.log(`Player start: (${this.playerStartX.toFixed(0)}, ${this.playerStartY.toFixed(0)})`);
    console.log(`Final distance from reactor: ${bestDistance.toFixed(0)} units (target: ${minDistanceFromGoal}-${maxDistanceFromGoal})`);
  }
  
  setRandomGoalPosition() {
    // Ensure exitPathY is valid before setting goal position
    if (isNaN(this.exitPathY) || this.exitPathY === undefined || this.exitPathY === null) {
      this.exitPathY = this.gridHeight / 2;
      console.warn("exitPathY was invalid after cave generation, using grid center");
    }
    
    const offset = CAVE_EXIT_X_OFFSET_CELLS * this.cellSize;
    
    switch(this.goalDirection) {
      case 0: // Right side (original behavior)
        this.goalPos.x = this.exitX + this.goalSize / 2;
        this.goalPos.y = this.exitPathY * this.cellSize;
        break;
      case 1: // Bottom side
        this.goalPos.x = (this.gridWidth / 2) * this.cellSize; // Center horizontally
        this.goalPos.y = this.worldHeight - offset - this.goalSize / 2;
        break;
      case 2: // Left side
        this.goalPos.x = offset + this.goalSize / 2;
        this.goalPos.y = this.exitPathY * this.cellSize;
        break;
      case 3: // Top side
        this.goalPos.x = (this.gridWidth / 2) * this.cellSize; // Center horizontally
        this.goalPos.y = offset + this.goalSize / 2;
        break;
    }
  }
  generateCave() {
    for (let i = 0; i < this.gridWidth; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridHeight; j++) this.grid[i][j] = false; // Initialize as open space
    }
    let pathY = this.gridHeight / 2; let currentPathRadius = 0;
    let pathMinRadius = CAVE_PATH_MIN_RADIUS_CELLS; let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    
    // Store the main path for later validation
    let mainPath = [];
    
    noiseSeed(millis() + currentLevel * 1000); // Seed for consistent cave per level, varied by run
    for (let i = 0; i < this.gridWidth; i++) {
      pathY += (noise(i * CAVE_PATH_Y_NOISE_FACTOR_1, CAVE_PATH_Y_NOISE_OFFSET_1 + currentLevel) - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
      pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1); // Keep path within bounds
      currentPathRadius = map(noise(i * CAVE_PATH_RADIUS_NOISE_FACTOR, CAVE_PATH_RADIUS_NOISE_OFFSET + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
      
      // Store main path data for validation
      mainPath.push({x: i, y: pathY, radius: currentPathRadius});
      
      for (let j = 0; j < this.gridHeight; j++) {
        if (abs(j - pathY) > currentPathRadius) this.grid[i][j] = true; // Mark as wall
      }
      if (i === this.gridWidth - 1) { this.exitPathY = pathY; this.exitPathRadius = currentPathRadius; } // Store exit path details
    }
    
    // Add some random obstacles and clearings, but ensure main path remains clear
    for (let i = 1; i < this.gridWidth - 1; i++) {
      for (let j = 1; j < this.gridHeight - 1; j++) {
        if (!this.grid[i][j]) { // If it's currently open path
          // Only add obstacles if they don't block the guaranteed main path
          let pathPoint = mainPath[i];
          let minClearanceFromPath = (PLAYER_RADIUS / this.cellSize) + this.pathSafetyBuffer; // Ensure submarine can pass
          
          if (noise(i * CAVE_OBSTACLE_NOISE_FACTOR_1, j * CAVE_OBSTACLE_NOISE_FACTOR_1, CAVE_OBSTACLE_NOISE_OFFSET_1 + currentLevel) > CAVE_OBSTACLE_THRESHOLD_1 && 
              abs(j - pathPoint.y) > pathPoint.radius + CAVE_OBSTACLE_DIST_BUFFER_1 &&
              abs(j - pathPoint.y) > minClearanceFromPath) {
            this.grid[i][j] = true; // Add an obstacle
          }
        } else { // If it's currently a wall
          if (noise(i * CAVE_CLEARING_NOISE_FACTOR, j * CAVE_CLEARING_NOISE_FACTOR, CAVE_CLEARING_NOISE_OFFSET + currentLevel) < CAVE_CLEARING_THRESHOLD) {
            this.grid[i][j] = false; // Carve a clearing
          }
        }
      }
    }
    
    // Ensure the main path has guaranteed clearance for submarine passage
    this.ensureMainPathClearance(mainPath);
    
    // Find and connect all significant open spaces
    this.connectAllSignificantSpaces();
    
    // Ensure borders are walls
    for (let i = 0; i < this.gridWidth; i++) { this.grid[i][0] = true; this.grid[i][this.gridHeight - 1] = true; }
    for (let j = 0; j < this.gridHeight; j++) this.grid[0][j] = true;
    for (let j = 0; j < this.gridHeight; j++) {
      // Ensure exitPathY is valid before using it
      if (isNaN(this.exitPathY) || this.exitPathY === undefined || this.exitPathY === null) {
        this.exitPathY = this.gridHeight / 2;
        this.exitPathRadius = Math.max(CAVE_PATH_MIN_RADIUS_CELLS, 3);
        console.warn("exitPathY was invalid during border generation, using defaults");
      }
      if (abs(j - this.exitPathY) > this.exitPathRadius) this.grid[this.gridWidth - 1][j] = true;
      else this.grid[this.gridWidth - 1][j] = false;
    }
    
    // Ensure the goal area itself is not a wall in the grid, if it falls within the last column
    // This is more for logical consistency as direct drawing handles its appearance.
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

  // Ensure the main path has guaranteed clearance for submarine passage
  ensureMainPathClearance(mainPath) {
    let submarineRadiusInCells = PLAYER_RADIUS / this.cellSize;
    let requiredClearance = Math.ceil(submarineRadiusInCells) + this.pathSafetyBuffer; // Extra buffer for safety
    
    for (let pathPoint of mainPath) {
      let centerX = Math.round(pathPoint.x);
      let centerY = Math.round(pathPoint.y);
      
      // Ensure clearance around each path point
      for (let dx = -requiredClearance; dx <= requiredClearance; dx++) {
        for (let dy = -requiredClearance; dy <= requiredClearance; dy++) {
          let checkX = centerX + dx;
          let checkY = centerY + dy;
          
          // Check if this point is within the required clearance distance
          if (dist(0, 0, dx, dy) <= requiredClearance &&
              checkX >= 0 && checkX < this.gridWidth &&
              checkY >= 0 && checkY < this.gridHeight) {
            this.grid[checkX][checkY] = false; // Clear the space
          }
        }
      }
    }
  }

  // Find and connect all significant open spaces to ensure full exploration
  connectAllSignificantSpaces() {
    const MIN_SPACE_SIZE = 25; // Minimum cells for a "significant" space
    const SUBMARINE_RADIUS_CELLS = Math.ceil(PLAYER_RADIUS / this.cellSize);
    
    // Find all open space groups
    let visited = this.createVisitedGrid();
    let openSpaces = [];
    
    for (let i = 1; i < this.gridWidth - 1; i++) {
      for (let j = 1; j < this.gridHeight - 1; j++) {
        if (!this.grid[i][j] && !visited[i][j]) {
          let space = this.floodFillOpenSpace(i, j, visited);
          if (space.length >= MIN_SPACE_SIZE) {
            openSpaces.push(space);
          }
        }
      }
    }
    
    // Connect all significant spaces to the main path
    if (openSpaces.length > 1) {
      this.connectSpacesToMainPath(openSpaces);
    }
  }
  
  // Create a visited grid for flood fill operations
  createVisitedGrid() {
    let visited = [];
    for (let i = 0; i < this.gridWidth; i++) {
      visited[i] = [];
      for (let j = 0; j < this.gridHeight; j++) {
        visited[i][j] = false;
      }
    }
    return visited;
  }
  
  // Flood fill to find connected open space
  floodFillOpenSpace(startX, startY, visited) {
    let space = [];
    let queue = [{x: startX, y: startY}];
    visited[startX][startY] = true;
    
    while (queue.length > 0) {
      let current = queue.shift();
      space.push(current);
      
      // Check 4 directions (not diagonal for more natural spaces)
      const directions = [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}];
      
      for (let dir of directions) {
        let newX = current.x + dir.x;
        let newY = current.y + dir.y;
        
        if (newX >= 0 && newX < this.gridWidth && 
            newY >= 0 && newY < this.gridHeight &&
            !visited[newX][newY] && !this.grid[newX][newY]) {
          visited[newX][newY] = true;
          queue.push({x: newX, y: newY});
        }
      }
    }
    
    return space;
  }
  
  // Connect isolated spaces to the main path with organic tunnels
  connectSpacesToMainPath(openSpaces) {
    // Find the main path space (largest connected component containing the center)
    let mainSpaceIndex = this.findMainPathSpace(openSpaces);
    
    if (mainSpaceIndex === -1) return; // No main space found
    
    let mainSpace = openSpaces[mainSpaceIndex];
    
    // Connect all other spaces to the main space
    for (let i = 0; i < openSpaces.length; i++) {
      if (i !== mainSpaceIndex) {
        this.carveOrganicTunnel(openSpaces[i], mainSpace);
      }
    }
  }
  
  // Find the space that contains the main path
  findMainPathSpace(openSpaces) {
    let centerX = Math.floor(this.gridWidth / 4); // Near start area
    let centerY = Math.floor(this.gridHeight / 2);
    
    for (let i = 0; i < openSpaces.length; i++) {
      for (let cell of openSpaces[i]) {
        if (dist(cell.x, cell.y, centerX, centerY) < 10) {
          return i;
        }
      }
    }
    
    // If not found, return the largest space
    let largestIndex = 0;
    for (let i = 1; i < openSpaces.length; i++) {
      if (openSpaces[i].length > openSpaces[largestIndex].length) {
        largestIndex = i;
      }
    }
    
    return largestIndex;
  }
  
  // Carve an organic tunnel between two spaces
  carveOrganicTunnel(fromSpace, toSpace) {
    // Find closest points between the two spaces
    let minDist = Infinity;
    let startPoint = null;
    let endPoint = null;
    
    for (let fromCell of fromSpace) {
      for (let toCell of toSpace) {
        let d = dist(fromCell.x, fromCell.y, toCell.x, toCell.y);
        if (d < minDist) {
          minDist = d;
          startPoint = fromCell;
          endPoint = toCell;
        }
      }
    }
    
    if (!startPoint || !endPoint) return;
    
    // Carve organic path using noise-based curve
    this.carveNoisyPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  }
  
  // Carve a noisy, organic-looking path between two points
  carveNoisyPath(x1, y1, x2, y2) {
    let steps = Math.floor(dist(x1, y1, x2, y2)) + 5;
    let tunnelWidth = Math.ceil(PLAYER_RADIUS / this.cellSize) + this.pathSafetyBuffer;
    
    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      
      // Base interpolation
      let baseX = lerp(x1, x2, t);
      let baseY = lerp(y1, y2, t);
      
      // Add organic noise to the path
      let noiseScale = 0.1;
      let noiseAmplitude = 3;
      let offsetX = (noise(baseX * noiseScale, baseY * noiseScale, 100) - 0.5) * noiseAmplitude;
      let offsetY = (noise(baseX * noiseScale, baseY * noiseScale, 200) - 0.5) * noiseAmplitude;
      
      let currentX = Math.round(baseX + offsetX);
      let currentY = Math.round(baseY + offsetY);
      
      // Carve tunnel with appropriate width
      for (let dx = -tunnelWidth; dx <= tunnelWidth; dx++) {
        for (let dy = -tunnelWidth; dy <= tunnelWidth; dy++) {
          if (dist(0, 0, dx, dy) <= tunnelWidth) {
            let carveX = currentX + dx;
            let carveY = currentY + dy;
            
            if (carveX >= 1 && carveX < this.gridWidth - 1 &&
                carveY >= 1 && carveY < this.gridHeight - 1) {
              this.grid[carveX][carveY] = false;
            }
          }
        }
      }
    }
  }

  isWall(worldX, worldY, objectRadius = 0) {
    // Check for goal square collision first for sonar detection (not for player passage)
    // This is a simplified check; sonar will treat it as a distinct object.
    // For actual player collision with walls, the grid check below is primary.

    if (worldX < 0 || worldX >= this.worldWidth || worldY < 0 || worldY >= this.worldHeight) return true; // Out of bounds is a wall
    const checks = CAVE_WALL_CHECK_POINTS;
    for (let i = 0; i < checks; i++) {
      const angle = (TWO_PI / checks) * i;
      const checkX = worldX + cos(angle) * objectRadius; const checkY = worldY + sin(angle) * objectRadius;
      let gridX = floor(checkX / this.cellSize); let gridY = floor(checkY / this.cellSize);
      gridX = constrain(gridX, 0, this.gridWidth - 1); gridY = constrain(gridY, 0, this.gridHeight - 1);
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
  
  // Destroy cave blocks in a radius around the impact point
  destroyBlocks(worldX, worldY, radius = 30) {
    // Convert world coordinates to grid coordinates
    let centerGridX = Math.floor(worldX / this.cellSize);
    let centerGridY = Math.floor(worldY / this.cellSize);
    
    // Calculate grid radius
    let gridRadius = Math.ceil(radius / this.cellSize);
    
    // Destroy blocks in a circular area
    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      for (let dy = -gridRadius; dy <= gridRadius; dy++) {
        let gridX = centerGridX + dx;
        let gridY = centerGridY + dy;
        
        // Check if within bounds
        if (gridX >= 1 && gridX < this.gridWidth - 1 && 
            gridY >= 1 && gridY < this.gridHeight - 1) {
          
          // Check if within circular radius
          let distance = Math.sqrt(dx * dx + dy * dy) * this.cellSize;
          if (distance <= radius) {
            // Destroy the block (set to false = open space)
            this.grid[gridX][gridY] = false;
          }
        }
      }
    }
  }
  
  ensurePlayerToGoalConnectivity() {
    if (!this.playerStartX || !this.playerStartY || !this.goalPos) {
      console.warn('Cannot validate connectivity: missing player start or goal positions');
      return;
    }
    
    // Use goalPos for the goal coordinates
    const goalX = this.goalPos.x;
    const goalY = this.goalPos.y;
    
    // Convert pixel positions to grid coordinates
    const startCellX = Math.floor(this.playerStartX / this.cellSize);
    const startCellY = Math.floor(this.playerStartY / this.cellSize);
    const goalCellX = Math.floor(goalX / this.cellSize);
    const goalCellY = Math.floor(goalY / this.cellSize);
    
    console.log(`Validating path from player (${startCellX}, ${startCellY}) to goal (${goalCellX}, ${goalCellY})`);
    console.log(`Player start area: ${this.grid[startCellX][startCellY] ? 'BLOCKED' : 'CLEAR'}`);
    console.log(`Goal area: ${this.grid[goalCellX][goalCellY] ? 'BLOCKED' : 'CLEAR'}`);
    
    // Ensure player start area is clear with a larger radius
    this.carveArea(startCellX, startCellY, 4);
    
    // Ensure goal area is clear
    this.carveArea(goalCellX, goalCellY, 3);
    
    console.log(`After carving - Player start area: ${this.grid[startCellX][startCellY] ? 'BLOCKED' : 'CLEAR'}`);
    console.log(`After carving - Goal area: ${this.grid[goalCellX][goalCellY] ? 'BLOCKED' : 'CLEAR'}`);
    
    // Perform pathfinding to check connectivity
    if (!this.isPathConnected(startCellX, startCellY, goalCellX, goalCellY)) {
      console.log('No path found between player and goal - carving direct path');
      this.carveDirectPath(startCellX, startCellY, goalCellX, goalCellY);
      
      // Double-check connectivity after carving
      if (!this.isPathConnected(startCellX, startCellY, goalCellX, goalCellY)) {
        console.warn('Still no path after carving - trying wider path');
        this.carveDirectPath(startCellX, startCellY, goalCellX, goalCellY, 4); // Wider path
        
        // Final check
        if (!this.isPathConnected(startCellX, startCellY, goalCellX, goalCellY)) {
          console.error('CRITICAL: Cannot establish path even after multiple attempts!');
        } else {
          console.log('Path established with wider carving');
        }
      } else {
        console.log('Path established after initial carving');
      }
    } else {
      console.log('Path connectivity validated successfully');
    }
  }

  isPathConnected(startX, startY, goalX, goalY) {
    const visited = new Set();
    const queue = [{x: startX, y: startY}];
    
    while (queue.length > 0) {
      const {x, y} = queue.shift();
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      // Check if we reached the goal
      if (x === goalX && y === goalY) {
        return true;
      }
      
      // Add valid neighbors
      const directions = [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}];
      for (const dir of directions) {
        const newX = x + dir.x;
        const newY = y + dir.y;
        
        if (newX >= 0 && newX < this.gridWidth && 
            newY >= 0 && newY < this.gridHeight && 
            this.grid[newX][newY] === false) { // false = open space
          queue.push({x: newX, y: newY});
        }
      }
    }
    
    return false;
  }

  carveDirectPath(startX, startY, goalX, goalY, radius = 2) {
    // Simple direct line carving using Bresenham-like algorithm
    let x0 = startX, y0 = startY;
    const x1 = goalX, y1 = goalY;
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    
    while (true) {
      // Carve out the current position and surrounding area
      this.carveArea(x0, y0, radius);
      
      if (x0 === x1 && y0 === y1) break;
      
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    
    console.log(`Direct path carved between player start and goal with radius ${radius}`);
  }

  carveArea(centerX, centerY, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;
        
        if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= radius) {
            this.grid[x][y] = false; // Make it open space
          }
        }
      }
    }
  }

  // Getter methods for external access to positions
  getPlayerStartPosition() {
    return {
      x: this.playerStartX,
      y: this.playerStartY
    };
  }

  getGoalPosition() {
    return {
      x: this.goalPos.x,
      y: this.goalPos.y
    };
  }
}