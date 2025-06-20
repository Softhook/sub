// --- Utility Functions ---

// Distance calculation
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Angle calculation between two points
function angleToTarget(fromX, fromY, toX, toY) {
    return Math.atan2(toY - fromY, toX - fromX);
}

// Clamp a value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Linear interpolation
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Convert world coordinates to screen coordinates
function worldToScreen(worldX, worldY) {
    return {
        x: worldX - camera.x + width / 2,
        y: worldY - camera.y + height / 2
    };
}

// Convert screen coordinates to world coordinates
function screenToWorld(screenX, screenY) {
    return {
        x: screenX + camera.x - width / 2,
        y: screenY + camera.y - height / 2
    };
}

// Check if a point is on screen (with buffer)
function isOnScreen(worldX, worldY, buffer = 0) {
    const screen = worldToScreen(worldX, worldY);
    return screen.x >= -buffer && 
           screen.x <= width + buffer && 
           screen.y >= -buffer && 
           screen.y <= height + buffer;
}

// Check if a circle is on screen
function isCircleOnScreen(worldX, worldY, radius) {
    return isOnScreen(worldX, worldY, radius);
}

// Wrap angle to [-PI, PI]
function wrapAngle(angle) {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
}

// Calculate angle difference (shortest path)
function angleDifference(angle1, angle2) {
    let diff = angle2 - angle1;
    return wrapAngle(diff);
}

// Random float between min and max
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check circle-circle collision
function circleCollision(x1, y1, r1, x2, y2, r2) {
    return distance(x1, y1, x2, y2) < r1 + r2;
}

// Check point-in-circle collision
function pointInCircle(px, py, cx, cy, radius) {
    return distance(px, py, cx, cy) <= radius;
}

// Check point-in-rectangle collision
function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

// Get random point in circle
function randomPointInCircle(centerX, centerY, radius) {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.sqrt(Math.random()) * radius;
    return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
    };
}

// Get random point in rectangle
function randomPointInRect(x, y, w, h) {
    return {
        x: x + Math.random() * w,
        y: y + Math.random() * h
    };
}

// Normalize vector
function normalizeVector(x, y) {
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude === 0) return { x: 0, y: 0 };
    return { x: x / magnitude, y: y / magnitude };
}

// Rotate point around center
function rotatePoint(pointX, pointY, centerX, centerY, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = pointX - centerX;
    const dy = pointY - centerY;
    return {
        x: centerX + dx * cos - dy * sin,
        y: centerY + dx * sin + dy * cos
    };
}

// Check if point is inside polygon (ray casting algorithm)
function pointInPolygon(px, py, vertices) {
    let inside = false;
    const n = vertices.length;
    
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = vertices[i].x;
        const yi = vertices[i].y;
        const xj = vertices[j].x;
        const yj = vertices[j].y;
        
        if (((yi > py) !== (yj > py)) && 
            (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    
    return inside;
}

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Check if device is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check if device is in landscape mode
function isLandscape() {
    return width > height;
}

// Check if screen is narrow (mobile portrait or small window)
function isNarrowScreen() {
    return width < 600;
}

// Check if screen is short (mobile landscape)
function isShortScreen() {
    return height < 500;
}

// Get responsive text size based on screen size
function getResponsiveTextSize(baseSize) {
    const scaleFactor = Math.min(width / 800, height / 600);
    return Math.max(12, baseSize * scaleFactor);
}

// Get safe area for UI elements (avoiding notches, etc.)
function getSafeArea() {
    return {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
    };
}

// Debounce function for limiting function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for limiting function calls
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
