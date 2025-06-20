// JSONBase.io High Score Service
// Replaces the old JSONBin.io implementation

class JSONBaseHighScores {
  constructor() {
    // IMPORTANT: These are your actual JSONBase.io credentials
    this.documentId = 'o15FSkhapPNV';
    this.secretKey = 'secretPkU1gB882EBQhOTXFiZ4KyN9k3XmE9Ok';
    
    // Using the URL that responds with a proper error message
    this.baseUrl = 'https://api.jsonbase.io/o15FSkhapPNV/highscore/scores';
    
    // Cache for high scores
    this.cachedScores = null;
    this.lastCacheTime = 0;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Load from localStorage first (if available)
    this._loadCachedScoresFromStorage();
    
    // Start loading scores in the background immediately
    this._preloadScores();
  }
  
  /**
   * Preloads high scores in the background when the game starts
   * @private
   */
  _preloadScores() {
    console.log('Preloading high scores in background...');
    setTimeout(() => {
      this._fetchAndCacheScores()
        .then(() => console.log('High scores preloaded successfully'))
        .catch(error => console.error('Error preloading high scores:', error));
    }, 500); // Small delay to not interfere with game startup
  }
  
  /**
   * Loads cached scores from localStorage
   * @private
   */
  _loadCachedScoresFromStorage() {
    try {
      const storageData = localStorage.getItem('reactorDiveHighScores');
      if (storageData) {
        const data = JSON.parse(storageData);
        this.cachedScores = data.scores;
        this.lastCacheTime = data.timestamp;
        console.log('Loaded high scores from localStorage');
      }
    } catch (e) {
      console.error('Failed to load cached scores from localStorage:', e);
    }
  }
  
  /**
   * Saves scores to localStorage for caching
   * @private
   * @param {Array} scores - Array of high score objects
   */
  _saveCachedScoresToStorage(scores) {
    try {
      const data = {
        scores: scores,
        timestamp: Date.now()
      };
      localStorage.setItem('reactorDiveHighScores', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save scores to localStorage:', e);
    }
  }
  
  /**
   * Fetches scores from the remote API and updates cache
   * @private
   * @returns {Promise<Array>} Promise resolving to array of high scores
   */
  async _fetchAndCacheScores() {
    console.log('Fetching fresh high scores from JSONBase.io...');
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'secret': this.secretKey.replace('secret', ''),
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('High score collection is empty or not found. Returning empty array.');
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();
      
      if (!data || !Array.isArray(data)) {
        data = [];
      }
      
      // Ensure the high scores are sorted correctly (descending by score)
      data.sort((a, b) => {
        const scoreA = typeof a.score === 'string' ? parseInt(a.score) : a.score;
        const scoreB = typeof b.score === 'string' ? parseInt(b.score) : b.score;
        return scoreB - scoreA;
      });
      
      // Only keep the top 10 scores
      const topScores = data.slice(0, 10);
      
      // Update cache
      this.cachedScores = topScores;
      this.lastCacheTime = Date.now();
      
      // Save to localStorage
      this._saveCachedScoresToStorage(topScores);
      
      return topScores;
    } catch (error) {
      console.error("Could not fetch high scores:", error);
      // Return null to indicate fetch error
      return null;
    }
  }

  /**
   * Fetches the current high scores from JSONBase.io or cache
   * @returns {Promise<Array>} A promise that resolves with the high scores array.
   */
  async getHighScores() {
    // Return cached scores if they're fresh enough
    if (this.cachedScores && Date.now() - this.lastCacheTime < this.cacheDuration) {
      console.log('Using cached high scores');
      return this.cachedScores;
    }
    
    // Otherwise, fetch fresh scores
    const scores = await this._fetchAndCacheScores();
    // If fetch failed but we have cached scores, use those as fallback
    if (scores === null && this.cachedScores) {
      console.log('Fetch failed, using cached scores as fallback');
      return this.cachedScores;
    }
    
    return scores || [];
  }

  /**
   * Submits a new score to the high scores list.
   * @param {string} name - The player's name.
   * @param {number} score - The player's score.
   * @returns {Promise<void>}
   */
  async submitScore(name, score) {
    console.log(`Submitting score for ${name}: ${score}`);
    try {
      // 1. Get the current list of scores
      const highScores = await this.getHighScores();

      // 2. Add the new score
      highScores.push({ name, score });

      // 3. Sort the scores in descending order by score value
      highScores.sort((a, b) => {
        // Make sure we're comparing numbers, not strings
        const scoreA = typeof a.score === 'string' ? parseInt(a.score) : a.score;
        const scoreB = typeof b.score === 'string' ? parseInt(b.score) : b.score;
        return scoreB - scoreA; // Descending order (highest first)
      });

      // 4. Keep only the top 10 scores
      const updatedScores = highScores.slice(0, 10);

      // 5. Save the updated list back to JSONBase.io
      const response = await fetch(this.baseUrl, {
        method: 'PUT',  // PUT is more appropriate for replacing an entire resource
        headers: {
          'Content-Type': 'application/json',
          'secret': this.secretKey.replace('secret', ''),
        },
        body: JSON.stringify(updatedScores), // Send the array directly
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update our cache with the new scores
      this.cachedScores = updatedScores;
      this.lastCacheTime = Date.now();
      this._saveCachedScoresToStorage(updatedScores);

      console.log('High score submitted successfully.');
    } catch (error) {
      console.error("Could not submit high score:", error);
      // Re-throw the error to be caught by the caller
      throw error;
    }
  }

  /**
   * Checks if a given score qualifies to be on the high score list.
   * @param {number} score - The score to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the score is a high score.
   */
  async isHighScore(score) {
    if (score <= 0) {
      return false;
    }
    
    try {
      const highScores = await this.getHighScores();

      // If there are fewer than 10 scores, any new score is a high score.
      if (highScores.length < 10) {
        return true;
      }

      // Otherwise, check if the new score is greater than the lowest score.
      let lowestScore = highScores[highScores.length - 1].score;
      // Convert to number if it's stored as string
      if (typeof lowestScore === 'string') {
        lowestScore = parseInt(lowestScore);
      }
      return score > lowestScore;
    } catch (error) {
      console.error("Could not verify high score:", error);
      return false;
    }
  }
}
