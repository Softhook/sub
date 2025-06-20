// JSONBase.io High Score Service
// Replaces the old JSONBin.io implementation

class JSONBaseHighScores {
  constructor() {
    // IMPORTANT: These are your actual JSONBase.io credentials
    this.documentId = 'o15FSkhapPNV';
    this.secretKey = 'secretPkU1gB882EBQhOTXFiZ4KyN9k3XmE9Ok';
    
    // Using the URL that responds with a proper error message
    this.baseUrl = 'https://api.jsonbase.io/o15FSkhapPNV/highscore/scores';
  }

  /**
   * Fetches the current high scores from JSONBase.io
   * @returns {Promise<Array>} A promise that resolves with the high scores array.
   */
  async getHighScores() {
    console.log('Fetching high scores from JSONBase.io...');
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'secret': this.secretKey.replace('secret', ''),
        },
      });

      if (!response.ok) {
        // If the collection is not found, JSONBase returns 404, treat as empty.
        if (response.status === 404) {
          console.log('High score collection is empty or not found. Returning empty array.');
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // The data should be an array of scores.
      return data || [];
    } catch (error) {
      console.error("Could not fetch high scores:", error);
      // Return an empty array on error to prevent game from crashing
      return [];
    }
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

      // 3. Sort the scores in descending order
      highScores.sort((a, b) => b.score - a.score);

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
      const lowestScore = highScores[highScores.length - 1].score;
      return score > lowestScore;
    } catch (error) {
      console.error("Could not verify high score:", error);
      return false;
    }
  }
}
