// --- JSONBin HighScore Manager ---
class JSONBinHighScores {
  constructor() {
    // API Configuration
    this.apiKey = '$2a$10$XRHnUXHeO2GrvFemcCQxvOZTa9EyvkQsd8HELile0yws/UkuVIC46';
    this.accessKey = '$2a$10$7wznneBgwFUQbnCsNIQ.eO/O9UBheBQomVH6oNlSv7voOtxDaawFW';
    this.accessKeyId = '684eb2228960c979a5aa3f65';
    
    // Bin Configuration
    this.binId = '6853faef8960c979a5acc795'; // Fixed global bin ID
    this.baseUrl = 'https://api.jsonbin.io/v3/b';
    this.binName = 'SUBMARINE';
    
    // Score Configuration
    this.maxScoresDisplayed = 10;
    this.maxScoresStored = 50;
    this.maxNameLength = 20;
  }

  async initializeBin() {
    try {
      const response = await this.fetchBinData();
      
      if (response.ok) {
        console.log('Using existing global SUBMARINE highscore bin:', this.binId);
        return true;
      } else {
        console.error('Global bin not accessible, status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error accessing global bin:', error);
      return false;
    }
  }
  
  async fetchBinData() {
    return fetch(`${this.baseUrl}/${this.binId}`, {
      headers: this.getRequestHeaders()
    });
  }
  
  getRequestHeaders() {
    return {
      'X-Master-Key': this.apiKey,
      'X-Access-Key': this.accessKey
    };
  }

  async getHighScores() {
    if (!this.binId) {
      const initialized = await this.initializeBin();
      if (!initialized) return [];
    }

    try {
      const data = await this.getCurrentBinData();
      if (!data) return [];
      
      const scores = data.scores || [];
      return this.sortAndLimitScores(scores, this.maxScoresDisplayed);
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  }
  
  sortAndLimitScores(scores, limit) {
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async submitScore(playerName, score) {
    if (!this.binId) {
      const initialized = await this.initializeBin();
      if (!initialized) return false;
    }

    try {
      const currentData = await this.getCurrentBinData();
      if (!currentData) return false;

      const newScore = this.createScoreEntry(playerName, score);
      const updatedData = this.addScoreToData(currentData, newScore);
      
      return await this.updateBinData(updatedData);
    } catch (error) {
      console.error('Error submitting score:', error);
      return false;
    }
  }
  
  createScoreEntry(playerName, score) {
    return {
      name: playerName.substring(0, this.maxNameLength),
      score: score,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      gameVersion: '1.0'
    };
  }
  
  addScoreToData(currentData, newScore) {
    if (!currentData.scores) currentData.scores = [];
    
    currentData.scores.push(newScore);
    currentData.scores = this.sortAndLimitScores(currentData.scores, this.maxScoresStored);
    
    return currentData;
  }
  
  async updateBinData(data) {
    const response = await fetch(`${this.baseUrl}/${this.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getRequestHeaders()
      },
      body: JSON.stringify(data)
    });

    return response.ok;
  }

  async getCurrentBinData() {
    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
        headers: this.getRequestHeaders()
      });
      
      return response.ok ? (await response.json()).record : null;
    } catch (error) {
      console.error('Error fetching bin data:', error);
      return null;
    }
  }

  async isHighScore(score) {
    const scores = await this.getHighScores();
    return scores.length < this.maxScoresDisplayed || 
           score > (scores[scores.length - 1]?.score || 0);
  }
}