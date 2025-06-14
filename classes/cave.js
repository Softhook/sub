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

    // Find and connect isolated chambers to the main path
    this.connectIsolatedChambers();

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

  // Check if a world coordinate is on the main navigable path from player to goal
  isOnMainPath(worldX, worldY, tolerance = 0) {
    if (worldX < 0 || worldX >= this.worldWidth || worldY < 0 || worldY >= this.worldHeight) return false;
    
    let gridX = floor(worldX / this.cellSize);
    gridX = constrain(gridX, 0, this.gridWidth - 1);
    
    // Recreate the path Y position at this X coordinate using the same noise function
    let pathY = this.gridHeight / 2;
    let pathMinRadius = CAVE_PATH_MIN_RADIUS_CELLS;
    let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    
    // Apply the same noise transformations used in generateCave()
    for (let i = 0; i <= gridX; i++) {
      if (i > 0) {
        pathY += (noise(i * CAVE_PATH_Y_NOISE_FACTOR_1, CAVE_PATH_Y_NOISE_OFFSET_1 + currentLevel) - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
        pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1);
      }
    }
    
    let currentPathRadius = map(noise(gridX * CAVE_PATH_RADIUS_NOISE_FACTOR, CAVE_PATH_RADIUS_NOISE_OFFSET + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
    
    // Convert world Y to grid Y
    let gridY = floor(worldY / this.cellSize);
    
    // Check if the point is within the path radius (plus tolerance)
    return abs(gridY - pathY) <= (currentPathRadius + tolerance);
  }

  // Find isolated chambers and connect them to the main path with organic tunnels
  connectIsolatedChambers() {
    // Mark all connected areas starting from the main path
    let connected = [];
    for (let i = 0; i < this.gridWidth; i++) {
      connected[i] = [];
      for (let j = 0; j < this.gridHeight; j++) {
        connected[i][j] = false;
      }
    }
    
    // Flood fill from the main path to mark all connected open areas
    this.floodFillFromMainPath(connected);
    
    // Find isolated chambers (open areas not connected to main path)
    let isolatedChambers = this.findIsolatedChambers(connected);
    
    // Connect each isolated chamber to the main path
    for (let chamber of isolatedChambers) {
      this.carveOrganicConnection(chamber, connected);
    }
  }
  
  // Flood fill algorithm starting from the main path
  floodFillFromMainPath(connected) {
    let queue = [];
    
    // Start flood fill from multiple points along the main path
    for (let i = 0; i < this.gridWidth; i += 5) { // Sample every 5 cells along path
      let pathY = this.getPathYAtGridX(i);
      let pathRadius = this.getPathRadiusAtGridX(i);
      
      // Add points within the path radius as starting points
      for (let j = Math.max(0, Math.floor(pathY - pathRadius)); j <= Math.min(this.gridHeight - 1, Math.ceil(pathY + pathRadius)); j++) {
        if (!this.grid[i][j] && !connected[i][j]) {
          connected[i][j] = true;
          queue.push({x: i, y: j});
        }
      }
    }
    
    // Flood fill to mark all connected areas
    while (queue.length > 0) {
      let current = queue.shift();
      let neighbors = [
        {x: current.x - 1, y: current.y},
        {x: current.x + 1, y: current.y},
        {x: current.x, y: current.y - 1},
        {x: current.x, y: current.y + 1}
      ];
      
      for (let neighbor of neighbors) {
        if (neighbor.x >= 0 && neighbor.x < this.gridWidth && 
            neighbor.y >= 0 && neighbor.y < this.gridHeight &&
            !this.grid[neighbor.x][neighbor.y] && !connected[neighbor.x][neighbor.y]) {
          connected[neighbor.x][neighbor.y] = true;
          queue.push(neighbor);
        }
      }
    }
  }
  
  // Find isolated chambers (groups of connected open cells not connected to main path)
  findIsolatedChambers(connected) {
    let chambers = [];
    let visited = [];
    
    // Initialize visited array
    for (let i = 0; i < this.gridWidth; i++) {
      visited[i] = [];
      for (let j = 0; j < this.gridHeight; j++) {
        visited[i][j] = false;
      }
    }
    
    // Find isolated chambers using flood fill
    for (let i = 0; i < this.gridWidth; i++) {
      for (let j = 0; j < this.gridHeight; j++) {
        if (!this.grid[i][j] && !connected[i][j] && !visited[i][j]) {
          // Found start of an isolated chamber
          let chamber = this.findChamberExtent(i, j, connected, visited);
          if (chamber.cells.length >= 10) { // Only connect chambers with at least 10 open cells
            chambers.push(chamber);
          }
        }
      }
    }
    
    return chambers;
  }
  
  // Find the extent of a chamber starting from a given point
  findChamberExtent(startX, startY, connected, visited) {
    let chamber = {
      cells: [],
      centerX: 0,
      centerY: 0
    };
    
    let queue = [{x: startX, y: startY}];
    visited[startX][startY] = true;
    
    while (queue.length > 0) {
      let current = queue.shift();
      chamber.cells.push(current);
      
      let neighbors = [
        {x: current.x - 1, y: current.y},
        {x: current.x + 1, y: current.y},
        {x: current.x, y: current.y - 1},
        {x: current.x, y: current.y + 1}
      ];
      
      for (let neighbor of neighbors) {
        if (neighbor.x >= 0 && neighbor.x < this.gridWidth && 
            neighbor.y >= 0 && neighbor.y < this.gridHeight &&
            !this.grid[neighbor.x][neighbor.y] && !connected[neighbor.x][neighbor.y] && 
            !visited[neighbor.x][neighbor.y]) {
          visited[neighbor.x][neighbor.y] = true;
          queue.push(neighbor);
        }
      }
    }
    
    // Calculate chamber center
    let sumX = 0, sumY = 0;
    for (let cell of chamber.cells) {
      sumX += cell.x;
      sumY += cell.y;
    }
    chamber.centerX = Math.floor(sumX / chamber.cells.length);
    chamber.centerY = Math.floor(sumY / chamber.cells.length);
    
    return chamber;
  }
  
  // Carve an organic connection from isolated chamber to main path
  carveOrganicConnection(chamber, connected) {
    let startX = chamber.centerX;
    let startY = chamber.centerY;
    
    // Find closest point on main path
    let closestPathX = 0;
    let closestPathY = 0;
    let minDist = Infinity;
    
    for (let i = 0; i < this.gridWidth; i++) {
      let pathY = this.getPathYAtGridX(i);
      let dist = Math.sqrt((i - startX) * (i - startX) + (pathY - startY) * (pathY - startY));
      if (dist < minDist) {
        minDist = dist;
        closestPathX = i;
        closestPathY = Math.floor(pathY);
      }
    }
    
    // Carve organic tunnel from chamber to main path
    this.carveOrganicTunnel(startX, startY, closestPathX, closestPathY, connected);
  }
  
  // Carve an organic tunnel between two points with submarine-friendly width
  carveOrganicTunnel(fromX, fromY, toX, toY, connected) {
    let currentX = fromX;
    let currentY = fromY;
    let tunnelRadius = 2; // Wide enough for submarine (2 cells radius = 4 cell diameter)
    
    // Use noise to create organic path variation
    let noiseOffsetX = random(1000);
    let noiseOffsetY = random(1000);
    let step = 0;
    
    while (Math.abs(currentX - toX) > 1 || Math.abs(currentY - toY) > 1) {
      // Calculate general direction to target
      let dirX = toX - currentX;
      let dirY = toY - currentY;
      let dist = Math.sqrt(dirX * dirX + dirY * dirY);
      
      if (dist > 0) {
        dirX /= dist;
        dirY /= dist;
      }
      
      // Add organic variation using noise
      let noiseInfluence = 0.3; // How much noise affects the path
      let noiseFactor = 0.1;
      let noiseX = (noise(step * noiseFactor, noiseOffsetX) - 0.5) * noiseInfluence;
      let noiseY = (noise(step * noiseFactor, noiseOffsetY) - 0.5) * noiseInfluence;
      
      // Combine direction with noise
      dirX = dirX * (1 - noiseInfluence) + noiseX;
      dirY = dirY * (1 - noiseInfluence) + noiseY;
      
      // Move toward target with organic variation
      currentX += dirX;
      currentY += dirY;
      
      // Constrain to grid bounds
      currentX = constrain(currentX, tunnelRadius, this.gridWidth - tunnelRadius - 1);
      currentY = constrain(currentY, tunnelRadius, this.gridHeight - tunnelRadius - 1);
      
      // Carve out tunnel with submarine-friendly radius
      for (let dx = -tunnelRadius; dx <= tunnelRadius; dx++) {
        for (let dy = -tunnelRadius; dy <= tunnelRadius; dy++) {
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= tunnelRadius) {
            let cellX = Math.floor(currentX + dx);
            let cellY = Math.floor(currentY + dy);
            
            if (cellX >= 0 && cellX < this.gridWidth && cellY >= 0 && cellY < this.gridHeight) {
              this.grid[cellX][cellY] = false; // Carve open space
              connected[cellX][cellY] = true; // Mark as connected
            }
          }
        }
      }
      
      step++;
      
      // Safety check to prevent infinite loops
      if (step > 1000) break;
    }
  }
  
  // Helper method to get path Y position at a given grid X coordinate
  getPathYAtGridX(gridX) {
    let pathY = this.gridHeight / 2;
    let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    
    for (let i = 0; i <= gridX; i++) {
      if (i > 0) {
        pathY += (noise(i * CAVE_PATH_Y_NOISE_FACTOR_1, CAVE_PATH_Y_NOISE_OFFSET_1 + currentLevel) - 0.5) * CAVE_PATH_Y_NOISE_MULT_1;
        pathY = constrain(pathY, pathMaxRadius + 1, this.gridHeight - pathMaxRadius - 1);
      }
    }
    
    return pathY;
  }
  
  // Helper method to get path radius at a given grid X coordinate
  getPathRadiusAtGridX(gridX) {
    let pathMinRadius = CAVE_PATH_MIN_RADIUS_CELLS;
    let pathMaxRadius = CAVE_PATH_MAX_RADIUS_CELLS;
    return map(noise(gridX * CAVE_PATH_RADIUS_NOISE_FACTOR, CAVE_PATH_RADIUS_NOISE_OFFSET + currentLevel), 0, 1, pathMinRadius, pathMaxRadius);
  }
}
